# -*- coding: utf-8 -*-

from django.contrib import admin

from .models import Invite


class InviteAdmin(admin.ModelAdmin):

    ordering = ['-created_at']

    fields = (
        'key',
        'offered_by',
        'created_at',
        'expires_at',
        'is_valid',
    )

    readonly_fields = fields

    list_display = fields

    search_fields = (
        'key',
        'offered_by__username',
        'offered_by__email',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('offered_by')


admin.site.register(Invite, InviteAdmin)
