# -*- coding: utf-8 -*-

from django.contrib import admin

from .models import TorrentClient


class TorrentClientAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'peer_id_prefix',
        'is_whitelisted',
    )

    list_filter = (
        'is_whitelisted',
    )

    search_fields = (
        'name',
        'peer_id_prefix',
    )


admin.site.register(TorrentClient, TorrentClientAdmin)
