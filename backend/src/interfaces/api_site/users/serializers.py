# -*- coding: utf-8 -*-

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate, user_logged_in
from rest_framework import serializers
from django.contrib.auth.models import Group
from rest_framework_jwt.serializers import JSONWebTokenSerializer, jwt_payload_handler, jwt_encode_handler
from rest_framework_jwt.settings import api_settings
from users.models import User


class JWTSerializer(JSONWebTokenSerializer):
    def validate(self, attrs):
        credentials = {
            self.username_field: attrs.get(self.username_field),
            'password': attrs.get('password')
        }

        if all(credentials.values()):
            user = authenticate(request=self.context['request'], **credentials)

            if user:
                if not user.is_active:
                    msg = 'User account is disabled.'
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)
                user_logged_in.send(sender=user.__class__, request=self.context['request'], user=user)

                return {
                    'token': jwt_encode_handler(payload),
                    'user': user
                }
            else:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Must include "{username_field}" and "password".'
            msg = msg.format(username_field=self.username_field)
            raise serializers.ValidationError(msg)


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


class AdminUserProfileSerializer(serializers.ModelSerializer):
    user_class_rank = serializers.PrimaryKeyRelatedField(source='user_class', read_only=True)
    user_class = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = (
            'id',
            'user_class',
            'user_class_rank',
            'last_login',
            'username',
            'email',
            'is_superuser',
            'password',
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
            'invite_count',
            'bytes_uploaded',
            'bytes_downloaded',
            'last_seeded',
            'average_seeding_size',
            'announce_key',
            'invited_by',
            'watch_queue',
            'user_permissions',
            'torrents',
        )

        extra_kwargs = {'password': {'write_only': True, }}


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
    username = serializers.StringRelatedField()

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

    extra_kwargs = {'username': {'read_only': True, }}


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


class NewUserSerializer(serializers.ModelSerializer):
    # TODO: add invite key
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'confirm_password',
            'token',

        ]

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and password == confirm_password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, data):
        '''
        Ensure the passwords are the same
        '''

        if data['password']:
            print("Here")
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError(
                    "The passwords have to be the same"
                )
        return data
