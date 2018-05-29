# -*- coding: utf-8 -*-

from django.conf.urls import url
from django.shortcuts import redirect

from . import views


urlpatterns = [
    url(r'^$', lambda r: redirect('film_index')),
    url(
        regex=r'^(?P<torrent_id>\d+)/moderate/$',
        view=views.TorrentModerationView.as_view(),
        name='torrent_moderation',
    ),
    url(
        regex=r'^(?P<torrent_id>\d+)/request-reseed/$',
        view=views.new_reseed_request,
        name='reseed_request',
    ),
    url(
        regex=r'^reseed-requests/$',
        view=views.reseed_request_index,
        name='reseed_request_index',
    ),
]
