# -*- coding: utf-8 -*-
from api import mixins as api_mixins
from api.utils import PaginatedRelationField, RelationPaginator
from forums.models import ForumGroup, ForumPost, ForumThread, ForumTopic, ForumThreadSubscription, ForumReport
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from users.models import User


class UserForForumSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'user_class',
            'account_status',
            'is_donor',
            'custom_title',
            'avatar_url',
        )


class ForumThreadForIndexSerializer(ModelSerializer, serializers.PrimaryKeyRelatedField):
    class Meta:
        model = ForumThread
        fields = (
            'id',
            'title',
            'topic')


class ForumPostForIndexSerializer(ModelSerializer):
    thread_title = serializers.StringRelatedField(source='thread', read_only=True)

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author',
            'thread',
            'thread_title',
            'created_at',
        )


class ForumTopicForIndexSerializer(ModelSerializer):
    latest_post = ForumPostForIndexSerializer()

    class Meta:
        model = ForumTopic
        fields = (
            'id',
            'group',
            'sort_order',
            'name',
            'description',
            'minimum_user_class',
            'number_of_threads',
            'number_of_posts',
            'latest_post',
        )


class ForumIndexSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    topics = ForumTopicForIndexSerializer(read_only=True, many=True)
    topic_count = serializers.SerializerMethodField()

    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
            'sort_order',
            'topics',
            'topic_count',
        )

    def get_topic_count(self, obj):
        return obj.topics.count()


class ForumGroupItemSerializer(ModelSerializer):
    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
            'sort_order',
        )


class ForumPostForTopicSerializer(ModelSerializer):
    author = UserForForumSerializer()
    modified_by = UserForForumSerializer()

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'author',
            'created_at',
            'modified_by',
        )


class ForumThreadForTopicSerializer(ModelSerializer):
    latest_post = ForumPostForTopicSerializer()

    class Meta:
        model = ForumThread
        fields = (
            'id',
            'title',
            'topic',
            'is_locked',
            'is_sticky',
            'created_at',
            'created_by',
            'latest_post',
            'number_of_posts',
        )


class ForumGroupForTopicSerializer(ModelSerializer):
    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
        )


class ForumTopicIndexSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    groups = ForumGroupForTopicSerializer(source='group', read_only=True)
    threads = PaginatedRelationField(ForumThreadForTopicSerializer, paginator=RelationPaginator)

    class Meta:
        model = ForumTopic
        fields = (
            'groups',
            'id',
            'group',
            'name',
            'description',
            'minimum_user_class',
            'threads',
            'number_of_threads',
            'number_of_posts',
            'latest_post',
        )

    extra_kwargs = {
        'sort_order': {'required': False},
        'number_of_posts': {'read_only': True},
        'number_of_threads': {'read_only': True},
    }


class ForumTopicItemSerializer(ModelSerializer):
    class Meta:
        model = ForumTopic
        fields = (
            'id',
            'group',
            'sort_order',
            'name',
            'description',
            'minimum_user_class',
            'number_of_threads',
            'number_of_posts',
            'latest_post',
        )

        extra_kwargs = {
            'sort_order': {'required': False},
            'number_of_posts': {'read_only': True},
            'number_of_threads': {'read_only': True},
        }


class ForumTopicForThreadSerializer(ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ForumThread
        fields = (
            'id',
            'group',
            'name',
        )


class ForumPostForThreadSerializer(ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(read_only=True, source='thread.topic')

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'topic',
            'author',
            'created_at',
            'body',
            'modified_at',
            'modified_by',
            'position',
        )


class ForumPostItemSerializer(ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True, )
    total = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author',
            'created_at',
            'modified_at',
            'modified_by',
            'body',
            'thread',
            'position',
            'total',

        )

    extra_kwargs = {
        'position': {'read_only': True},
        'created_at': {'read_only': True},
        'modified_at': {'read_only': True},
        'modified_by': {'read_only': True},
        'total': {'read_only': True}
    }

    def get_total(self, obj):
        return obj.thread.number_of_posts


class ForumThreadItemSerializer(ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True,
                                                    )

    class Meta:
        model = ForumThread
        fields = (
            'id',
            'created_by',
            'modified_by',
            'modified_at',
            'title',
            'topic',
        )

    extra_kwargs = {
        'modified_at': {'read_only': True},
        'modified_by': {'read_only': True},
    }


class ForumThreadIndexSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    topics = ForumTopicForThreadSerializer(read_only=True, source='topic')
    groups = ForumGroupForTopicSerializer(read_only=True, source='topic.group')
    posts = PaginatedRelationField(ForumPostForThreadSerializer, paginator=RelationPaginator)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    modified_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ForumThread
        fields = (
            'groups',
            'topics',
            'id',
            'title',
            'topic',
            'is_locked',
            'is_sticky',
            'created_by',
            'created_at',
            'modified_by',
            'number_of_posts',
            'posts',

        )


class NewsSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    thread_title = serializers.PrimaryKeyRelatedField(source='thread.title', read_only=True)

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author',
            'body',
            'created_at',
            'modified',
            'modified_by',
            'modified_at',
            'modified_count',
            'thread',
            'thread_title',

        )


class ForumThreadSubscriptionSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ForumThreadSubscription
        fields = (
            'user',
            'thread'
        )


class ForumReportSerializer(api_mixins.AllowFieldLimitingMixin, ModelSerializer):
    class Meta:
        model = ForumReport
        fields = (
            'reporting_user',
            'reported_at',
            'reason',
            'thread',
            'post',
            'resolved',
            'resolved_by',
            'date_resolved',
        )
