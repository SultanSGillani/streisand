# -*- coding: utf-8 -*-

from django.conf.urls import url
from . import views


urlpatterns = [
    url(
        regex=r'^$',
        view=views.user_profile_index,
        name='user_profile_index',
    ),
    url(
        regex=r'^(?P<username>.+)/$',
        view=views.user_profile_details,
        name='user_profile',
    ),
]
