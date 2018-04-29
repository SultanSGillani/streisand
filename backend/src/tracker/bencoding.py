# -*- coding: utf-8 -*-

import hashlib
from binascii import b2a_hex


def sha1(data):
    """
    Return the SHA-1 hash of the given data.
    """
    assert isinstance(data, (bytes, bytearray))
    sha1_hash = hashlib.sha1()
    sha1_hash.update(data)
    return sha1_hash.digest()


def info_hash_from_metainfo_dict(metadata_dict):
    return b2a_hex(sha1(bencode(metadata_dict['info']))).decode('utf-8')


def bencode(thing):
    """
    Returns the bencoded version of thing as bytes.

    Allowed object types are:
        - list (list)
        - dictionary (dict)
        - integer (int)
        - string (str)
        - bytes object (bytes)

    @rtype: bytes
    """
    if isinstance(thing, int):
        result = 'i{thing}e'.format(thing=thing).encode('utf-8')

    elif isinstance(thing, str):
        result = bencode(thing.encode('utf-8'))

    elif isinstance(thing, bytes):
        result = str(len(thing)).encode('utf-8')
        result += b':'
        result += thing

    elif isinstance(thing, bytearray):
        result = bencode(bytes(thing))

    elif isinstance(thing, list):
        result = b'l'
        for item in thing:
            result += bencode(item)
        result += b'e'

    elif isinstance(thing, dict):
        keys = list(thing.keys())
        keys.sort()

        result = b'd'
        for key in keys:
            result += bencode(key)
            result += bencode(thing[key])
        result += b'e'

    else:
        raise TypeError(
            'bencoding objects of type "{type}" is not supported'.format(
                type=type(thing)
            )
        )

    assert isinstance(result, bytes), 'Not bytes: [{type}] {result}'.format(type=type(result), result=result)
    return result


def bdecode(data):

    if isinstance(data, bytes):
        decoder = Decoder(data)
        return decoder.decode()
    else:
        raise TypeError("bdecode expected bytes, got {t}.".format(t=type(data)))


class DecodingError(Exception):
    pass


class BDecoder(object):

    def __init__(self, data):
        self.data = data  # BytesIO(data)
        self.index = 0

        self.strict = True
        self.decode_strings = False

    @property
    def current_byte(self):
        """
        Get char (byte) at current position.
        """
        _res = self.data[self.index:self.index + 1]

        # why use slice syntax instead of ordinary random access?
        # because self.data[some_index] would return a byte,
        # that is a number between 0-255.
        #
        # slice syntax, however, returns e.g. b'A' (instead of 65).

        if len(_res) == 0:
            raise DecodingError("Unexpected end of data. Unterminated list/dictionary?")
        return _res

    def decode(self):
        """Decode whatever we find at the current position."""
        _pos_char = self.current_byte

        if _pos_char == b'i':
            self.index += 1
            return self.decode_int()
        elif _pos_char == b'l':
            self.index += 1
            return self.decode_list()
        elif _pos_char == b'd':
            self.index += 1
            return self.decode_dict()
        elif _pos_char.isdigit():
            return self.decode_string()
        else:
            raise DecodingError

    def decode_int(self):
        _start = self.index
        _end = self.data.index(b'e', _start)

        if _start == _end:
            raise DecodingError("Empty integer.")

        self.index = _end + 1

        _int = int(self.data[_start:_end])

        # strict: forbid leading zeroes and negative zero
        if self.strict:
            if bytes(str(_int), "utf-8") != self.data[_start:_end]:
                raise DecodingError("Leading zeroes or negative zero detected.")

        return _int

    def decode_list(self):
        _list = []

        while True:
            if self.current_byte == b'e':
                self.index += 1
                return _list

            _pos = self.index

            try:
                _list.append(self.decode())
            except DecodingError:
                # did the exception happen because there is nothing to decode?
                if _pos == self.index:
                    raise DecodingError("Unterminated list (or invalid list contents).")
                else:
                    raise

        assert False

    def decode_dict(self):
        _dict = {}

        while True:
            if self.current_byte == b'e':
                self.index += 1
                return _dict

            if not self.current_byte.isdigit():
                raise DecodingError("Invalid dictionary key (must be string).")

            key = self.decode_string()
            _dict[key] = self.decode()

        assert False

    def decode_string(self):
        _start = self.index
        _colon = self.data.index(b':', _start)
        _len = int(self.data[_start:_colon])

        if _len < 0:
            raise DecodingError("String with length < 0 found.")

        self.index = _colon + 1 + _len

        _res = self.data[_colon + 1:_colon + 1 + _len]

        if self.decode_strings and not isinstance(_res, str):
            return _res.decode('utf-8')
        else:
            return _res


class Decoder(object):

    def __init__(self, data_in_bytes, char_encoding='utf-8'):
        self.bytes = data_in_bytes
        self.offset = 0
        self.char_encoding = char_encoding

    def decode(self, check_trailer=False):

        char = self.bytes[self.offset:self.offset + 1]
        if not char:
            raise BencodeError("Unexpected end of data at offset %d/%d" % (
                self.offset, len(self.bytes),
            ))

        if char.isdigit():
            # String
            try:
                end = self.bytes.find(b':', self.offset)
                length = int(self.bytes[self.offset:end])
            except (ValueError, TypeError):
                raise BencodeError("Bad string length at offset %d (%r...)" % (
                    self.offset, self.bytes[self.offset:self.offset + 32]
                ))

            self.offset = end + length + 1
            obj = self.bytes[end + 1:self.offset]

            if self.char_encoding:
                try:
                    obj = obj.decode(self.char_encoding)
                except UnicodeError:
                    # deliver non-decodable string (bytes arrays) as-is
                    pass

        elif char == b'i':
            # Integer
            try:
                end = self.bytes.find(b'e', self.offset + 1)
                obj = int(self.bytes[self.offset + 1:end])
            except (ValueError, TypeError):
                raise BencodeError("Bad integer at offset %d (%r...)" % (
                    self.offset, self.bytes[self.offset:self.offset + 32]
                ))
            self.offset = end + 1

        elif char == b'l':
            # List
            self.offset += 1
            obj = []
            while self.bytes[self.offset:self.offset + 1] != b'e':
                obj.append(self.decode())
            self.offset += 1

        elif char == b'd':
            # Dict
            self.offset += 1
            obj = {}
            while self.bytes[self.offset:self.offset + 1] != b'e':
                key = self.decode()
                obj[key] = self.decode()
            self.offset += 1

        else:
            raise BencodeError("Format error at offset %d (%r...)" % (
                self.offset, self.bytes[self.offset:self.offset + 32]
            ))

        if check_trailer and self.offset != len(self.bytes):
            raise BencodeError("Trailing data at offset %d (%r...)" % (
                self.offset, self.bytes[self.offset:self.offset + 32]
            ))

        return obj


class BencodeError(ValueError):
    pass
