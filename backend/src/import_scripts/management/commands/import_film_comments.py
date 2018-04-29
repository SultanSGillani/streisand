# -*- coding: utf-8 -*-

from pytz import UTC

from import_scripts.management.commands import MySQLCommand
from films.models import Film
from users.models import User


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM torrents_comments
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM torrents_comments
    """

    help = "Import film comments"

    def handle_row(self, row):

        torrent_group_id = row['GroupID']
        author_id = row['AuthorID']
        body = row['Body']
        submit_date = row['AddedTime']
        edit_date = row['EditedTime']

        try:
            author = User.objects.get(old_id=author_id)
        except User.DoesNotExist:
            return
        try:
            film = Film.objects.get(old_id=torrent_group_id)
        except Film.DoesNotExist:
            return

        comment = film.comments.create(
            author=author,
            text=body.encode('latin-1').decode('utf-8') if body else '',
        )
        comment.created_at = submit_date.replace(tzinfo=UTC)
        if edit_date:
            comment.modified_at = edit_date.replace(tzinfo=UTC)
        else:
            comment.modified_at = comment.created_at
        comment.save()
