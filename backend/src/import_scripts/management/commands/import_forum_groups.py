# -*- coding: utf-8 -*-

from import_scripts.management.commands import MySQLCommand

from forums.models import ForumGroup


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM forums_groups ORDER BY Sort
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM forums_groups
    """

    help = "Import forum groups"

    def handle_row(self, row):

        old_id = row['ID']
        sort = row['Sort']
        name = row['Name']

        ForumGroup.objects.create(
            old_id=old_id,
            sort_order=sort,
            name=name,
        )
