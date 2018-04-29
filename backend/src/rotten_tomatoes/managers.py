# -*- coding: utf-8 -*-

import requests

from django.conf import settings
from django.db import models
from django.utils.timezone import now

from imdb.managers import FilmIMDbManager


class FilmRottenTomatoesManager(models.Manager):

    API_BASE_URL = 'http://api.rottentomatoes.com/api/public/v1.0'

    def create_from_imdb_tt_id(self, tt_id):

        tt_id = FilmIMDbManager.tt_id_from_string(tt_id)
        metadata = self.get_metadata(imdb_id=tt_id)

        return self.create(
            id=metadata['id'],
            url=metadata['url'],
            title=metadata['title'],
            year=metadata['year'],
            critics_rating=metadata['critics_rating'],
            critics_rating_string=metadata['critics_rating_string'],
            audience_rating=metadata['audience_rating'],
            audience_rating_string=metadata['audience_rating_string'],
            runtime_in_minutes=metadata['runtime_in_minutes'],
            last_updated=now(),
        )

    @classmethod
    def get_metadata(cls, rt_id=None, imdb_id=None):

        api_results = cls._fetch_api_results(rt_id=rt_id, imdb_id=imdb_id)
        return {
            'id': api_results['id'],
            'url': api_results['links']['alternate'],
            'title': api_results['title'],
            'year': api_results['year'],
            'critics_rating': api_results['ratings']['critics_score'],
            'critics_rating_string': api_results['ratings']['critics_rating'],
            'audience_rating': api_results['ratings']['audience_score'],
            'audience_rating_string': api_results['ratings']['audience_rating'],
            'runtime_in_minutes': api_results['runtime'],
        }

    @classmethod
    def _fetch_api_results(cls, rt_id=None, imdb_id=None):

        if rt_id is not None:
            response = requests.get(
                url=cls.API_BASE_URL + '/movies/{rt_id}.json'.format(rt_id=rt_id),
                params={
                    'apikey': settings.RT_API_KEY,
                }
            )
        elif imdb_id is not None:
            response = requests.get(
                url=cls.API_BASE_URL + '/movie_alias.json',
                params={
                    'type': 'imdb',
                    'id': imdb_id[2:],
                    'apikey': settings.RT_API_KEY,
                }
            )
        else:
            raise RottenTomatoesError('No ID given for API lookup')

        try:
            response.raise_for_status()
            response = response.json()
        except requests.RequestException as e:
            raise RottenTomatoesError(e)

        if 'error' in response:
            raise RottenTomatoesError(response['error'])
        else:
            return response


class RottenTomatoesError(Exception):
    pass
