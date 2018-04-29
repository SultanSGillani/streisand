# -*- coding: utf-8 -*-

from django.core.management import call_command
from django.test.runner import DiscoverRunner


class CustomTestSuiteRunner(DiscoverRunner):

    def setup_databases(self):

        config = super().setup_databases()

        # Load fixture data for tests
        call_command('loaddata', 'foundation', app_label='www')

        return config
