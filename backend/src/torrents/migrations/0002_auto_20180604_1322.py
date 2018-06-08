# Generated by Django 2.0.6 on 2018-06-04 13:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('torrents', '0001_initial'),
        ('releases', '0002_auto_20180604_1322'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='torrentfile',
            name='moderated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='moderated_torrents', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='torrentfile',
            name='release',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='torrents', to='releases.Release'),
        ),
        migrations.AddField(
            model_name='torrentfile',
            name='reseed_request',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='active_on_torrent', to='torrents.ReseedRequest'),
        ),
        migrations.AddField(
            model_name='torrentfile',
            name='uploaded_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='uploaded_torrents', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='torrentcomment',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='torrentcomments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='torrentcomment',
            name='torrent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='torrents.TorrentFile'),
        ),
        migrations.AddField(
            model_name='reseedrequest',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reseed_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='reseedrequest',
            name='torrent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reseed_requests', to='torrents.TorrentFile'),
        ),
    ]
