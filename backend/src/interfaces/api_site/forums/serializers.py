# -*- coding: utf-8 -*-

from django.core.paginator import Paginator
from forums.models import ForumGroup, ForumPost, ForumThread, ForumTopic, ForumThreadSubscription
from interfaces.api_site.users.serializers import DisplayUserProfileSerializer, UserForForumSerializer
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from users.models import User


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
            'post_number'
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
    topics = ForumTopicIndexSerializer(read_only=True, many=True)
    topic_count = serializers.SerializerMethodField()
    threads = ForumThreadForIndexSerializer(read_only=True, many=True)
    posts = ForumPostForIndexSerializer(read_only=True, many=True)

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


class ForumTopicListSerializer(ModelSerializer):
    groups = ForumGroupTopicSerializer(read_only=True, source='group')
    threads = serializers.SerializerMethodField('paginated_threads')
    posts = ForumPostTopicSerializer(read_only=True, many=True)
    thread_users = UserForForumSerializer(source='threads.created_by', read_only=True)
    latest_post_user = UserForForumSerializer(source='latest_post.author', read_only=True)

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

    # This will allow for the front end to request a page size, or it will default to max 15 threads per page.

    def paginated_threads(self, obj):
        page_size = self.context['request'].query_params.get('size') or 15
        paginator = Paginator(obj.threads.all(), page_size)
        page_number = self.context['request'].query_params.get('page') or 1
        threads = paginator.page(page_number)
        serializer = ForumThreadTopicSerializer(threads, many=True)

        return serializer.data


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


class UserForumSerializer(ModelSerializer):
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


class ForumPostThreadSerializer(ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(read_only=True, source='thread.topic')
    users = UserForumSerializer(source='author')

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
            'page_number',
            'post_number',
            'users',
        )


class ForumPostCreateSerializer(ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True,
                                                )

    class Meta:
        model = ForumPost
        fields = (
            'id',
            'author',
            'body',
            'thread',
            'page_number',
            'post_number',
        )

        extra_kwargs = {
            'page_number': {'read_only': True},
            'post_number': {'read_only': True},
        }


class ForumThreadListSerializer(ModelSerializer):
    topics = ForumTopicThreadSerializer(read_only=True, source='topic')
    groups = ForumGroupTopicSerializer(read_only=True, source='topic.group')
    posts = serializers.SerializerMethodField('paginated_posts')
    thread_users = UserForumSerializer(source='created_by')

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
            'created_at',
            'created_by',
            'modified_by',
            'number_of_posts',
            'posts',
            'thread_users',
        )

    # This will allow for the front end to request a page size, or it will default to max 15 posts per page.

    def paginated_posts(self, obj):
        page_size = self.context['request'].query_params.get('size') or 15
        paginator = Paginator(obj.posts.all(), page_size)
        page_number = self.context['request'].query_params.get('page') or 1
        posts = paginator.page(page_number)
        serializer = ForumPostThreadSerializer(posts, many=True)

        return serializer.data
