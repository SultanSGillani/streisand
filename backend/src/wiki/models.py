# -*- coding: utf-8 -*-

from django.db import models
from django.urls import reverse

from .managers import WikiArticleQuerySet


class WikiArticle(models.Model):

    old_id = models.PositiveIntegerField(null=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        to='users.User',
        related_name='created_wiki_pages',
        null=True,
        on_delete=models.SET_NULL,
    )
    modified_by = models.ForeignKey(
        to='users.User',
        related_name='modified_wiki_pages',
        null=True,
        on_delete=models.SET_NULL,
    )
    title = models.CharField(max_length=256)
    body = models.TextField()
    read_access_minimum_user_class = models.ForeignKey(
        to='users.UserClass',
        related_name='wiki_articles_with_read_access',
        null=True,
        on_delete=models.SET_NULL,
    )
    write_access_minimum_user_class = models.ForeignKey(
        to='users.UserClass',
        related_name='wiki_articles_with_write_access',
        null=True,
        on_delete=models.SET_NULL,
    )

    objects = WikiArticleQuerySet.as_manager()

    class Meta:
        get_latest_by = 'created_at'
        ordering = ['-created_at']

    def __str__(self):
        return '{title}'.format(
            title=self.title,
        )

    def get_absolute_url(self):
        return reverse(
            viewname='wiki_article',
            kwargs={
                'wiki_article_id': self.id,
            },
        )
