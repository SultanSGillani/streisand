# -*- coding: utf-8 -*-

from binascii import b2a_hex
from urllib.parse import unquote_to_bytes


def unquote_to_hex(string):
    return b2a_hex(unquote_to_bytes(string)).decode('ascii')
