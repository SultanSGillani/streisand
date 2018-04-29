# -*- coding: utf-8 -*-

import os
import subprocess

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    requires_system_checks = False

    def add_arguments(self, parser):
        parser.add_argument('dump_path', type=str)

    def handle(self, *args, **options):

        dump_path = options['dump_path']
        assert os.path.getsize(dump_path) > 0

        self.stdout.write("Dropping all old data")
        call_command('reset_db', interactive=False)

        self.stdout.write("Restoring backup {file_name}".format(file_name=dump_path))
        subprocess.call(
            'sudo su -c "pg_restore --clean --if-exists --no-acl --no-owner -U {user} -d {database} {dump_path}" postgres'.format(
                user=settings.DATABASES['default']['USER'],
                database=settings.DATABASES['default']['NAME'],
                dump_path=dump_path,
            ),
            shell=True,
        )
