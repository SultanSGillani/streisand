# -*- coding: utf-8 -*-

from binascii import b2a_base64
from hashlib import sha3_256

from rest_framework.parsers import FileUploadParser, DataAndFiles
from rest_framework.exceptions import ParseError

from tracker.bencoding import bdecode, BencodeError


def generate_unique_download_key(info_hash, user_download_key):
    m = sha3_256()
    m.update(info_hash)
    m.update(user_download_key)
    return m.hexdigest()


class TorrentFileUploadParser(FileUploadParser):
    """
    Is this a valid torrent file?  If so, let's parse it into a data dictionary.
    """

    media_type = 'application/x-bittorrent'

    def parse(self, stream, media_type=None, parser_context=None):
        """
        Treats the incoming bytestream as a raw file upload and returns a `DataAndFiles` object.

        `.data` will be the parsed content of the torrent's metainfo dictionary.
        `.files` will be None.
        """
        data_and_files = super().parse(stream, media_type, parser_context)
        torrent_file = data_and_files.files['file']
        metainfo_dict = self.parse_torrent_file(torrent_file)
        data = self.parse_metainfo_dict(metainfo_dict)
        return DataAndFiles(data, {})

    @staticmethod
    def parse_torrent_file(torrent_file):

        if not torrent_file.name.endswith('.torrent'):
            raise ParseError("The file extension is not .torrent")

        torrent_file_contents = torrent_file.read()

        try:
            metainfo_dict = bdecode(torrent_file_contents)
        except BencodeError:
            raise ParseError("The file is not a valid bencoded torrent file")

        assert isinstance(metainfo_dict, dict)

        return metainfo_dict

    def parse_metainfo_dict(self, metainfo_dict):

        data = dict()
        info_dict = metainfo_dict['info']

        try:
            data['created_by'] = metainfo_dict['created by']
        except KeyError:
            pass

        if 'files' in info_dict:

            data['is_single_file'] = False
            data['directory_name'] = info_dict['name']
            data['files'] = self._get_file_list(info_dict['files'])

        else:

            data['is_single_file'] = True
            data['file'] = self._get_file_dict(info_dict)

        try:
            data['piece_size_in_bytes'] = info_dict['piece length']
        except KeyError:
            raise ParseError("Info dict must contain piece length!")

        try:
            data['pieces'] = b2a_base64(info_dict['pieces']).decode('utf-8')
        except KeyError:
            raise ParseError("Info dict must contain pieces!")

        return data

    def _get_file_list(self, metainfo_files):

        try:

            file_list = [
                {
                    'path_components': file['path'],
                    'size_in_bytes': file['length'],
                }
                for file in metainfo_files
            ]

        except KeyError:
            raise ParseError("Failed to parse file list!")

        return file_list

    def _get_file_dict(self, metainfo_info):

        try:

            file_dict = {
                'name': metainfo_info['name'],
                'size_in_bytes': metainfo_info['length'],
            }

        except KeyError:
            raise ParseError("Failed to parse file info!")

        return file_dict
