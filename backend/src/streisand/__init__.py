# -*- coding: utf-8 -*-

import logging

# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app


logger = logging.getLogger('streisand')
logger.debug('Loaded {celery_app}'.format(celery_app=celery_app))
