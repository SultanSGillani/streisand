# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication


class UsernamePasswordAuthentication(BaseAuthentication):
    """
    Authenticate using `username` and `password` values in POST data.
    """

    def authenticate(self, request):

        username = request.data.get('username')
        password = request.data.get('password')

        if not (username and password):
            raise exceptions.AuthenticationFailed("You must be joking.")

        user = authenticate(request=request, username=username, password=password)

        if user is None:
            raise exceptions.AuthenticationFailed("Invalid username/password.")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User account is inactive.", code='inactive_user')

        return (user, None)
