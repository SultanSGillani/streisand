# -*- coding: utf-8 -*-
import debug_toolbar
from decouple import config
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.views.generic import TemplateView
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    # API
    url(r'^api/v1/', include('api.urls')),

    # API Core-Schema Docs TODO: Update this when better Api Docs come out and work.
    url(r'^docs/', include_docs_urls(title='jumpcut API v1', public=False)),

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
    url(r'^', TemplateView.as_view(template_name="index.html")),
]

DEBUG = config('DEBUG', cast=bool)

if DEBUG:
    urlpatterns = [

        url(r'^__debug__/', include(debug_toolbar.urls)),
        url(r'^dev/', staff_member_required(TemplateView.as_view(template_name='dev.html')))
    ] + urlpatterns
