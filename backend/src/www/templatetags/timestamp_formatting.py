# -*- coding: utf-8 -*-

from django import template
from django.utils.safestring import mark_safe
from django.utils.timezone import datetime, timedelta, is_aware, utc

register = template.Library()

ONE_MINUTE = 60
ONE_HOUR = 3600
ONE_DAY = 86400
ONE_WEEK = 604800
ONE_MONTH = 2629746
ONE_YEAR = 31556952

DURATION_UNITS = (
    ('year', ONE_YEAR),
    ('month', ONE_MONTH),
    ('week', ONE_WEEK),
    ('day', ONE_DAY),
    ('hour', ONE_HOUR),
    ('minute', ONE_MINUTE),
    ('second', 1),
)


@register.filter
def duration(value):

    if not value:
        return None

    components = [''] * len(DURATION_UNITS)

    remainder = int(value.total_seconds())

    for i, (unit_name, unit) in enumerate(DURATION_UNITS):

        n, remainder = divmod(remainder, unit)

        if n:
            components[i] = '{n} {unit_name}{s}'.format(
                n=n,
                unit_name=unit_name,
                s='s' if n != 1 else '',
            )

        # If there are any units above this level, we're done
        if components[i - 1]:
            break

    return ', '.join(s for s in components if s) or None


@register.filter
def timestamp(value):
    """
    Humanizes a timestamp, with a tooltip displaying the actual time.
    """
    if not value:
        return 'Never'

    now = datetime.now(utc if is_aware(value) else None)

    if abs(now - value) < timedelta(seconds=1):
        humanized_timestamp = 'Just now'
    elif value < now:
        humanized_timestamp = '{duration} ago'.format(
            duration=duration(now - value)
        )
    else:
        humanized_timestamp = '{duration} from now'.format(
            duration=duration(value - now)
        )

    return mark_safe(
        '<span title="{timestamp}">{humanized_timestamp}</span>'.format(
            timestamp=value.strftime('%Y-%m-%d %H:%M:%S %Z'),
            humanized_timestamp=humanized_timestamp,
        )
    )
