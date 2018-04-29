# -*- coding: utf-8 -*-

from django.dispatch import Signal


successful_login = Signal(providing_args=['user', 'ip_address'])

failed_login = Signal(providing_args=['username', 'ip_address'])
