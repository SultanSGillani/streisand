# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers, validators

from api.mixins import AllowFieldLimitingMixin
from users.models import User, UserIPAddress, UserTorrentDownloadKey


class UserTorrentDownloadKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTorrentDownloadKey
        fields = ('id', 'user', 'issued_at', 'revoked_at', 'revocation_notes')


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class UserIPSerializer(AllowFieldLimitingMixin, serializers.ModelSerializer):
    ip_address = serializers.SerializerMethodField()

    class Meta:
        model = UserIPAddress
        fields = ('id', 'user', 'first_used', 'last_used', 'ip_address')

    def get_ip_address(self, obj):
        if obj.user.user_class.is_staff:
            return '127.0.0.1'
        return obj.ip_address


class AdminUserProfileSerializer(AllowFieldLimitingMixin,
                                 serializers.ModelSerializer):
    user_class_rank = serializers.PrimaryKeyRelatedField(
        source='user_class', read_only=True)
    ip_addresses = UserIPSerializer(many=True, read_only=True)
    user_class = serializers.StringRelatedField()

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
            'torrents',
        )


class CurrentUserSerializer(AllowFieldLimitingMixin,
                            serializers.ModelSerializer):
    user_class = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'date_joined',
            'is_donor',
            'invite_count',
            'invite_tree',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
            'average_seeding_size',
            'announce_key',
            'announce_url',
            'user_class',
            'avatar_url',
            'custom_title',
            'profile_description',
            'irc_key',
            'invited_by',
            'watch_queue',
            'torrents',
        )


class OwnedUserProfileSerializer(AdminUserProfileSerializer):
    class Meta:
        model = User(AdminUserProfileSerializer.Meta)
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
            'irc_key',
            'announce_key',
            'invite_count',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
        )

    extra_kwargs = {'username': {'read_only': True, 'required': True}}


class PublicUserProfileSerializer(OwnedUserProfileSerializer):
    username = serializers.StringRelatedField(read_only=True)

    class Meta(OwnedUserProfileSerializer.Meta):
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


class DisplayUserProfileSerializer(PublicUserProfileSerializer):
    class Meta(PublicUserProfileSerializer.Meta):
        fields = (
            'id',
            'username',
            'user_class',
            'account_status',
            'is_donor',
            'custom_title',
            'avatar_url',
        )


class UserForForumSerializer(PublicUserProfileSerializer):
    class Meta(PublicUserProfileSerializer.Meta):
        fields = (
            'id',
            'username',
        )


class NewUserSerializer(serializers.ModelSerializer):
    # TODO: add invite key
    email = serializers.EmailField(
        required=True,
        validators=[validators.UniqueValidator(queryset=User.objects.all())])
    username = serializers.CharField(
        max_length=32,
        validators=[validators.UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['email'],
                                        validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user

        raise serializers.ValidationError(
            "Unable to log in with provided credentials.")
