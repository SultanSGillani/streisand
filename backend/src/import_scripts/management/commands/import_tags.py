# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand

from films.models import Tag


class Command(BaseCommand):

    help = "Import tags"

    def handle(self, *args, **options):
        tag_names = [
            'Adventure', 'Animation', 'History', 'Mystery', 'Comedy', 'Anime', 'Action',
            'Drama', 'Crime', 'Sci-Fi', 'Thriller', 'Romance', 'Foreign', 'Family', 'Fantasy',
            'Musical', 'Western', 'Horror', 'War', 'Documentary', 'Music', 'Biography',
            'Sport', 'Indie', 'Political', 'Short', 'Film-Noir', 'Stand-Up', '',
        ]
        Tag.objects.bulk_create([Tag(name=tag_name) for tag_name in tag_names])
