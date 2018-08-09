# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from torrents.views import TorrentDownloadView

urlpatterns = [
	# API
	url(r'^api/v1/', include('api.urls')),
	url(r'^docs/', include('docs.urls')),

	# torrent urls
	url(
		regex=r'^torrent-download/(?P<torrent_id>\d+)/(?P<user_id>\d+)/(?P<unique_download_key>[0-9a-f]{64})/$',
		view=TorrentDownloadView.as_view(),
		name='torrent_download',
	),

	# Authentication
	url(r'^su/', include('django_su.urls')),


]

if settings.DEBUG:
	import debug_toolbar

	urlpatterns.append(
		url(r'^__debug__/', include(debug_toolbar.urls))
	)
