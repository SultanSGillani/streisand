# -*- coding: utf-8 -*-

from pytz import UTC

from import_scripts.management.commands import MySQLCommand

from imdb.models import FilmIMDb


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM imdb_information
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM imdb_information
    """

    help = "Import IMDb information"

    def handle_row(self, row):

        imdb_id = row['imdbID']
        rating = row['rating']
        rating_vote_count = row['votes']
        runtime_in_minutes = row['runtime']
        last_updated = row['updatedOn']

        FilmIMDb.objects.create(
            id=imdb_id,
            rating=rating,
            rating_vote_count=rating_vote_count,
            runtime_in_minutes=runtime_in_minutes,
            last_updated=last_updated.replace(tzinfo=UTC) if last_updated else None,
        )
