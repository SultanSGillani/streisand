# -*- coding: utf-8 -*-

import debug_toolbar
from decouple import config

from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView

from api.torrents.views import TorrentUploadViewSet
from torrents.views import TorrentDownloadView

urlpatterns = [
    # API
    url(r'^api/v1/', include('api.urls')),

    # Docs that need updating. Made with Sphinx
    url(r'^model-docs/', include('docs.urls')),

    # torrent urls
    url(
        regex=r'^torrent-download/(?P<torrent_id>\d+)/(?P<user_id>\d+)/(?P<unique_download_key>[0-9a-f]{64})/$',
        view=TorrentDownloadView.as_view(),
        name='torrent_download',
    ),
    url(
        regex=r'^torrent-upload/$',
        view=TorrentUploadViewSet.as_view({'post': 'create'}),
        name='torrent_upload',
    ),
    url(r'^announce/', include('tracker.urls')),

    # Admin
    url(r'^admin/', admin.site.urls),
    url(r'^admin/docs/', include('django.contrib.admindocs.urls')),

    # Authentication
    url(r'^su/', include('django_su.urls')),
    url(r'^dev/', TemplateView.as_view(template_name="dev.html")),
    url(r'^frontend/', TemplateView.as_view(template_name="index.html")),

]

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
        url(r'^dev/',
            staff_member_required(
                TemplateView.as_view(template_name='dev.html')))
    ] + urlpatterns
