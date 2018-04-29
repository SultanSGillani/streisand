# -*- coding: utf-8 -*-

import debug_toolbar

from django.conf import settings
from django.conf.urls import include, url
from django.urls import re_path
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    # API
    url(r'^api/v1/', include('interfaces.api_site.urls')),

    # API Core-Schema Docs TODO: Update this when better Api Docs come out and work.
    url(r'^docs/', include_docs_urls(title='JumpCut API v1', public=False)),

    # Docs that need updating. Made with Sphinx
    url(r'^model-docs/', include('docs.urls')),

    # Admin
    url(r'^admin/', admin.site.urls),
    url(r'^admin/docs/', include('django.contrib.admindocs.urls')),

    # Authentication
    url(r'^su/', include('django_su.urls')),

    # FrontEnd
    re_path('.*', TemplateView.as_view(template_name='index.html')),

]
if settings.DEBUG:
    urlpatterns.append(
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )
