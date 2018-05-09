# -*- coding: utf-8 -*-

from rest_framework import serializers

from tracker.models import Swarm, Peer, TorrentClient


class SwarmSerializer(serializers.ModelSerializer):

    class Meta:
        model = Swarm
        fields = '__all__'


class PeerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Peer
        fields = '__all__'


class TorrentClientSerializer(serializers.ModelSerializer):

    class Meta:
        model = TorrentClient
        fields = '__all__'
