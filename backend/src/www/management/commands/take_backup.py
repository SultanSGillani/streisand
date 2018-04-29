# -*- coding: utf-8 -*-

import subprocess

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.timezone import now


class Command(BaseCommand):

    requires_system_checks = False

    def handle(self, *args, **options):

        backup_path = now().strftime('%Y-%m-%d_%H-%M-%S_streisand.dump')

        self.stdout.write("Dumping backup to {backup_path}".format(backup_path=backup_path))
        subprocess.call(
            'sudo su -c "pg_dump --no-acl --no-owner -Fc -U {user} -f {dump_path} {database}" postgres'.format(
                user=settings.DATABASES['default']['USER'],
                database=settings.DATABASES['default']['NAME'],
                dump_path=backup_path,
            ),
            shell=True,
        )
