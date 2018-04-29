# -*- coding: utf-8 -*-

from import_scripts.management.commands import MySQLCommand
from torrent_requests.models import TorrentRequest
from users.models import User


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM requests_votes
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM requests_votes
    """

    help = "Import request votes"

    def handle_row(self, row):

        request_id = row['RequestID']
        voter_id = row['UserID']

        try:
            voter = User.objects.get(old_id=voter_id)
        except User.DoesNotExist:
            return
        try:
            torrent_request = TorrentRequest.objects.get(old_id=request_id)
        except TorrentRequest.DoesNotExist:
            return

        torrent_request.votes.create(
            author=voter,
            bounty_in_bytes=0,
        )
