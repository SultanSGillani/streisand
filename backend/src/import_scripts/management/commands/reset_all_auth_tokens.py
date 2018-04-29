# -*- coding: utf-8 -*-

from rest_framework.authtoken.models import Token
from tqdm import tqdm

from django.core.management.base import BaseCommand

from users.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):

        users = User.objects.all()
        Token.objects.all().delete()

        for user in tqdm(users.iterator(), total=users.count(), unit='user'):
            Token.objects.create(user=user)
