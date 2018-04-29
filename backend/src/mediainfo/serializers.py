# -*- coding: utf-8 -*-

from rest_framework import serializers

from .models import Mediainfo


class AdminMediainfoSerializer(serializers.ModelSerializer):

    # audio = serializers.SerializerMethodField()
    # subtitles = serializers.SerializerMethodField()

    class Meta:
        model = Mediainfo
        fields = (
            'id',
            'text',
            'runtime',
            'resolution_width',
            'resolution_height',
            'display_aspect_ratio',
            'bit_rate',
            'frame_rate',
            'has_chapters',
            'is_dxva_compliant',
            'is_quality_encode',
            # 'audio',
            # 'subtitles',
        )

    @staticmethod
    def get_audio(obj):
        return list(obj.audio)

    @staticmethod
    def get_subtitles(obj):
        return list(obj.subtitles)
