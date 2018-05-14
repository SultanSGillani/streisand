# -*- coding: utf-8 -*-

from rest_framework.serializers import ModelSerializer
from dry_rest_permissions.generics import DRYPermissionsField

from wiki.models import WikiArticle


LIST_FIELDS = (
    'id',
    'created_at',
    'created_by',
    'modified_at',
    'modified_by',
    'title',
    'read_access_minimum_user_class',
    'write_access_minimum_user_class',
)


class WikiDetailSererializer(ModelSerializer):
    permissions = DRYPermissionsField()

    class Meta:
        model = WikiArticle
        fields = LIST_FIELDS + ('body', 'permissions')


class WikiListSerializer(ModelSerializer):

    class Meta:
        model = WikiArticle
        fields = LIST_FIELDS
