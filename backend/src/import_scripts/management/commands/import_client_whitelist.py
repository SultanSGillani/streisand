# -*- coding: utf-8 -*-

from import_scripts.management.commands import MySQLCommand
from tracker.models import TorrentClient


class Command(MySQLCommand):

    SQL = """SELECT * FROM xbt_client_whitelist ORDER BY peer_id"""
    COUNT_SQL = """SELECT COUNT(*) FROM xbt_client_whitelist"""

    help = "Import whitelisted clients"

    def handle_row(self, row):

        peer_id_prefix = row['peer_id']
        name = row['vstring'].encode('latin-1').decode('utf-8')
        TorrentClient.objects.create(
            peer_id_prefix=peer_id_prefix,
            name=name,
            is_whitelisted=True,
        )
