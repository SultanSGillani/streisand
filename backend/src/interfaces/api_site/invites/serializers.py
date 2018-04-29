# -*- coding: utf-8 -*-

from rest_framework import serializers

from invites.models import Invite


class InviteSerializer(serializers.ModelSerializer):
    offered_by_id = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault(),
        source='offered_by'
    )
    offered_by_username = serializers.StringRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault(),
        source='offered_by'
    )

    class Meta:
        model = Invite
        fields = ('email', 'key', 'created_at', 'offered_by_id', 'offered_by_username', )
