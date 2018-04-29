# -*- coding: utf-8 -*-

from django.conf.urls import url

from . import views


urlpatterns = [
    url(
        regex=r'^$',
        view=views.forum_index,
        name='forum_index',
    ),
    url(
        regex=r'^topic/(?P<topic_id>\d+)/$',
        view=views.forum_topic_details,
        name='forum_topic_details',
    ),
    url(
        regex=r'^thread/(?P<thread_id>\d+)/$',
        view=views.ForumThreadView.as_view(),
        name='forum_thread_details',
    ),
    url(
        regex=r'^post/(?P<post_id>\d+)/delete/$',
        view=views.forum_post_delete,
        name='forum_post_delete',
    ),
]
