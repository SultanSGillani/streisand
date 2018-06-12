# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

from torrents.views import TorrentDownloadView


urlpatterns = [
    # API
    url(r'^api/v1/', include('api.urls')),

    # torrent urls
    url(
        regex=r'^torrent-download/(?P<torrent_id>\d+)/(?P<user_id>\d+)/(?P<unique_download_key>[0-9a-f]{64})/$',
        view=TorrentDownloadView.as_view(),
        name='torrent_download',
    ),

    # Admin
    url(r'^admin/', admin.site.urls),
    url(r'^admin/docs/', include('django.contrib.admindocs.urls')),
    url(r'^jet/', include('jet.urls', 'jet')),  # Django JET URLS

    # Authentication
    url(r'^su/', include('django_su.urls')),
    url(r'^dev/', TemplateView.as_view(template_name="dev.html")),
    url(r'^frontend/', TemplateView.as_view(template_name="index.html")),

]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns.append(
        url(r'^__debug__/', include(debug_toolbar.urls))
    )
