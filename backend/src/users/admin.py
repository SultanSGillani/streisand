# -*- coding: utf-8 -*-

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from users.models import User, UserAnnounceKey, UserIPAddress, UserAnnounce, WatchedUser


@admin.register(User)
class UserAdmin(DjangoUserAdmin):

    list_display = (
        'username',
        'user_class',
        'account_status',
        'last_seeded',
        'last_login',
        'date_joined',
    )

    readonly_fields = (
        'old_id',
        'last_login',
        'date_joined',
        'invited_by_link',
        'last_seeded',
        'seeding_size',
    )

    exclude = (
        'invited_by',
    )

    search_fields = (
        'username',
    )

    actions = (
        'reset_announce_key',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user_class')

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        return False

    def reset_announce_key(self, request, queryset):
        count = 0
        for user in queryset:
            user.reset_announce_key()
            count += 1
        self.message_user(
            request,
            "{n} announce key{s} successfully reset.".format(
                n=count,
                s='' if count == 1 else 's',
            )
        )
    reset_announce_key.short_description = "Reset announce key for selected user(s)"

    def invited_by_link(self, user):
        if user.invited_by is not None:
            return user.invited_by.admin_link
    invited_by_link.allow_tags = True
    invited_by_link.short_description = "Invited by"


@admin.register(UserAnnounceKey)
class UserAnnounceKeyAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user_link',
        'issued_at',
        'revoked_at',
    )

    fields = (
        'id',
        'user_link',
        'issued_at',
        'revoked_at',
        'revocation_notes',
    )

    readonly_fields = fields

    search_fields = (
        'id',
        'user__username',
    )

    ordering = ['-issued_at']

    def user_link(self, announce_key):
        return announce_key.user.admin_link
    user_link.allow_tags = True


@admin.register(UserIPAddress)
class UserIPAddressAdmin(admin.ModelAdmin):

    list_display = (
        'ip_address',
        'user_link',
        'used_with',
        'first_used',
        'last_used',
    )

    fields = (
        'ip_address',
        'user_link',
        'used_with',
    )

    readonly_fields = fields

    search_fields = (
        'ip_address',
        'user__username',
    )

    def user_link(self, user_ip_address):
        return user_ip_address.user.admin_link
    user_link.allow_tags = True


@admin.register(UserAnnounce)
class UserAnnounceAdmin(admin.ModelAdmin):

    list_display = (
        'time_stamp',
        'announce_key',
        'swarm',
        'ip_address',
        'port',
        'peer_id',
        'new_bytes_uploaded',
        'new_bytes_downloaded',
        'bytes_remaining',
        'event',
    )

    ordering = ['-time_stamp']


@admin.register(WatchedUser)
class WatchedUserAdmin(admin.ModelAdmin):

    fields = (
        'user',
        'last_checked',
        'checked_by',
        'notes',
        'added_at',
    )

    readonly_fields = (
        'added_at',
        'last_checked',
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user',
            'checked_by',
        )
