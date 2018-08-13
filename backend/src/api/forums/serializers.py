# -*- coding: utf-8 -*-

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from drf_queryfields import QueryFieldsMixin

from api.utils import PaginatedRelationField, RelationPaginator
from forums.models import ForumGroup, ForumPost, ForumThread, ForumTopic, ForumThreadSubscription, ForumReport


class ForumThreadForIndexSerializer(ModelSerializer, serializers.PrimaryKeyRelatedField):
    class Meta:
        model = ForumThread
        fields = (
            'id',
            'title',
            'topic'
        )


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


class ForumIndexSerializer(QueryFieldsMixin, ModelSerializer):
    topics = ForumTopicForIndexSerializer(read_only=True, many=True)
    topic_count = serializers.SerializerMethodField()
    exclude_arg_name = 'omit'

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
    topic = serializers.PrimaryKeyRelatedField(source='thread.topic', read_only=True)

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'topic',
            'author',
            'created_at',
            'position',
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
            'number_of_posts',
            'latest_post',

        )


class ForumGroupForTopicSerializer(ModelSerializer):
    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
        )


class ForumTopicIndexSerializer(QueryFieldsMixin, ModelSerializer):
    groups = ForumGroupForTopicSerializer(source='group', read_only=True)
    threads = PaginatedRelationField(ForumThreadForTopicSerializer, paginator=RelationPaginator)
    number_of_posts = serializers.IntegerField(read_only=True)
    number_of_threads = serializers.IntegerField(read_only=True)
    exclude_arg_name = 'omit'

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
            'latest_post',
            'number_of_threads',
            'number_of_posts',
        )


class ForumTopicItemSerializer(ModelSerializer):
    sort_order = serializers.CharField(required=False)
    number_of_posts = serializers.IntegerField(read_only=True)
    number_of_threads = serializers.IntegerField(read_only=True)
    latest_post = serializers.PrimaryKeyRelatedField(read_only=True)

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
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    modified_by = serializers.PrimaryKeyRelatedField(read_only=True)
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

        read_only_fields = (
            'position',
            'created_at',
            'modified_at',
            'author',
            'modified_by',
            'total',
        )

    def get_total(self, obj):
        return obj.thread.number_of_posts

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class ForumThreadItemSerializer(ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    modified_at = serializers.DateTimeField(read_only=True)
    modified_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ForumThread
        fields = (
            'id',
            'created_by',
            'modified_by',
            'modified_at',
            'title',
            'topic',
            'is_locked',
            'is_sticky',
            'is_archived',
        )

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['modified_by'] = self.context['request'].user
        return super().update(instance, validated_data)


class ForumThreadIndexSerializer(QueryFieldsMixin, ModelSerializer):
    topics = ForumTopicForThreadSerializer(read_only=True, source='topic')
    groups = ForumGroupForTopicSerializer(read_only=True, source='topic.group')
    posts = PaginatedRelationField(ForumPostForThreadSerializer, paginator=RelationPaginator)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    modified_by = serializers.PrimaryKeyRelatedField(read_only=True)
    exclude_arg_name = 'omit'

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


class NewsSerializer(QueryFieldsMixin, ModelSerializer):
    thread_title = serializers.PrimaryKeyRelatedField(source='thread.title', read_only=True)
    exclude_arg_name = 'omit'

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


class ForumThreadSubscriptionSerializer(QueryFieldsMixin, ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    exclude_arg_name = 'omit'

    class Meta:
        model = ForumThreadSubscription
        fields = (
            'id',
            'user',
            'thread'
        )

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ForumReportSerializer(QueryFieldsMixin, ModelSerializer):
    exclude_arg_name = 'omit'

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

    def create(self, validated_data):
        validated_data['reporting_user'] = self.context['request'].user
        return super().create(validated_data)
