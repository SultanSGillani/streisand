# -*- coding: utf-8 -*-
import debug_toolbar
from decouple import config
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    # API
    url(r'^api/v1/', include('api.urls')),

    # Docs that need updating. Made with Sphinx
    url(r'^model-docs/', include('docs.urls')),

    # torrent urls
    url(r'^torrent-actions/', include('torrents.urls')),
    url(r'^film-stuff/', include('films.urls')),
    url(r'^announce/', include('tracker.urls')),

    # Admin
    url(r'^admin/', admin.site.urls),
    url(r'^admin/docs/', include('django.contrib.admindocs.urls')),

    # Authentication
    url(r'^su/', include('django_su.urls')),
]

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    urlpatterns = [

        url(r'^__debug__/', include(debug_toolbar.urls)),
        url(r'^dev/', staff_member_required(TemplateView.as_view(template_name='dev.html')))
    ] + urlpatterns

# Anything else gets passed to the frontend

urlpatterns.append(re_path('.*/', TemplateView.as_view(template_name='index.html')))
