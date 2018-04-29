# -*- coding: utf-8 -*-

from django.db import models


class WikiArticleQuerySet(models.QuerySet):

    def accessible_to_user(self, user):
        if user.is_superuser:
            return self.all()
        else:
            return self.filter(read_access_minimum_user_class__rank__lte=user.user_class.rank)

    def editable_by_user(self, user):
        if user.is_superuser:
            return self.all()
        else:
            return self.filter(write_access_minimum_user_class__rank__lte=user.user_class.rank)
