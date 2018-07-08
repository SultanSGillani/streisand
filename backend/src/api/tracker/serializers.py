# -*- coding: utf-8 -*-

from rest_framework import serializers

from tracker.models import Peer, TorrentClient

from ..users.serializers import DisplayUserSerializer


class AdminPeerSerializer(serializers.ModelSerializer):

    user = DisplayUserSerializer()
    is_active = serializers.BooleanField()

    class Meta:
        model = Peer
        fields = '__all__'


class PeerSerializer(AdminPeerSerializer):

    class Meta(AdminPeerSerializer.Meta):
        fields = (
            'user',
            'bytes_uploaded',
            'bytes_downloaded',
            'bytes_remaining',
            'user_agent',
            'is_active',
        )
        read_only_fields = fields


class TorrentClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = TorrentClient
        fields = '__all__'
