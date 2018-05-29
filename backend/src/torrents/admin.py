# -*- coding: utf-8 -*-

from django.contrib import admin
from django.template.defaultfilters import filesizeformat

from .models import TorrentFile


class TorrentFileAdmin(admin.ModelAdmin):

    list_display = (
        'release',
        'info_hash',
        'size',
    )

    fields = (
        'swarm',
        'release',
        'size',
        'piece_size',
        'is_single_file',
        'file_list',
        'last_seeded',
        'uploaded_by',
    )

    readonly_fields = (
        'swarm',
        'size',
        'piece_size',
        'is_single_file',
        'file_list',
        'last_seeded',
        'uploaded_by',
    )

    @staticmethod
    def size(torrent):
        return filesizeformat(torrent.total_size_in_bytes)

    @staticmethod
    def piece_size(torrent):
        return filesizeformat(torrent.piece_size_in_bytes)

    @staticmethod
    def file_list(torrent):
        if torrent.is_single_file:
            return [torrent.file]
        else:
            return torrent.files

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'swarm',
            'release__film',
            'release__codec',
            'release__container',
            'release__resolution',
            'release__source_media',
        )


admin.site.register(TorrentFile, TorrentFileAdmin)
