from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from django_filters import rest_framework as filters
from rest_framework import mixins
from rest_framework.mixins import Response
from django.db.models import OuterRef, Subquery
from www.pagination import ForumsPageNumberPagination
from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost, ForumThreadSubscription
from .serializers import (
    ForumGroupSerializer,
    ForumTopicSerializer,
    ForumThreadSerializer,
    ForumPostSerializer,
    ForumThreadIndexSerializer,
    ForumThreadSubscriptionSerializer,
)
from .filters import ForumTopicFilter, ForumThreadFilter, ForumPostFilter


class ForumGroupViewSet(ModelViewSet):
    """
    API endpoint that allows ForumGroups to be viewed, edited, or created.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumGroupSerializer
    queryset = ForumGroup.objects.all().prefetch_related(
        'topics__latest_post__author',
        'topics__latest_post__author__user_class',
        'topics__latest_post__thread',
    ).order_by('sort_order').distinct('sort_order')
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):
        return super().get_queryset().accessible_to_user(self.request.user)


class ForumTopicViewSet(ModelViewSet):
    """
    API endpoint that allows ForumTopics to be created, viewed, edited, or deleted.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumTopicSerializer
    queryset = ForumTopic.objects.all().select_related(
        'group', 'minimum_user_class', 'latest_post'
    ).prefetch_related(
        'group', 'minimum_user_class', 'threads',
        'latest_post', 'latest_post__author',
        'latest_post__author__user_class',
        'latest_post__thread__topic'
    ).order_by('sort_order').distinct('sort_order')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ForumTopicFilter
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):

        queryset = super().get_queryset().accessible_to_user(self.request.user)

        group_id = self.request.query_params.get('group_id', None)
        if group_id is not None:
            queryset = queryset.filter(group_id=group_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ForumThreadIndexViewSet(ModelViewSet):
    """
    API endpoint that allows ForumThreads to be viewed, and edited.
    This endpoint does not include all posts, see the forum-threads viewset for a list,
    and forum-thread-items for creating/updating/deleting.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadIndexSerializer
    queryset = ForumThread.objects.all().prefetch_related(
        'topic__group',
        'created_by',
        'posts__thread',
        'posts__author',
        'latest_post',
        'latest_post__thread_latest',
        'latest_post__author',
        'topic__latest_post__author',
        'topic__latest_post__author__user_class',
        'topic__latest_post__thread',
    ).order_by('-is_sticky', '-latest_post__created_at').distinct('is_sticky', 'latest_post__created_at')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ForumThreadFilter
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):

        queryset = super().get_queryset().accessible_to_user(self.request.user)

        topic_id = self.request.query_params.get('topic_id', None)
        if topic_id is not None:
            queryset = queryset.filter(topic_id=topic_id)

        return queryset


class ForumThreadWithAllPostsViewSet(mixins.ListModelMixin, GenericViewSet):
    """
    API endpoint that allows ForumThreads to be viewed only. This view shows all Forum Threads and associated posts.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadSerializer
    queryset = ForumThread.objects.all().prefetch_related(
        'posts',
        'created_by',
        'posts__thread',
        'posts__author',
        'latest_post',
        'latest_post__thread_latest',
        'latest_post__author',
        'topic__latest_post__author',
        'topic__latest_post__author__user_class',
        'topic__latest_post__thread',
        'subscribed_users',
    ).order_by('-created_at').distinct('created_at')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ForumThreadFilter
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):

        queryset = super().get_queryset().accessible_to_user(self.request.user)

        topic_id = self.request.query_params.get('topic_id', None)
        if topic_id is not None:
            queryset = queryset.filter(topic_id=topic_id)

        return queryset


class ForumThreadItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                             mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint that allows ForumThreads to be created, updated, edited or deleted only.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, pk=None):
        serializer = ForumThreadSerializer(request.user, data=request.data, partial=True)
        serializer.save(modified_by=self.request.user)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
    serializer_class = ForumThreadSerializer
    queryset = ForumThread.objects.all().prefetch_related(
        'created_by',
        'posts__author',
        'latest_post',
        'latest_post__author',
        'topic__latest_post__author',
        'topic__latest_post__author__user_class',
        'topic__latest_post__thread',
    ).order_by('topic__latest_post__thread').distinct('topic__latest_post__thread')
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):

        queryset = super().get_queryset().accessible_to_user(self.request.user)

        topic_id = self.request.query_params.get('topic_id', None)
        if topic_id is not None:
            queryset = queryset.filter(topic_id=topic_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


class ForumPostViewSet(ModelViewSet):
    """
    API endpoint that allows ForumPosts to be created, viewed, edited or deleted.
    Please Note: Pagination is set to Page Number Pagination.
    """
    serializer_class = ForumPostSerializer
    permission_classes = [IsAuthenticated]
    queryset = ForumPost.objects.all().prefetch_related(
        'thread',
        'thread__topic',
        'topic_latest__latest_post',
        'author',
        'author__user_class',
    ).order_by('-created_at').distinct('created_at')
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ForumPostFilter
    pagination_class = ForumsPageNumberPagination

    def get_queryset(self):

        queryset = super().get_queryset().accessible_to_user(self.request.user)

        thread_id = self.request.query_params.get('thread_id', None)
        if thread_id is not None:
            queryset = queryset.filter(thread_id=thread_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user
                        )

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


class ForumThreadSubscriptionViewSet(ModelViewSet):

    """
    API endpoint that allows ThreadSubscriptions to be viewed, or edited.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumThreadSubscriptionSerializer
    queryset = ForumThreadSubscription.objects.all().prefetch_related(
        'thread',
    ).order_by('-thread').distinct('thread')
    pagination_class = ForumsPageNumberPagination

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


class NewsPostViewSet(ModelViewSet):
    """
    API endpoint that allows LatestForumPosts to be viewed, or edited.
    Please Note: Pagination is set to Page Number Pagination.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumPostSerializer

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

    pagination_class = ForumsPageNumberPagination

    def get_object(self):
        """
        If the 'latest' identifier is requested, fetch the most recent news post.
        """
        if self.action == 'retrieve' and self.kwargs[self.lookup_field] == 'latest':
            return self.get_queryset().first()
        return super().get_object()
