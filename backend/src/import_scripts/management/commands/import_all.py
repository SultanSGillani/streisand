# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):

    help = "Import all data from the old site db"

    def handle(self, *args, **options):
        call_command('import_client_whitelist')
        call_command('import_tags')
        call_command('import_imdb')
        call_command('import_films')
        call_command('import_users')
        call_command('import_torrents')
        call_command('import_film_comments')
        call_command('import_requests')
        call_command('import_request_comments')
        call_command('import_request_votes')
        call_command('import_forum_groups')
        call_command('import_forum_topics')
        call_command('import_forum_threads')
        call_command('import_forum_posts')
        call_command('import_wiki')
