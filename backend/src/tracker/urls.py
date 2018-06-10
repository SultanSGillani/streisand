# -*- coding: utf-8 -*-

from django.conf import settings
from django.conf.urls import url, include

from .views import AnnounceView

urlpatterns = [
    url(
        regex=r'^(?P<announce_key>[0-9a-f\-]{36})/announce/$',
        view=AnnounceView.as_view(),
        name='announce'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns.append(
        url(r'^__debug__/', include(debug_toolbar.urls))
    )
