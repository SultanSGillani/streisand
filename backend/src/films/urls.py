# -*- coding: utf-8 -*-

from django.conf.urls import url

from . import views


urlpatterns = [
    url(
        regex=r'^$',
        view=views.film_index,
        name='film_index',
    ),
    url(
        regex=r'^(?P<film_id>\d+)/$',
        view=views.film_details,
        name='film_details',
    ),
    url(
        regex=r'^(?P<film_id>\d+)/(?P<torrent_id>\d+)/$',
        view=views.film_details,
        name='film_torrent_details',
    ),
]
