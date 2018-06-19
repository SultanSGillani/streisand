# -*- coding: utf-8 -*-

from rest_framework import serializers, exceptions

from invites.managers import ZeroInvitesRemaining
from invites.models import Invite
from users.models import User

from ..users.serializers import DisplayUserSerializer


class InviteSerializer(serializers.ModelSerializer):

    offered_by = DisplayUserSerializer(read_only=True)
    key = serializers.UUIDField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[User.email_validator],
    )

    class Meta:
        model = Invite
        fields = (
            'email',
            'key',
            'created_at',
            'expires_at',
            'offered_by',
        )

    @staticmethod
    def validate_email(email):

        # Normalize email address
        normalized_email = User.objects.normalize_email(email)

        # Check uniqueness among invites
        if Invite.objects.currently_valid().filter(email=normalized_email).exists():
            raise serializers.ValidationError("This email address has already been invited.")

        if User.objects.filter(email=normalized_email).exists():
            raise serializers.ValidationError("A user with this email address already exists.")

        return normalized_email

    def create(self, validated_data):

        user = validated_data['offered_by'] = self.context['request'].user

        if not user.has_perm('users.can_invite'):
            raise exceptions.PermissionDenied("You don't have permission to invite new users.")

        try:
            return super().create(validated_data)
        except ZeroInvitesRemaining:
            raise serializers.ValidationError("You don't have any invites left!", code='invite_count')
