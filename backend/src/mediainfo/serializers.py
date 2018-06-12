# -*- coding: utf-8 -*-

from rest_framework import serializers

from .models import Mediainfo


class MediainfoSerializer(serializers.ModelSerializer):

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
            'audio',
            'subtitles',
        )
