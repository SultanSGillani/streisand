# -*- coding: utf-8 -*-

from rest_framework.serializers import ModelSerializer, SerializerMethodField, HyperlinkedIdentityField


from wiki.models import WikiArticle


class WikiCreateUpdateDestroySerializer(ModelSerializer):
    class Meta:
        model = WikiArticle
        fields = (
            'id', 'created_at', 'created_by', 'modified_at', 'modified_by', 'title', 'body',
            'read_access_minimum_user_class',
            'write_access_minimum_user_class',)


class WikiViewListOnlySerializer(ModelSerializer):

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


class WikiBodySerializer(ModelSerializer):

    body_html = SerializerMethodField()
    url = HyperlinkedIdentityField(view_name="wiki-body-detail")

    class Meta:
        model = WikiArticle
        fields = (
            'id',
            'body',
            'url',
        )

