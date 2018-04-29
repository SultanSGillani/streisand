# -*- coding: utf-8 -*-

from pytz import UTC

from import_scripts.management.commands import MySQLCommand

from forums.models import ForumThread
from users.models import User


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM forums_posts
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM forums_posts
    """

    help = "Import forum posts"

    def handle_row(self, row):

        old_id = row['ID']
        author_id = row['AuthorID']
        body = row['Body']
        created_at = row['AddedTime']
        modified_at = row['EditedTime']
        # modified_by = row['EditedUserID']

        forum_thread = ForumThread.objects.get(old_id=row['TopicID'])

        try:
            author = User.objects.get(old_id=author_id)
        except User.DoesNotExist:
            author = None

        forum_post = forum_thread.posts.create(
            old_id=old_id,
            body=body.encode('latin-1').decode('utf-8'),
            author=author,
        )

        forum_post.created_at = created_at.replace(tzinfo=UTC)
        if modified_at:
            forum_post.modified_at = modified_at.replace(tzinfo=UTC)
        else:
            forum_post.modified_at = forum_post.created_at
        forum_post.save()
