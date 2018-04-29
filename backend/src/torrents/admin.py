# -*- coding: utf-8 -*-

from django.contrib import admin
from django.template.defaultfilters import filesizeformat

from .models import Torrent


class TorrentAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'swarm',
        'film',
        'codec',
        'container',
        'resolution',
        'source_media',
        'size',
    )

    fields = (
        'swarm',
        'film',
        'codec',
        'container',
        'resolution',
        'source_media',
        'size',
        'file_list',
        'last_seeded',
        'uploaded_by',
    )

    readonly_fields = (
        'swarm',
        'size',
        'file_list',
        'last_seeded',
        'uploaded_by',
    )

    @staticmethod
    def size(torrent):
        return filesizeformat(torrent.size_in_bytes)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'swarm',
            'film',
            'codec',
            'container',
            'resolution',
            'source_media',
        )


admin.site.register(Torrent, TorrentAdmin)
