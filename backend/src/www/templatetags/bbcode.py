# -*- coding: utf-8 -*-

from uuid import uuid4

from django import template
from django.utils.safestring import mark_safe

import bbcode

register = template.Library()

bbcode_parser = bbcode.Parser()

bbcode_parser.add_simple_formatter(
    tag_name='center',
    format_string='<div class="bbcode-center">%(value)s</div>',
)
bbcode_parser.add_simple_formatter(
    tag_name='left',
    format_string='<div class="bbcode-left">%(value)s</div>',
)
bbcode_parser.add_simple_formatter(
    tag_name='right',
    format_string='<div class="bbcode-right">%(value)s</div>',
)
bbcode_parser.add_simple_formatter(
    tag_name='indent',
    format_string='<div class="bbcode-indent">%(value)s</div>',
)
bbcode_parser.add_simple_formatter(
    tag_name='b',
    format_string='<span class="bbcode-bold">%(value)s</span>',
)
bbcode_parser.add_simple_formatter(
    tag_name='i',
    format_string='<span class="bbcode-italic">%(value)s</span>',
)
bbcode_parser.add_simple_formatter(
    tag_name='u',
    format_string='<span class="bbcode-underline">%(value)s</span>',
)
bbcode_parser.add_simple_formatter(
    tag_name='s',
    format_string='<span class="bbcode-strikethrough">%(value)s</span>',
)
bbcode_parser.add_simple_formatter(
    tag_name='font',
    format_string='<span style="font-family: %(font)s;">%(value)s</span>',
)
bbcode_parser.add_simple_formatter(
    tag_name='pre',
    format_string='<pre class="bbcode-pre">%(value)s</pre>',
    replace_links=False,
    render_embedded=False,
    transform_newlines=False,
    swallow_trailing_newline=True,
)
bbcode_parser.add_simple_formatter(
    tag_name='code',
    format_string='<pre class="bbcode-pre"><code class="bbcode-code">%(value)s</code></pre>',
    strip=True,
    replace_links=False,
    render_embedded=False,
    transform_newlines=False,
    swallow_trailing_newline=True,
)
bbcode_parser.add_simple_formatter(
    tag_name='table',
    format_string='<table class="bbcode-table"><tbody>%(value)s</tbody></table>',
    strip=True,
    swallow_trailing_newline=True,
)
bbcode_parser.add_simple_formatter(
    tag_name='tr',
    format_string='<tr class="bbcode-tr">%(value)s</tr>',
    strip=True,
    swallow_trailing_newline=True,
)
bbcode_parser.add_simple_formatter(
    tag_name='td',
    format_string='<td class="bbcode-td">%(value)s</td>',
    strip=True,
    swallow_trailing_newline=True,
)


def render_size(tag_name, value, options, parent, context):
    sizes = (
        '.5em',
        '.67em',
        '.83em',
        '1.0em',
        '1.17em',
        '1.5em',
        '2.0em',
        '2.5em',
    )
    try:
        font_size = sizes[int(options['size'])]
    except (ValueError, IndexError):
        font_size = '1.0em'
    return '<span style="font-size: {size};">{text}</span>'.format(
        size=font_size,
        text=value,
    )


def render_quote(tag_name, value, options, parent, context):
    text = '<blockquote class="bbcode-quote">{value}</blockquote>'.format(
        value=value,
    )
    if 'quote' in options:
        text = '<span class="bbcode-quote-author">{author} wrote:</span>\n{text}'.format(
            author=options['quote'],
            text=text,
        )
        if 'url' in options:
            text = '<a href="{url}">{text}</a>'.format(url=options['url'], text=text)
    return text


def render_img(tag_name, value, options, parent, context):
    if value.endswith(('.jpg', '.png', '.gif')):
        return '<img class="bbcode-img" src="{url}" />'.format(url=value)
    else:
        return ''


def render_spoiler(tag_name, value, options, parent, context):
    uuid = uuid4()
    return (
        '<div class="list-group-item">'
        '  <a class="btn" data-toggle="collapse" data-target="#spoiler_{uuid}">{title}</a>'
        '  <div class="collapse" id="spoiler_{uuid}">{text}</div>'
        '</div>'
    ).format(
        uuid=uuid,
        title=options['spoiler'] if 'spoiler' in options else 'Spoiler',
        text=value,
    )


bbcode_parser.add_formatter('size', render_size)
bbcode_parser.add_formatter('quote', render_quote, strip=True, swallow_trailing_newline=True)
bbcode_parser.add_formatter('img', render_img, replace_links=False)
bbcode_parser.add_formatter('spoiler', render_spoiler)


@register.filter
def bbcode(text):
    return mark_safe(bbcode_parser.format(text))
