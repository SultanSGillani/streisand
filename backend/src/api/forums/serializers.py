# -*- coding: utf-8 -*-
from api.utils import PaginatedRelationField, RelationPaginator
from forums.models import ForumGroup, ForumPost, ForumThread, ForumTopic, ForumThreadSubscription
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from users.models import User


class UserExpandForumSerializer(FlexFieldsModelSerializer):
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


class ForumPostSerializer(ModelSerializer):
    topic_name = serializers.StringRelatedField(read_only=True, source='thread.topic')
    topic_id = serializers.PrimaryKeyRelatedField(read_only=True, source='thread.topic')
    thread_title = serializers.StringRelatedField(read_only=True, source='thread')
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)
    author_username = serializers.StringRelatedField(source='author', read_only=True)
    modified_by_id = serializers.PrimaryKeyRelatedField(source='modified_by', read_only=True)
    modified_by_username = serializers.StringRelatedField(source='modified_by', read_only=True)

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'thread_title',
            'topic_id',
            'topic_name',
            'author_id',
            'author_username',
            'body',
            'created_at',
            'modified_at',
            'modified_by_id',
            'modified_by_username',
        )


class ForumPostForThreadSerializer(ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True,
                                                   source='author')
    author_username = serializers.StringRelatedField(default=serializers.CurrentUserDefault(), read_only=True,
                                                     source='author')
    post_body = serializers.CharField(max_length=2000, source='body')

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author_id',
            'author_username',
            'post_body',
            'created_at',
            'modified_at',
        )


class ForumThreadSerializer(ModelSerializer):
    created_by_id = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(),
                                                       read_only=True, source='created_by'
                                                       )
    created_by = serializers.StringRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    topic_title = serializers.StringRelatedField(read_only=True, source='topic')
    latest_post_author_username = serializers.StringRelatedField(source='latest_post.author', read_only=True)
    latest_post_author_id = serializers.PrimaryKeyRelatedField(source='latest_post.author', read_only=True)
    latest_post_created_at = serializers.PrimaryKeyRelatedField(source='latest_post.created_at', read_only=True)
    posts = ForumPostForThreadSerializer(many=True, read_only=True)

    class Meta(ForumPostForThreadSerializer.Meta):
        model = ForumThread
        fields = (
            'id',
            'topic',
            'topic_title',
            'title',
            'created_at',
            'created_by_id',
            'created_by',
            'is_locked',
            'is_sticky',
            'number_of_posts',
            'latest_post',
            'latest_post_created_at',
            'latest_post_author_id',
            'latest_post_author_username',
            'posts',
            'subscribed_users',
        )

    extra_kwargs = {
        'number_of_posts': {'read_only': True},
        'latest_post_author_id': {'read_only': True},
        'latest_post_author_username': {'read_only': True},
        'topic_title': {'read_only': True}
    }


class ForumTopicSerializer(ModelSerializer):
    latest_post = ForumPostSerializer(read_only=True)

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
            'number_of_threads': {'read_only': True},
            'number_of_posts': {'read_only': True},
            'latest_post': {'read_only': True},
        }


class ForumTopicDataSerializer(ModelSerializer):
    latest_post_id = serializers.PrimaryKeyRelatedField(source='latest_post.id', read_only=True)
    latest_post_author_id = serializers.PrimaryKeyRelatedField(source='latest_post.author', read_only=True)
    latest_post_author_name = serializers.StringRelatedField(source='latest_post.author', read_only=True)
    latest_post_thread_id = serializers.PrimaryKeyRelatedField(source='latest_post.thread.id', read_only=True)
    latest_post_thread_title = serializers.StringRelatedField(source='latest_post.thread.title', read_only=True)
    latest_post_created_at = serializers.DateTimeField(source='latest_post.thread.created_at', read_only=True)

    class Meta:
        model = ForumTopic
        fields = (
            'id',
            'sort_order',
            'name',
            'description',
            'minimum_user_class',
            'number_of_threads',
            'number_of_posts',
            'latest_post_id',
            'latest_post_created_at',
            'latest_post_author_id',
            'latest_post_author_name',
            'latest_post_thread_id',
            'latest_post_thread_title',
        )


class ForumThreadIndexSerializer(ModelSerializer):
    group_name = serializers.StringRelatedField(read_only=True, source='topic.group')
    group_id = serializers.PrimaryKeyRelatedField(read_only=True, source='topic.group')
    created_by_id = serializers.PrimaryKeyRelatedField(source='created_by', read_only=True)
    created_by_username = serializers.StringRelatedField(source='created_by', read_only=True)
    topic_title = serializers.StringRelatedField(read_only=True, source='topic')
    latest_post_author_username = serializers.StringRelatedField(source='latest_post.author', read_only=True)
    latest_post_author_id = serializers.PrimaryKeyRelatedField(source='latest_post.author', read_only=True)
    latest_post_created_at = serializers.DateTimeField(source='latest_post.created_at', read_only=True)

    class Meta:
        model = ForumThread
        fields = (
            'group_id',
            'group_name',
            'topic',
            'topic_title',
            'id',
            'title',
            'created_at',
            'created_by_id',
            'created_by_username',
            'is_locked',
            'is_sticky',
            'number_of_posts',
            'posts',
            'latest_post',
            'latest_post_created_at',
            'latest_post_author_id',
            'latest_post_author_username',
        )


class ForumGroupSerializer(ModelSerializer):
    topic_count = serializers.IntegerField(source='topics.count', read_only=True)
    topics_data = ForumTopicDataSerializer(many=True, source='topics', read_only=True)

    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
            'sort_order',
            'topic_count',
            'topics_data',

        )


class ForumThreadSubscriptionSerializer(ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ForumThreadSubscription
        fields = ('user', 'thread')


class ForumThreadForIndexSerializer(ModelSerializer, serializers.PrimaryKeyRelatedField):
    class Meta:
        model = ForumThread
        fields = ('id', 'title', 'topic')


class ForumPostForIndexSerializer(ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(read_only=True, source='thread.topic')

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'topic',
            'author',
            'created_at',
            'page_number',
            'position'
        )


class ForumTopicIndexSerializer(ModelSerializer):
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
            'number_of_posts'
        )


class ForumIndexSerializer(ModelSerializer):
    topics = PaginatedRelationField(ForumTopicIndexSerializer, paginator=RelationPaginator)
    topic_count = serializers.SerializerMethodField()
    threads = ForumThreadForIndexSerializer(read_only=True, many=True)
    posts = ForumPostForIndexSerializer(source='topics.latest_post', read_only=True)

    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
            'sort_order',
            'topics',
            'topic_count',
            'threads',
            'posts',
        )

    def get_topic_count(self, obj):
        return obj.topics.count()

    def __init__(self, *args, **kwargs):
        super(ForumIndexSerializer, self).__init__(*args, **kwargs)

        if 'context' in kwargs:
            if 'request' in kwargs['context']:
                tabs = kwargs['context']['request'].query_params.getlist('tab', [])
                if tabs:
                    # tabs = tabs.split(',')
                    included = set(tabs)
                    existing = set(self.fields.keys())

                    for other in existing - included:
                        self.fields.pop(other)


class ForumThreadTopicSerializer(ModelSerializer):
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
        )


class ForumGroupTopicSerializer(ModelSerializer):
    class Meta:
        model = ForumGroup
        fields = (
            'id',
            'name',
        )


class ForumPostTopicSerializer(ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(source='topic_latest', read_only=True)

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'thread',
            'topic',
            'author',
            'created_at',
        )


class ForumTopicListSerializer(FlexFieldsModelSerializer):
    groups = ForumGroupTopicSerializer(read_only=True, source='group')
    threads = PaginatedRelationField(ForumThreadTopicSerializer, paginator=RelationPaginator)
    posts = ForumPostTopicSerializer(read_only=True, many=True)
    thread_users = UserExpandForumSerializer(source='threads.created_by', read_only=True)
    latest_post_user = UserExpandForumSerializer(source='latest_post.author', read_only=True)

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
            'posts',
            'number_of_threads',
            'number_of_posts',
            'latest_post_user',
            'thread_users',
        )

    '''
       Add a way to be able to query for specific resources. For Example: /api/v1/new-topic-index/?&tab=posts&tab=id
       Will give only posts, and Id of the thread
       '''

    def __init__(self, *args, **kwargs):
        super(ForumTopicListSerializer, self).__init__(*args, **kwargs)

        if 'context' in kwargs:
            if 'request' in kwargs['context']:
                tabs = kwargs['context']['request'].query_params.getlist('tab', [])
                if tabs:
                    # tabs = [tb.split(',') for tb in tabs]
                    included = set(tabs)
                    existing = set(self.fields.keys())

                    for other in existing - included:
                        self.fields.pop(other)


class ForumTopicCreateSerializer(ModelSerializer):
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


class ForumTopicThreadSerializer(ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(read_only=True)
    name = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ForumThread
        fields = (
            'id',
            'group',
            'name',
        )


class ForumPostThreadSerializer(FlexFieldsModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(read_only=True, source='thread.topic')
    total = serializers.SerializerMethodField()

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
            'total',
        )

    expandable_fields = {
        'author': (UserExpandForumSerializer, {'source': 'author'}),
        'position': {'read_only': True},
        'modified_at': {'read_only': True},
        'modified_by': {'read_only': True},
        'total': {'read_only': True}
    }

    def get_total(self, obj):
        return obj.thread.number_of_posts


class ForumPostCreateSerializer(ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True, )
    total = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author',
            'modified_at',
            'modified_by',
            'body',
            'thread',
            'position',
            'total',

        )

    extra_kwargs = {
        'position': {'read_only': True},
        'modified_at': {'read_only': True},
        'modified_by': {'read_only': True},
        'total': {'read_only': True}
    }

    def get_total(self, obj):
        return obj.thread.number_of_posts


class ForumThreadCreateSerializer(ModelSerializer):
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


class ForumThreadListSerializer(FlexFieldsModelSerializer):
    topics = ForumTopicThreadSerializer(read_only=True, source='topic')
    groups = ForumGroupTopicSerializer(read_only=True, source='topic.group')
    posts = PaginatedRelationField(ForumPostThreadSerializer, paginator=RelationPaginator)
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

    expandable_fields = {
        'created_by': (UserExpandForumSerializer, {'source': 'created_by', 'many': False, 'expand': ['created_by']}),
        'modified_by': (UserExpandForumSerializer, {'source': 'modified_by', 'many': False, 'expand': ['modified_by']}),
        'posts': (ForumPostThreadSerializer, {'source': 'posts', 'many': True, 'expand': ['modified_by', 'author',
                                                                                          'thread']})

    }

    '''
    Add a way to be able to query for specific resources. For Example: /api/v1/new-thread-index/?&tab=posts&tab=id
    Will give only posts, and Id of the thread
    '''

    def __init__(self, *args, **kwargs):
        super(ForumThreadListSerializer, self).__init__(*args, **kwargs)

        if 'context' in kwargs:
            if 'request' in kwargs['context']:
                tabs = kwargs['context']['request'].query_params.getlist('tab', [])
                if tabs:
                    # tabs = tabs.split(',')
                    included = set(tabs)
                    existing = set(self.fields.keys())

                    for other in existing - included:
                        self.fields.pop(other)
