# -*- coding: utf-8 -*-

from django.shortcuts import render

from www.utils import paginate

from .models import TorrentStats


def torrent_stats_index(request, username):

    torrent_stats = TorrentStats.objects.filter(
        user__username=username,
    ).select_related(
        'user',
        'torrent__film',
    )

    torrent_stats = paginate(
        request=request,
        queryset=torrent_stats,
    )

    return render(
        request=request,
        template_name='torrent_stats_index.html',
        context={
            'torrent_stats': torrent_stats,
        }
    )
