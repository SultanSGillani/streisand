# -*- coding: utf-8 -*-

from django.contrib.auth.models import Group

from django_filters import rest_framework as filters
from knox.views import LoginView as KnoxLoginView
from rest_framework import status
from rest_framework.generics import UpdateAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from api.auth import UsernamePasswordAuthentication
from api.permissions import IsOwnerOrReadOnly
from users.models import User, UserAnnounce

from .filters import UserFilter, PublicUserFilter
from .serializers import (
    GroupSerializer, AdminUserSerializer, CurrentUserSerializer, UsernameAvailabilitySerializer,
    PublicUserSerializer, ChangePasswordSerializer, NewUserRegistrationSerializer, UserAnnounceSerializer
)


class UsernameAvailabilityView(CreateAPIView):
    """
    Check if a username is valid and available.
    """
    serializer_class = UsernameAvailabilitySerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'vulnerable_to_brute_force'
    http_method_names = ['post', 'options']


class UserRegistrationView(CreateAPIView):
    """
    Register a new user.
    """
    serializer_class = NewUserRegistrationSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'vulnerable_to_brute_force'
    http_method_names = ['post', 'options']


class UserLoginView(KnoxLoginView):
    """
    Log in with username and password; obtain a token.
    """
    authentication_classes = [UsernamePasswordAuthentication]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'vulnerable_to_brute_force'


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsOwnerOrReadOnly]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'vulnerable_to_brute_force'

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(RetrieveUpdateAPIView):

    serializer_class = CurrentUserSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class PublicUserViewSet(ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed and searched only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PublicUserSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = PublicUserFilter
    queryset = User.objects.all().select_related(
        'user_class',
    ).prefetch_related(
        'user_class', 'groups',
    ).order_by(
        '-date_joined',
    )


class AdminUserViewSet(ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited, by administrators.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminUserSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = UserFilter
    queryset = User.objects.all().select_related(
        'user_class',
        'invited_by',
        'announce_key',
    ).prefetch_related(
        'groups',
        'torrents',
        'user_class',
        'user_permissions',
        'user_class__permissions',
        'announce_key',
    ).order_by(
        '-date_joined', 'id',
    ).distinct('date_joined', 'id')


class GroupViewSet(ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes = [IsAdminUser]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UserAnnounceViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = UserAnnounce.objects.all().select_related('user')
    serializer_class = UserAnnounceSerializer
