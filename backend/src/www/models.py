# -*- coding: utf-8 -*-

from django.db import models

from .managers import FeatureManager


class Feature(models.Model):

    name = models.CharField(max_length=128, primary_key=True)
    description = models.TextField()
    is_enabled = models.BooleanField(default=False)

    objects = FeatureManager()


class LogEntry(models.Model):

    ACTION_CHOICES = (
        'torrent_uploaded',
        'torrent_edited',
        'torrent_deleted',
        'user_created',
        'user_deleted',
    )

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    action = models.CharField(max_length=128, db_index=True)
    text = models.CharField(max_length=1024)


class LoginAttempt(models.Model):
    user = models.ForeignKey(
        to='users.User',
        related_name='login_attempts',
        null=True,
        on_delete=models.SET_NULL,
    )
    username = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True)
    success = models.BooleanField()
    time_stamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        get_latest_by = 'time_stamp'

    def __str__(self):
        return '{status} {time_stamp} from {ip} - {username}'.format(
            status='SUCCESS' if self.success else 'FAILURE',
            time_stamp=self.time_stamp.strftime('%Y-%m-%d %H:%M:%S'),
            ip=self.ip_address,
            username=self.username,
        )
