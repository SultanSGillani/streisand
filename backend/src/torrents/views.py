# -*- coding: utf-8 -*-

from django.contrib.auth.decorators import permission_required
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.decorators import method_decorator
from django.views.generic import View

from users.models import User
from www.utils import paginate

from .models import TorrentFile, ReseedRequest
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
            torrent_file = TorrentFile.objects.select_related('release').get(torrent_id=torrent_id)
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


class TorrentModerationView(View):

    @method_decorator(permission_required('torrents.can_moderate', raise_exception=True))
    def post(self, request, torrent_id):

        torrent = get_object_or_404(TorrentFile, id=torrent_id)

        moderation_status = request.POST['moderation_status']

        if moderation_status == 'approved':
            torrent.is_approved = True
        elif moderation_status == 'needs_work':
            torrent.is_approved = False
        else:
            torrent.is_approved = None

        torrent.moderated_by = request.user
        torrent.save()

        return redirect(torrent)


def reseed_request_index(request):

    all_reseed_requests = ReseedRequest.objects.filter(
        active_on_torrent__isnull=False,
    ).select_related(
        'created_by',
        'torrent__film',
    ).order_by(
        '-created_at',
    )

    reseed_requests = paginate(
        request=request,
        queryset=all_reseed_requests,
    )

    return render(
        request=request,
        template_name='reseed_request_index.html',
        context={
            'reseed_requests': reseed_requests,
        }
    )


@permission_required('torrents.can_request_reseed', raise_exception=True)
def new_reseed_request(request, torrent_id):

    torrent = get_object_or_404(TorrentFile, id=torrent_id)

    if not torrent.is_accepting_reseed_requests:
        raise PermissionDenied

    torrent.request_reseed(request.user)

    return redirect(torrent)
