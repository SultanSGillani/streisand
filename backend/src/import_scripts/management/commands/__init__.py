# -*- coding: utf-8 -*-

import MySQLdb
from MySQLdb.cursors import SSDictCursor
from tqdm import tqdm

from django.core.management.base import BaseCommand


class MySQLCommand(BaseCommand):

    DB_CONFIG = {
        'user': 'root',
        'password': 'fuckneebs',
        'host': '10.0.2.2',
        'db': 'tc',
        'cursorclass': SSDictCursor,
        'charset': 'latin1',
    }

    SQL = ""
    COUNT_SQL = ""

    help = "*******************************"

    def handle(self, *args, **options):

        self.pre_sql()

        db_connection = MySQLdb.connect(**self.DB_CONFIG)
        cursor = db_connection.cursor()

        if self.COUNT_SQL:
            cursor.execute(self.COUNT_SQL)
            count = cursor.fetchall()[0]['COUNT(*)']
        else:
            count = None

        cursor.execute(self.SQL)
        items = cursor.fetchall()
        for row in tqdm(items, desc=self.help, total=count, unit='items'):
            self.handle_row(row)

        cursor.close()
        db_connection.close()

        self.post_sql()

    def pre_sql(self):
        pass

    def handle_row(self, row):
        pass

    def post_sql(self):
        pass
