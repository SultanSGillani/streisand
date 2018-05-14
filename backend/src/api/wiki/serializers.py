# -*- coding: utf-8 -*-

from rest_framework.serializers import ModelSerializer


from wiki.models import WikiArticle


class WikiDetialSererializer(ModelSerializer):
    class Meta:
        model = WikiArticle
        fields = (
            'id', 'created_at', 'created_by', 'modified_at', 'modified_by', 'title', 'body',
            'read_access_minimum_user_class',
            'write_access_minimum_user_class',)


class WikiListSerializer(ModelSerializer):

    class Meta:
        model = WikiArticle
        fields = (
            'id',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            'title',
            'read_access_minimum_user_class',
            'write_access_minimum_user_class',
        )
