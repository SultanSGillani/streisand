from api import mixins as api_mixins
from api.pagination import ForumsPageNumberPagination, DetailPagination
from api.permissions import IsOwnerOrReadOnly
from django.db.models import OuterRef, Subquery
from django.db.models import Q
from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost, ForumThreadSubscription, ForumReport
from rest_framework import mixins
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from .serializers import (
    UserForForumSerializer,
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


class ForumIndexViewSet(api_mixins.AllowFieldLimitingMixin, ModelViewSet):
    """
    API endpoint for an overall Forum Index GET request.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumIndexSerializer
    queryset = ForumGroup.objects.all().prefetch_related(
        'topics__latest_post__author',
        'topics__latest_post__author__user_class',
        'topics__latest_post__thread',
        'topics__group',
    ).order_by('sort_order').distinct('sort_order')
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'topics__latest_post__author__username', 'topics__latest_post__thread__title',
                     'topics__name']
    pagination_class = DetailPagination

    def get_queryset(self, *args, **kwargs):
        queryset_list = ForumGroup.objects.all().prefetch_related(
            'topics__latest_post__thread',
        )  # filter(user=self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(name__icontains=query) |
                Q(topics__name__icontains=query) |
                Q(topics__latest_post__author__username__icontains=query) |
                Q(topics__latest_post__thread__title__icontains=query)
            ).distinct()
        return queryset_list



class ForumTopicIndexViewSet(api_mixins.AllowFieldLimitingMixin, ModelViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for GET requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumTopicIndexSerializer
    queryset = ForumTopic.objects.all().select_related(
        'group', 'minimum_user_class', 'latest_post'
    ).prefetch_related(
        'group', 'minimum_user_class', 'threads',
        'latest_post', 'latest_post__author',
        'latest_post__author__user_class',
        'latest_post__thread__topic'
    ).order_by('sort_order').distinct('sort_order')
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'threads__created_by__username', 'latest_post__body', 'latest_post__author__username',
                     'threads__title', 'group__name']
    pagination_class = DetailPagination

    def get_queryset(self, *args, **kwargs):
        queryset_list = ForumTopic.objects.all().prefetch_related(
            'group', 'threads', 'latest_post', 'latest_post__author',

        )  # filter(user=self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(name__icontains=query) |
                Q(group__name__icontains=query) |
                Q(threads__created_by__username__icontains=query) |
                Q(threads__title__icontains=query) |
                Q(latest_post__body__icontains=query) |
                Q(latest_post__author__username__icontains=query)
            ).distinct()
        return queryset_list


class ForumThreadIndexViewSet(api_mixins.AllowFieldLimitingMixin, ModelViewSet):
    """
    API endpoint for Forum Threads. This should be mainly used for GET requests only.
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
        'topic',
        'topic__group',
        'posts__thread__created_at',
    ).order_by('is_sticky', 'latest_post__created_at').distinct('is_sticky', 'latest_post__created_at', )
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'created_by__username', 'posts__body', 'posts__author__username', ]
    pagination_class = DetailPagination

    def get_queryset(self, *args, **kwargs):
        queryset_list = ForumThread.objects.all().prefetch_related(
            'topic__group',
            'created_by',
            'posts__author',

        )  # filter(user=self.request.user)
        query = self.request.GET.get("q")
        if query:
            queryset_list = queryset_list.filter(
                Q(title__icontains=query) |
                Q(created_by__username__icontains=query) |
                Q(posts__body__icontains=query) |
                Q(posts__author__username__icontains=query)
            ).distinct()
        return queryset_list


class ForumGroupItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                            mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAdminUser]
    serializer_class = ForumGroupItemSerializer
    queryset = ForumGroup.objects.all()
    pagination_class = DetailPagination


class ForumTopicItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                            mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ForumTopicItemSerializer
    queryset = ForumTopic.objects.all()
    pagination_class = DetailPagination


class ForumThreadItemViewSet(mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                             mixins.RetrieveModelMixin, GenericViewSet):
    """
    API endpoint for Forum Topics. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ForumThreadItemSerializer
    pagination_class = DetailPagination
    queryset = ForumThread.objects.all().prefetch_related(
        'topic',
        'topic__latest_post',
        'created_by',
    ).order_by('created_at').distinct('created_at')

    def get_queryset(self):
        queryset = super().get_queryset().accessible_to_user(self.request.user)

        thread_id = self.request.query_params.get('thread_id', None)
        if thread_id is not None:
            queryset = queryset.filter(thread_id=thread_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user
                        )

    def perform_partial_update(self, serializer, **kwargs):
        kwargs['partial'] = True
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


class ForumPostItemViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           GenericViewSet):
    """
    API endpoint for Forum Posts. This should be mainly used for POST, PATCH, and DELETE requests only.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ForumPostItemSerializer
    pagination_class = DetailPagination
    queryset = ForumPost.objects.all().prefetch_related(
        'thread',
        'thread__topic',
        'topic_latest__latest_post',
        'author',
        'author__user_class',
    ).order_by('created_at').distinct('created_at')

    def get_queryset(self):
        queryset = super().get_queryset().accessible_to_user(self.request.user)

        post_id = self.request.query_params.get('post_id', None)
        if post_id is not None:
            queryset = queryset.filter(post_id=post_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user
                        )

    def perform_partial_update(self, serializer, **kwargs):
        kwargs['partial'] = True
        serializer.save(modified_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)


class NewsPostViewSet(ModelViewSet):
    """
    API endpoint that allows LatestForumPosts to be viewed, or edited.
    Please Note: Pagination is set to Page Number Pagination.
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

    pagination_class = ForumsPageNumberPagination

    def get_object(self):
        """
        If the 'latest' identifier is requested, fetch the most recent news post.
        """
        if self.action == 'retrieve' and self.kwargs[self.lookup_field] == 'latest':
            return self.get_queryset().first()
        return super().get_object()


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


class ForumReportViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ForumReport.objects.all()
    serializer_class = ForumReportSerializer
    pagination_class = ForumsPageNumberPagination
