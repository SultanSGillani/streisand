# -*- coding: utf-8 -*-

from django import template
from django.template.loader import render_to_string

register = template.Library()


@register.simple_tag(name='pagination')
def pagination(page):
    return render_to_string(
        'pagination.html',
        {
            'page': page,
        },
    )
