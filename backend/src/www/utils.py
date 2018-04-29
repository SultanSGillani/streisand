# -*- coding: utf-8 -*-

import logging
from urllib.parse import urljoin

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def get_full_url(relative_url):
    return urljoin(settings.SITE_URL, relative_url)


def paginate(request, queryset, items_per_page=None):

    paginator = Paginator(queryset, items_per_page or settings.ITEMS_PER_PAGE)

    page = request.GET.get('page')

    try:
        objects = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        objects = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        objects = paginator.page(paginator.num_pages)

    return objects


def email(subject='', template='', context=None, from_email=None, reply_to=None, to=(), cc=(), bcc=()):

    if from_email is None:
        from_email = '{name} <{email}>'.format(
            name=settings.SITE_NAME,
            email=settings.DEFAULT_FROM_EMAIL,
        )

    if reply_to is None:
        reply_to = settings.DEFAULT_REPLY_TO_EMAIL

    html = render_to_string(template, context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=strip_tags(html),
        from_email=from_email,
        to=to,
        cc=cc,
        bcc=bcc,
        headers={
            'Reply-To': reply_to
        },
    )
    msg.attach_alternative(html, 'text/html')

    try:
        msg.send()
    except Exception:
        logging.exception('Failed to send email "{subject}" to {recipients}'.format(
            subject=subject,
            recipients=to,
        ))


def ratio(bytes_uploaded, bytes_downloaded):
    if bytes_downloaded == 0:
        return 0.0
    else:
        return round(bytes_uploaded / bytes_downloaded, 3)
