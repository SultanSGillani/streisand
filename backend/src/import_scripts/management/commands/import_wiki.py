# -*- coding: utf-8 -*-

from pytz import UTC

from import_scripts.management.commands import MySQLCommand

from wiki.models import WikiArticle
from users.models import User, UserClass


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM wiki_articles
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM wiki_articles
    """

    help = "Import wiki articles"

    def handle_row(self, row):

        old_id = row['ID']
        author_id = row['Author']
        title = row['Title']
        body = row['Body']
        modified_at = row['Date']

        try:
            modified_by = User.objects.get(old_id=author_id)
        except User.DoesNotExist:
            modified_by = None

        article = WikiArticle.objects.create(
            old_id=old_id,
            title=title,
            body=body.encode('latin-1').decode('utf-8'),
            modified_by=modified_by,
            read_access_minimum_user_class=self.moderator_user_class,
            write_access_minimum_user_class=self.moderator_user_class,
        )

        WikiArticle.objects.filter(id=article.id).update(modified_at=modified_at.replace(tzinfo=UTC))

    def pre_sql(self):
        self.moderator_user_class = UserClass.objects.get(name='Moderator')
