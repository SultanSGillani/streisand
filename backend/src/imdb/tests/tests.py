# -*- coding:utf-8 -*-

from model_mommy import mommy

from django.test import TestCase

from imdb.models import FilmIMDb


class FilmIMDbTestMommy(TestCase):
    """
    Class to test the imdb model
    """

    def setUp(self):
        """
        Set up all the tests
        """
        self.imdb = mommy.make(FilmIMDb)

    def test_imdb_creation_mommy(self):
        new_imdb = mommy.make('imdb.FilmIMDb')
        self.assertTrue(isinstance(new_imdb, FilmIMDb))
        self.assertEqual(new_imdb.__str__(), new_imdb.url)
        self.assertEqual(new_imdb.tt_id, new_imdb.tt_id)
