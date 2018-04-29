# -*- coding: utf-8 -*-
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny
from django.http import Http404, request
from www.permissions import IsOwnerOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework.generics import UpdateAPIView, RetrieveAPIView, CreateAPIView
from .filters import UserFilter, PublicUserFilter
from www.pagination import UserPageNumberPagination
from users.models import User
from .serializers import GroupSerializer, AdminUserProfileSerializer, \
    OwnedUserProfileSerializer, PublicUserProfileSerializer, ChangePasswordSerializer, NewUserSerializer
from rest_framework_jwt.views import ObtainJSONWebToken
from .serializers import JWTSerializer


class UserRegisterView(CreateAPIView):
    """
    Register a new user.
    """
    serializer_class = NewUserSerializer
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(ObtainJSONWebToken):
    """
    User Login View
    """
    serializer_class = JWTSerializer

    # def post(self, request, format=None):
    #     data = request.data
    #     username = data.get('username', None)
    #     password = data.get('password', None)
    #
    #     user = authenticate(username=username, password=password)
    #     # Generate token and add it to the response object
    #     if user is not None:
    #         login(request, account)
    #         return Response({
    #             'status': 'Successful',
    #             'message': 'You have successfully been logged into your account.'
    #         }, status=status.HTTP_200_OK)
    #
    #     return Response({
    #         'status': 'Unauthorized',
    #         'message': 'Username/password combination invalid.'
    #     }, status=status.HTTP_401_UNAUTHORIZED)


# class UserRegisterView(CreateAPIView):
#     serializer_class = UserRegistrationSerializer
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(RetrieveAPIView):
    serializer_class = OwnedUserProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        return User.objects.filter(user=self.request.user)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def retrieve_last(self):

        queryset = self.filter_queryset(self.get_queryset())

        try:
            obj = queryset.latest('salted_token_id_and_user')
        except queryset.model.DoesNotExist:
            raise Http404('No %s matches the given query.' % queryset.model._meta.object_name)

        self.check_object_permissions(self.request, obj)

        serializer = self.get_serialezer(request.user, obj)
        return Response(serializer.data)


class PublicUserProfileViewSet(ModelViewSet):
    """
    API endpoint that allows users to be viewed and searched only.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = PublicUserProfileSerializer
    http_method_names = ['get', 'head', 'options']
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PublicUserFilter
    pagination_class = UserPageNumberPagination
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
    serializer_class = AdminUserProfileSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = UserFilter
    pagination_class = UserPageNumberPagination
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
