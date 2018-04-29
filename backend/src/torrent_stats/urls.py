# -*- coding: utf-8 -*-

from django.conf.urls import url

from . import views


urlpatterns = [
    url(
        regex=r'^(?P<username>.+)/$',
        view=views.torrent_stats_index,
        name='torrent_stats',
    ),
]
