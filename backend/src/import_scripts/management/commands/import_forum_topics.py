# -*- coding: utf-8 -*-

from import_scripts.management.commands import MySQLCommand

from forums.models import ForumGroup
from users.models import UserClass


class Command(MySQLCommand):

    SQL = """
        SELECT * FROM forums ORDER BY Sort
    """
    COUNT_SQL = """
        SELECT COUNT(*) FROM forums
    """

    help = "Import forum topics"

    user_class_names = {
        200: 'User',
        275: 'Fanatic',
        350: 'Director',
        500: 'Community Staff',
        550: 'Encoder',
        601: 'Director of Torrentography',
        650: 'Moderator',
        700: 'Developer',
    }

    def handle_row(self, row):

        old_id = row['ID']
        sort = row['Sort']
        name = row['Name']
        description = row['Description']
        forum_group = ForumGroup.objects.get(old_id=row['GroupID'])
        staff_only_thread_creation = (row['MinClassCreate'] == 650)
        min_class = UserClass.objects.get(name=self.user_class_names[row['MinClassRead']])

        forum_group.topics.create(
            old_id=old_id,
            sort_order=sort,
            name=name,
            description=description,
            minimum_user_class=min_class,
            staff_only_thread_creation=staff_only_thread_creation,
        )
