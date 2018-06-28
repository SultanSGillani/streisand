# -*- coding: utf-8 -*-

from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.db import transaction

from knox.models import AuthToken
from rest_framework import serializers, validators

from api.mixins import AllowFieldLimitingMixin
from api.validators import invite_key_validator
from invites.models import Invite
from users.models import User, UserIPAddress, UserAnnounce


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class UserIPSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    ip_address = serializers.SerializerMethodField()

    class Meta:
        model = UserIPAddress
        fields = (
            'id',
            'user',
            'first_used',
            'last_used',
            'used_with',
            'ip_address',
        )

    def get_ip_address(self, obj):
        if obj.user.user_class.is_staff:
            return '127.0.0.1'
        return obj.ip_address


class AdminUserSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):

    user_class_rank = serializers.PrimaryKeyRelatedField(source='user_class', read_only=True)
    ip_addresses = UserIPSerializer(many=True, read_only=True)
    user_class = serializers.StringRelatedField()
    username = serializers.StringRelatedField(read_only=True)
    watch_queue = serializers.StringRelatedField(source='watchlist_entries', many=True, read_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'user_class',
            'user_class_rank',
            'last_login',
            'ip_addresses',
            'username',
            'email',
            'is_superuser',
            'is_staff',
            'is_active',
            'date_joined',
            'is_donor',
            'account_status',
            'failed_login_attempts',
            'avatar_url',
            'custom_title',
            'profile_description',
            'staff_notes',
            'irc_key',
            'last_seen',
            'invite_count',
            'invite_tree',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
            'average_seeding_size',
            'announce_key',
            'announce_url',
            'invited_by',
            'watch_queue',
            'user_permissions',
        )


class CurrentUserSerializer(AdminUserSerializer):

    user_class = serializers.StringRelatedField(read_only=True)

    class Meta(AdminUserSerializer.Meta):

        fields = (
            'id',
            'username',
            'email',
            'user_class',
            'date_joined',
            'account_status',
            'is_donor',
            'invite_count',
            'invite_tree',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
            'average_seeding_size',
            'announce_key',
            'announce_url',
            'avatar_url',
            'custom_title',
            'profile_description',
            'irc_key',
            'invited_by',
            'watch_queue',
        )

        read_only_fields = (
            'id',
            'username',
            'user_class',
            'date_joined',
            'account_status',
            'is_donor',
            'invite_count',
            'invite_tree',
            'invited_by',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
            'average_seeding_size',
            'announce_key',
            'announce_url',
            'custom_title',
        )


class PublicUserSerializer(CurrentUserSerializer, AllowFieldLimitingMixin):
    username = serializers.StringRelatedField(read_only=True)

    class Meta(CurrentUserSerializer.Meta):
        fields = (
            'id',
            'username',
            'email',
            'user_class',
            'account_status',
            'is_donor',
            'custom_title',
            'avatar_url',
            'profile_description',
            'average_seeding_size',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
        )


class DisplayUserSerializer(PublicUserSerializer, AllowFieldLimitingMixin):
    class Meta(PublicUserSerializer.Meta):
        fields = (
            'id',
            'username',
            'user_class',
            'account_status',
            'is_donor',
            'custom_title',
            'avatar_url',
        )


class UsernameAvailabilitySerializer(serializers.Serializer):

    username = serializers.CharField(
        required=True,
        validators=[User.username_validator],
    )
    invite_key = serializers.UUIDField(
        required=True,
        write_only=True,
        allow_null=True,
        validators=[invite_key_validator],
    )
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        fields = (
            'username',
            'invite_key',
            'is_available',
        )

    def create(self, validated_data):
        username = validated_data['username']
        validated_data['is_available'] = not User.objects.filter(username=username).exists()
        return validated_data


class NewUserRegistrationSerializer(CurrentUserSerializer):

    email = serializers.EmailField(
        required=True,
        validators=[User.email_validator],
    )
    username = serializers.CharField(
        required=True,
        max_length=32,
        read_only=False,
        validators=[
            User.username_validator,
            validators.UniqueValidator(
                queryset=User.objects.all(),
                message="This username is taken.",
            ),
        ],
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
    )
    invite_key = serializers.UUIDField(
        required=True,
        write_only=True,
        validators=[invite_key_validator],
    )
    token = serializers.SerializerMethodField()

    class Meta(CurrentUserSerializer.Meta):
        fields = CurrentUserSerializer.Meta.fields + (
            'invite_key',
            'password',
            'token',
        )

    @staticmethod
    def get_token(user):
        return AuthToken.objects.create(user=user)

    def create(self, validated_data):

        invite_key = validated_data['invite_key']
        invite = Invite.objects.get(key=invite_key) if invite_key else None

        with transaction.atomic():

            if invite:
                invite.delete()

            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                invited_by=invite.offered_by if invite else None,
            )

        return user


class UserAnnounceSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(source='user.username')
    torrent = serializers.StringRelatedField(source='torrent_id')

    class Meta:
        model = UserAnnounce
        fields = '__all__'
