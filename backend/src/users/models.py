# -*- coding: utf-8 -*-

from uuid import uuid4

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from django.db.models import Sum
from django.urls import reverse
from django.utils.timezone import now

from tracker.models import Peer
from www.utils import ratio


class User(AbstractUser):

    CACHE_KEY = 'user:{user_id}'

    STATUS_CHOICES = (
        ('unconfirmed', 'Unconfirmed'),
        ('enabled', 'Enabled'),
        ('disabled', 'Disabled'),
    )

    old_id = models.PositiveIntegerField(null=True, db_index=True)

    user_class = models.ForeignKey(
        to='users.UserClass',
        related_name='users',
        null=True,
        on_delete=models.SET_NULL,
    )
    is_donor = models.BooleanField(default=False)
    account_status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES,
        default='enabled',
        db_index=True,
    )
    failed_login_attempts = models.PositiveIntegerField(default=0)
    announce_key = models.OneToOneField(
        to='users.UserAnnounceKey',
        related_name='current_user',
        null=True,
        default=None,
        editable=False,
        db_index=True,
        on_delete=models.PROTECT,
    )
    torrent_download_key = models.OneToOneField(
        to='users.UserTorrentDownloadKey',
        related_name='current_user',
        null=True,
        default=None,
        editable=False,
        db_index=True,
        on_delete=models.PROTECT,
    )
    avatar_url = models.URLField(max_length=512, null=True, blank=True)
    custom_title = models.CharField(max_length=256, null=True, blank=True)
    profile_description = models.TextField(null=True, blank=True)
    staff_notes = models.TextField(null=True)
    irc_key = models.CharField(max_length=128, null=True, blank=True)
    invited_by = models.ForeignKey(
        to='users.User',
        null=True,
        on_delete=models.SET_NULL,
    )
    invite_count = models.PositiveIntegerField(default=0)
    bytes_uploaded = models.BigIntegerField(default=0)
    bytes_downloaded = models.BigIntegerField(default=0)
    torrents = models.ManyToManyField(
        to='torrents.Torrent',
        through='torrent_stats.TorrentStats',
        related_name='users',
    )
    log_successful_announces = models.BooleanField(
        default=False,
        help_text="Use sparingly! This logs data from all successful "
                  "announces made by this user's torrent client(s).",
    )
    last_seeded = models.DateTimeField(null=True)
    average_seeding_size = models.BigIntegerField(default=0)
    watch_queue = models.ForeignKey(
        to='films.Collection',
        null=True,
        blank=True,
        editable=False,
        on_delete=models.SET_NULL,
    )

    class Meta:
        permissions = (
            ('can_invite', "Can invite new users"),
            ('unlimited_invites', "Can invite unlimited new users"),
            ('custom_title', "Can edit own custom title"),
        )

    def __str__(self):
        return self.username

    @property
    def last_seen(self):

        try:
            ip_address = self.ip_addresses.filter(used_with='site').latest()
        except UserIPAddress.DoesNotExist:
            return None
        else:
            return ip_address.last_used

    @property
    def invite_tree(self):
        tree = dict()
        for user in User.objects.filter(invited_by=self):
            tree[user.username] = user.invite_tree
        return tree

    @property
    def announce_url(self):
        return settings.TRACKER_ANNOUNCE_URL_TEMPLATE.format(announce_key=self.announce_key_id)

    @property
    def ratio(self):
        return ratio(self.bytes_uploaded, self.bytes_downloaded)

    @property
    def recent_snatches(self, limit=5):
        return self.torrents.filter(
            torrent_stats__snatch_count__gt=0
        ).select_related(
            'film',
        ).order_by('-torrent_stats__last_snatched')[:limit]

    @property
    def seeding_size(self):
        seeding_size = Peer.objects.seeders().filter(
            user_announce_key=self.announce_key_id,
        ).aggregate(
            Sum('swarm__torrent__size_in_bytes')
        )['swarm__torrent__size_in_bytes__sum']

        if seeding_size:
            return seeding_size
        else:
            return 0

    @property
    def admin_link(self):
        return '<a href="{admin_url}">{username}</a>'.format(
            admin_url=reverse('admin:www_user_change', args=[self.id]),
            username=self.username,
        )

    @staticmethod
    def autocomplete_search_fields():
        return ['username__iexact']

    @classmethod
    def normalize_username(cls, username):
        return super().normalize_username(username).lower()

    def get_absolute_url(self):
        return reverse('user_profile', args=[self.username])

    def reset_announce_key(self, notes=None):

        with transaction.atomic():

            # Revoke old key
            if self.announce_key_id:
                old_key = self.announce_key
                old_key.revoked_at = now()
                if notes:
                    old_key.revocation_notes = notes
                old_key.save()

            # Issue new key
            self.announce_key = self.announce_keys.create()
            self.save()

    def reset_torrent_download_key(self, notes=None):

        with transaction.atomic():

            # Revoke old key
            if self.torrent_download_key_id:
                old_key = self.torrent_download_key
                old_key.revoked_at = now()
                if notes:
                    old_key.revocation_notes = notes
                old_key.save()

            # Issue new key
            self.torrent_download_key = self.torrent_download_keys.create()
            self.save()


class UserClass(models.Model):

    old_id = models.PositiveIntegerField(null=True, db_index=True)

    name = models.CharField(db_index=True, max_length=128)
    rank = models.PositiveSmallIntegerField(db_index=True)
    is_staff = models.BooleanField(default=False, db_index=True)
    permissions = models.ManyToManyField(
        to='auth.Permission',
        related_name='user_classes',
        blank=True,
    )

    class Meta:
        ordering = ['rank']

    def __str__(self):
        return self.name


class UserEmailAddress(models.Model):
    """
    Used to keep a history of email addresses associated with a user.
    """
    user = models.ForeignKey(
        to='users.User',
        null=False,
        db_index=True,
        related_name='email_addresses',
        on_delete=models.CASCADE,
    )
    email = models.EmailField(unique=True)
    first_used = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)


class UserIPAddress(models.Model):
    """
    Used to keep a history of IP addresses associated with a user, including
    both site and tracker interactions.
    """
    user = models.ForeignKey(
        to='users.User',
        null=False,
        db_index=True,
        related_name='ip_addresses',
        on_delete=models.CASCADE,
    )
    ip_address = models.GenericIPAddressField(null=False)
    used_with = models.CharField(max_length=16, null=False)
    first_used = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)

    class Meta:
        get_latest_by = 'last_used'
        unique_together = ['user', 'ip_address', 'used_with']
        index_together = ['user', 'ip_address', 'used_with']


class UserTorrentDownloadKey(models.Model):
    """
    Used to keep a history of torrent download keys associated with a user.
    """
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(
        to='users.User',
        related_name='torrent_download_keys',
        db_index=True,
        on_delete=models.CASCADE,
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True)
    revocation_notes = models.TextField()

    def __str__(self):
        return str(self.id)


class UserAnnounceKey(models.Model):
    """
    Used to keep a history of announce keys associated with a user.
    """
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(
        to='users.User',
        related_name='announce_keys',
        db_index=True,
        on_delete=models.CASCADE,
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True)
    revocation_notes = models.TextField()

    def __str__(self):
        return str(self.id)


class UserAnnounce(models.Model):
    """
    Used to keep a record of successful announces for a given user.
    """

    # Because Django does not support compound primary keys, and because this
    # table might actually hit the max limit of an auto-incrementing integer ID,
    # we use an auto-generated UUIDField as the primary key.
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)

    user = models.ForeignKey(
        to='users.User',
        null=False,
        db_index=True,
        related_name='logged_announces',
        on_delete=models.CASCADE,
    )
    swarm = models.ForeignKey(
        to='tracker.Swarm',
        null=False,
        db_index=True,
        on_delete=models.CASCADE,
    )
    time_stamp = models.DateTimeField(null=False)
    announce_key = models.UUIDField(null=False)
    ip_address = models.GenericIPAddressField(null=False)
    port = models.IntegerField(null=False)
    peer_id = models.CharField(max_length=40, null=False)
    user_agent = models.TextField(null=False)
    new_bytes_uploaded = models.BigIntegerField(default=0, null=False)
    new_bytes_downloaded = models.BigIntegerField(default=0, null=False)
    bytes_remaining = models.BigIntegerField(null=False)
    event = models.CharField(max_length=16, null=False)


class WatchedUser(models.Model):

    user = models.ForeignKey(
        to='users.User',
        related_name='watchlist_entries',
        on_delete=models.CASCADE,
    )
    notes = models.TextField()
    added_at = models.DateTimeField(auto_now_add=True)
    last_checked = models.DateTimeField(auto_now=True)
    checked_by = models.ForeignKey(
        to='users.User',
        null=True,
        related_name='watched_users_checked',
        on_delete=models.SET_NULL,
    )
