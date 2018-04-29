# -*- coding: utf-8 -*-

from django.contrib import admin
from django.utils.timezone import now

from .models import Invite


class InviteAdmin(admin.ModelAdmin):

    ordering = ['-created_at']

    fields = (
        'key',
        'offered_by_link',
        'created_at',
        'valid_until',
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

    def offered_by_link(self, invite):
        return '<a href="{profile_url}">{username}</a>'.format(
            profile_url=invite.offered_by.get_absolute_url(),
            username=invite.offered_by.username,
        )
    offered_by_link.allow_tags = True

    def valid_until(self, invite):
        return invite.created_at + Invite.objects.INVITES_VALID_FOR

    def is_valid(self, invite):
        return invite.created_at < now() < self.valid_until(invite)


admin.site.register(Invite, InviteAdmin)
