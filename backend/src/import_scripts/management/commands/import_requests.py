# -*- coding: utf-8 -*-

from pytz import UTC

from import_scripts.management.commands import MySQLCommand
from imdb.models import FilmIMDb
from films.models import Film
from torrent_requests.models import TorrentRequest
from torrents.models import Torrent
from users.models import User


class Command(MySQLCommand):

    """
    Old requests will have their bounty fronted by the system, because a refund of the
    bounty was not possible under the old system anyway.  New requests will track
    per-user votes, and we can refund to those users if we want.
    """

    SQL = """SELECT * FROM requests"""
    COUNT_SQL = """SELECT COUNT(*) FROM requests"""

    help = "Import torrent requests"

    def handle_row(self, row):

        request_id = row['ID']
        requester_id = row['UserID']
        request_name = row['Name']
        imdb_id = row['imdbID']
        created_at = row['Time']
        bbcode_description = row['Description']
        filling_torrent_id = row['TorrentID']
        bounty = row['Bounty']
        source_media = row['media']
        resolution = row['Encoding']
        codec = row['Format']
        container = row['container']

        if container == 'Matroska':
            container = 'MKV'

        requester = User.objects.filter(old_id=requester_id).first()
        description = bbcode_description.encode('latin-1').decode('utf-8').strip() if bbcode_description else ''

        try:
            film = Film.objects.get(imdb_id=imdb_id)
        except (Film.DoesNotExist, Film.MultipleObjectsReturned):
            film_title = request_name.encode('latin-1').decode('utf-8').strip()
            film_year = None
        else:
            film_title = film.title
            film_year = film.year

        if not FilmIMDb.objects.filter(id=imdb_id).exists():
            imdb_id = None

        torrent_request = TorrentRequest.objects.create(
            old_id=request_id,
            created_by=requester,
            imdb_id=imdb_id,
            film_title=film_title,
            film_year=film_year,
            description=description,
            filling_torrent=Torrent.objects.filter(old_id=filling_torrent_id).first(),
            source_media_id=None if source_media == 'ANY' else source_media,
            resolution_id=None if resolution == 'ANY' else resolution,
            codec_id=None if codec == 'ANY' or not codec else 'H.264' if codec == 'h.264' else codec,
            container_id=None if container == 'ANY' else container,
        )
        torrent_request.created_at = created_at.replace(tzinfo=UTC)
        torrent_request.save()

        torrent_request.votes.create(
            author=None,
            bounty_in_bytes=bounty,
        )
