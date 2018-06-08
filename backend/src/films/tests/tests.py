# -*- coding:utf-8 -*-
from django.test import TestCase
from model_mommy import mommy

from films.models import Film, Collection


class FilmTestMommy(TestCase):
    """
    Class to test the model
    Film
    """

    def setUp(self):
        """
        Set up all the tests
        """
        self.film = mommy.make(Film)
        self.collection = mommy.make(Collection)

    def test_film_creation_mommy(self):
        new_film = mommy.make('films.Film')
        new_film_collection = mommy.make('films.Collection', make_m2m=True)
        self.assertTrue(isinstance(new_film, Film))
        self.assertTrue(isinstance(new_film_collection, Collection))

        self.assertEqual(new_film_collection.__str__(), new_film_collection.title)
