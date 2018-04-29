# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import Sum


class VoteQuerySet(models.QuerySet):

    def total_bounty_in_bytes(self):
        return self.aggregate(Sum('bounty_in_bytes'))['bounty_in_bytes__sum'] or 0
