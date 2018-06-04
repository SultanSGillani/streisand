# -*- coding: utf-8 -*-

from rest_framework import status
from rest_framework.exceptions import APIException, Throttled
from rest_framework.views import exception_handler

from django.conf import settings
from django.contrib.auth.signals import user_logged_out
from django.template.defaultfilters import filesizeformat


def custom_exception_handler(exc, context):

    # Call the default exception handler first, to get the standard error response.
    response = exception_handler(exc, context)

    # Add the error code to the response.
    if isinstance(exc, APIException):
        response.data['error_code'] = exc.detail.code

    # If the user was throttled while trying to upload a torrent file, they
    # could be attempting a DOS attack.  Let's log them out! :]
    if isinstance(exc, Throttled):
        view = context['view']
        if view.throttle_scope == 'torrent_file_upload':
            request = view.request
            request.auth.delete()
            user_logged_out.send(sender=request.user.__class__, request=request, user=request.user)
            response.data['detail'] = "File upload request was throttled.  You have been logged out."

    return response


class AlreadyExistsException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = 'already_exists'
    default_detail = "This object already exists."


class TorrentFileTooLargeException(APIException):
    status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    default_code = 'file_too_large'
    default_detail = "Max file size is {max_size}!  Try using a larger piece size when creating the torrent.".format(
        max_size=filesizeformat(settings.TORRENT_FILE_UPLOAD_MAX_SIZE)
    )
