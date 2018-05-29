# -*- coding: utf-8 -*-

from django.contrib import admin

from .models import Release


class ReleaseAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'format',
    )

    fields = (
        'film',
        'cut',
        'name',
        'group',
        'codec',
        'container',
        'resolution',
        'source_media',
        'is_source',
        'is_3d',
        'is_scene',
        'description',
        'nfo',
        'mediainfo',
        'encoded_by',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'film',
            'codec',
            'container',
            'resolution',
            'source_media',
        )


admin.site.register(Release, ReleaseAdmin)
