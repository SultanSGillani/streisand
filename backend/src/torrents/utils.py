# -*- coding: utf-8 -*-

from binascii import b2a_base64, a2b_hex
from hashlib import sha3_256
from io import BytesIO
from uuid import UUID, uuid4

from rest_framework.parsers import FileUploadParser, DataAndFiles
from rest_framework.exceptions import ParseError

from django.conf import settings
from django.core.files.uploadhandler import FileUploadHandler, StopFutureHandlers
from django.core.files.uploadedfile import InMemoryUploadedFile

from api.exceptions import TorrentFileTooLargeException
from tracker.bencoding import bdecode, BencodeError


def generate_unique_download_key(torrent_info_hash, user_download_key):

    if isinstance(torrent_info_hash, str):
        torrent_info_hash = a2b_hex(torrent_info_hash)

    if isinstance(user_download_key, UUID):
        user_download_key = user_download_key.bytes
    elif isinstance(user_download_key, str):
        user_download_key = a2b_hex(user_download_key.replace('-', ''))

    m = sha3_256()
    m.update(torrent_info_hash)
    m.update(user_download_key)

    return m.hexdigest()


class TorrentFileUploadParser(FileUploadParser):
    """
    Is this a valid torrent file?  If so, let's parse it into a data dictionary.
    """

    def get_filename(self, *args, **kwargs):
        return uuid4().hex

    def parse(self, stream, media_type=None, parser_context=None):
        """
        Treats the incoming bytestream as a raw file upload and returns a `DataAndFiles` object.

        `.data` will be the parsed content of the torrent's metainfo dictionary.
        `.files` will be None.
        """

        request = parser_context['request']
        request.upload_handlers = [TorrentFileUploadHandler()]

        data_and_files = super().parse(stream, media_type, parser_context)

        torrent_file = data_and_files.files['file']
        metainfo_dict = self.parse_torrent_file(torrent_file)
        data = self.parse_metainfo_dict(metainfo_dict)

        return DataAndFiles(data, {})

    @staticmethod
    def parse_torrent_file(torrent_file):

        torrent_file_contents = torrent_file.read()

        try:
            metainfo_dict = bdecode(torrent_file_contents)
            assert isinstance(metainfo_dict, dict)
        except (BencodeError, AssertionError):
            raise ParseError("The file is not a valid bencoded torrent file")

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
        except (KeyError, TypeError):
            raise ParseError("Info dict must contain pieces!")

        return data

    @staticmethod
    def _get_file_list(metainfo_files):

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

    @staticmethod
    def _get_file_dict(metainfo_info):

        try:

            file_dict = {
                'name': metainfo_info['name'],
                'size_in_bytes': metainfo_info['length'],
            }

        except KeyError:
            raise ParseError("Failed to parse file info!")

        return file_dict


class TorrentFileUploadHandler(FileUploadHandler):

    def handle_raw_input(self, input_data, meta, content_length, boundary, encoding=None):
        if content_length > settings.TORRENT_FILE_UPLOAD_MAX_SIZE:
            raise TorrentFileTooLargeException()

    def new_file(self, *args, **kwargs):
        super().new_file(*args, **kwargs)
        self.file = BytesIO()
        raise StopFutureHandlers()

    def receive_data_chunk(self, raw_data, start):
        self.file.write(raw_data)

    def file_complete(self, file_size):
        self.file.seek(0)
        return InMemoryUploadedFile(
            file=self.file,
            field_name=self.field_name,
            name=self.file_name,
            content_type=self.content_type,
            size=file_size,
            charset=self.charset,
            content_type_extra=self.content_type_extra
        )
