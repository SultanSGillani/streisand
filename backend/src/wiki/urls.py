# -*- coding: utf-8 -*-

from django.conf.urls import url

from . import views


urlpatterns = [
    url(
        regex=r'^$',
        view=views.wiki_index,
        name='wiki_index',
    ),
    url(
        regex=r'^(?P<wiki_article_id>\d+)/$',
        view=views.wiki_article_details,
        name='wiki_article',
    ),
    url(
        regex=r'^(?P<wiki_article_id>\d+)/edit/$',
        view=views.WikiArticleEditView.as_view(),
        name='edit_wiki_article',
    ),
    url(
        regex=r'^new/$',
        view=views.WikiArticleCreationView.as_view(),
        name='new_wiki_article',
    ),
    url(
        regex=r'^(?P<wiki_article_id>\d+)/delete/$',
        view=views.wiki_article_delete,
        name='delete_wiki_article',
    ),
]
