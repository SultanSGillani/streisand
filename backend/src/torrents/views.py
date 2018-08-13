# -*- coding: utf-8 -*-

from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.views.generic import View

from users.models import User

from .models import TorrentFile
from .utils import generate_unique_download_key


class TorrentDownloadView(View):

    def get(self, request, user_id, torrent_id, unique_download_key):

        # Make sure we have a valid user id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise PermissionDenied

        # Make sure we have a valid torrent id
        try:
            torrent_file = TorrentFile.objects.select_related('release').get(id=torrent_id)
        except TorrentFile.DoesNotExist:
            raise PermissionDenied

        # Make sure we have a valid download key
        valid_key = generate_unique_download_key(torrent_file.info_hash, user.torrent_download_key_id)
        if unique_download_key != valid_key:
            raise PermissionDenied

        # Make sure the user can download torrents
        if not user.has_perm('torrents.can_download'):
            raise PermissionDenied

        # Respond with the customized torrent file
        response = HttpResponse(
            content=torrent_file.for_user_download(user),
            content_type='application/x-bittorrent',
        )
        response['Content-Disposition'] = 'attachment; filename={file_name}.torrent'.format(
            file_name=torrent_file.file_name_for_download,
        )
        return response
