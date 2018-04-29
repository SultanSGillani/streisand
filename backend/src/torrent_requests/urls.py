# -*- coding: utf-8 -*-

from django.conf.urls import url

from . import views


urlpatterns = [
    url(
        regex=r'^$',
        view=views.torrent_request_index,
        name='torrent_request_index',
    ),
    url(
        regex=r'^(?P<torrent_request_id>\d+)/$',
        view=views.TorrentRequestView.as_view(),
        name='torrent_request_details',
    ),
    url(
        regex=r'^new/$',
        view=views.NewTorrentRequestView.as_view(),
        name='new_torrent_request',
    ),
]
