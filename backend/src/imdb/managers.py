# -*- coding: utf-8 -*-

import re
from decimal import Decimal

import requests
from bs4 import BeautifulSoup

from django.db import models
from django.utils.timezone import now


class FilmIMDbManager(models.Manager):

    def create_from_tt_id(self, tt_id):

        tt_id = self.tt_id_from_string(tt_id)
        metadata = self.get_metadata_for_tt_id(tt_id)

        return self.create(
            id=int(tt_id[2:]),
            title=metadata['title'],
            year=metadata['year'],
            description=metadata['description'],
            rating=metadata['rating'],
            rating_vote_count=metadata['rating_vote_count'],
            runtime_in_minutes=metadata['runtime_in_minutes'],
            last_updated=now(),
        )

    @staticmethod
    def tt_id_from_string(imdb_string):
        """
        Check the string for an IMDb ID, and format it as 'tt' + 7-digit number
        """
        match = re.findall(r'tt(\d+)', imdb_string, re.IGNORECASE)
        if match:
            # Pad id to 7 digits
            return 'tt' + match[0].zfill(7)
        else:
            raise IMDbError(
                'No valid IMDb ID could be found in the string "{string}".'.format(
                    string=imdb_string
                )
            )

    @staticmethod
    def url_for_id(tt_id):
        return 'http://www.imdb.com/title/{tt_id}/'.format(tt_id=tt_id)

    @staticmethod
    def _fetch_page(url):
        """
        Fetch the specified IMDb page, as a BeautifulSoup object
        """

        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.RequestException as e:
            raise IMDbError(e)

        return BeautifulSoup(response.text)

    @classmethod
    def get_metadata_for_tt_id(cls, tt_id):

        dom = cls._fetch_page(cls.url_for_id(tt_id))

        # Starting point
        overview_top = dom.find('td', id='overview-top')
        header_spans = overview_top.h1.find_all('span')

        # Get genres
        info_div = overview_top.find('div', class_='infobar')
        genres = [span.string.strip() for span in info_div.find_all('span', itemprop='genre')]

        # Get title
        title_span = header_spans[0]
        title = title_span.string.strip()

        # Get year
        year = None
        for span in header_spans:
            match = re.search(r'\(.*((?:19|20)[0-9]{2}).*\)', span.get_text())
            if match is not None:
                year = match.group(1)

        # Get description
        description = None
        description_node = dom.find('p', itemprop='description')
        if description_node is not None:
            description = description_node.text.strip()

        # Get rating info
        rating = None
        rating_vote_count = None
        rating_value_span = dom.find('span', itemprop='ratingValue')
        if rating_value_span is not None:
            rating = Decimal(rating_value_span.get_text())
            rating_vote_count_span = dom.find('span', itemprop='ratingCount')
            rating_vote_count = int(rating_vote_count_span.get_text().replace(',', ''))

        # Get duration
        runtime_in_minutes = None
        duration_element = dom.find('time', itemprop='duration')
        if duration_element is not None:
            match = re.search(r'(\d+)', duration_element.get_text())
            if match:
                runtime_in_minutes = int(match.group(1))

        return {
            'title': title,
            'year': year,
            'description': description,
            'genres': genres,
            'rating': rating,
            'rating_vote_count': rating_vote_count,
            'runtime_in_minutes': runtime_in_minutes,
        }

    @classmethod
    def _get_aka_titles(cls, tt_id):

        dom = cls._fetch_page(cls.url_for_id(tt_id) + 'releaseinfo')

        aka_table = dom.find('table', id='akas')

        aka_titles = set()

        if aka_table is not None:
            rows = aka_table.find_all('tr')
            for row in rows:
                aka_title = row.find_all('td')[1].text.strip()
                aka_titles.add(aka_title)

        return aka_titles

    @classmethod
    def _get_plot_summary(cls, tt_id):

        dom = cls._fetch_page(cls.url_for_id(tt_id) + 'plotsummary')

        description_p = dom.find('p', class_='plotSummary')
        if description_p:
            return next(description_p.children).strip()


class IMDbError(Exception):
    pass
