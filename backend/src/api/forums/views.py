# -*- coding: utf-8 -*-

from django.db.models import OuterRef, Subquery
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost, ForumThreadSubscription, ForumReport

from .filters import ForumTopicFilter, ForumThreadFilter, ForumGroupFilter
from .serializers import (
    ForumIndexSerializer,
    ForumGroupItemSerializer,
    ForumTopicIndexSerializer,
    ForumTopicItemSerializer,
    ForumPostItemSerializer,
    ForumThreadItemSerializer,
    ForumThreadIndexSerializer,
    ForumThreadSubscriptionSerializer,
    NewsSerializer,
    ForumReportSerializer,
)


class ForumIndexViewSet(ModelViewSet):
    """
    API endpoint for an overall Forum Index GET request.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumIndexSerializer
    queryset = ForumGroup.objects.all().prefetch_related(
        'topics__latest_post__author',
        'topics__latest_post__thread',
        'topics__group',
    ).order_by(
        'sort_order'
    ).distinct()
    filter_backends = [DjangoFilterBackend]
    filter_class = ForumGroupFilter

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumGroupItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                            mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Groups. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAdminUser]
    serializer_class = ForumGroupItemSerializer
    queryset = ForumGroup.objects.all().prefetch_related(
        'topics__latest_post__author',
        'topics__latest_post__thread',
        'topics__group',
    ).order_by(
        'sort_order'
    ).distinct()

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumTopicIndexViewSet(ModelViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for GET requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumTopicIndexSerializer
    queryset = ForumTopic.objects.all().select_related(
        'group',
        'minimum_user_class',
        'latest_post',
    ).prefetch_related(
        'threads',
    ).order_by(
        'sort_order'
    ).distinct()

    filter_backends = [DjangoFilterBackend]
    filter_class = ForumTopicFilter

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumTopicItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                            mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAdminUser]
    serializer_class = ForumTopicItemSerializer
    queryset = ForumTopic.objects.all().select_related(
        'group',
        'minimum_user_class',
        'latest_post'
    ).prefetch_related(
        'threads',
    ).order_by(
        'sort_order'
    ).distinct()

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumThreadIndexViewSet(ModelViewSet):
    """
    API endpoint for Forum Threads. This should be mainly used for GET requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadIndexSerializer
    queryset = ForumThread.objects.all().select_related(
        'created_by',
        'latest_post',
        'topic',
        'topic__group',
        'topic__latest_post__author',
        'latest_post__thread_latest',
        'latest_post__author',
    ).prefetch_related(
        'posts',
        'posts__author',
    ).order_by(
        'is_sticky',
        'latest_post__created_at'
    ).distinct()
    filter_backends = [DjangoFilterBackend]
    filter_class = ForumThreadFilter

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumThreadItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                             mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadItemSerializer
    queryset = ForumThread.objects.all().select_related(
        'topic',
        'topic__latest_post',
        'created_by',
    ).order_by(
        'created_at'
    ).distinct()

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumPostItemViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           GenericViewSet):
    """
    API endpoint for Forum Posts. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumPostItemSerializer
    queryset = ForumPost.objects.all().select_related(
        'thread',
        'thread__topic',
        'topic_latest__latest_post',
        'author',
    ).order_by(
        'created_at'
    ).distinct()

    def get_queryset(self):
        queryset = super().get_queryset().accessible_to_user(self.request.user)

        thread_id = self.request.query_params.get('thread_id', None)
        if thread_id is not None:
            queryset = queryset.filter(thread_id=thread_id)

        return queryset


class NewsPostViewSet(ModelViewSet):
    """
    API endpoint that allows LatestForumPosts to be viewed, or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer

    def get_queryset(self):
        # Earliest post subquery
        earliest_post = ForumPost.objects.filter(
            thread=OuterRef('id'),
        ).order_by(
            'created_at',
        ).values('id')[:1]

        # Get news threads with earliest post
        news_threads = ForumThread.objects.filter(
            topic__name='Announcements',
        ).annotate(
            earliest_post_id=Subquery(earliest_post),
        )

        # Return earliest posts from each thread
        return ForumPost.objects.filter(
            id__in=news_threads.values('earliest_post_id'),
        ).prefetch_related(
            'thread',
            'author',
            'author__user_class',
        ).order_by(
            '-created_at',
        ).distinct()

    def get_object(self):
        """
        If the 'latest' identifier is requested, fetch the most recent news post.
        """
        if self.action == 'retrieve' and self.kwargs[self.lookup_field] == 'latest':
            return self.get_queryset().first()
        return super().get_object()


class ForumThreadSubscriptionViewSet(ModelViewSet):
    """
    API endpoint that allows thread subscriptions to be viewed, or edited.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadSubscriptionSerializer
    queryset = ForumThreadSubscription.objects.all().select_related(
        'thread',
    ).order_by(
        'thread'
    )

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForumThreadSubscription.objects.all()
        else:
            return ForumThreadSubscription.objects.filter(user=self.request.user)


class ForumReportViewSet(ModelViewSet):
    """
    API endpoint For Reporting Forum threads/posts.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumReportSerializer
    queryset = ForumReport.objects.all(
    ).select_related(
        'post',
        'reporting_user',
        'thread',
        'resolved_by',
    ).order_by(
        'thread',
    )

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForumReport.objects.all()
        else:
            return ForumReport.objects.filter(reporting_user=self.request.user)
