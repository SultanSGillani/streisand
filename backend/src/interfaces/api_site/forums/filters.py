from django_filters import rest_framework as filters
from forums.models import ForumTopic, ForumThread, ForumPost


class ForumTopicFilter(filters.FilterSet):

    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    description = filters.CharFilter(field_name='description', lookup_expr='icontains')

    class Meta:
        model = ForumTopic
        fields = ['name', 'description', ]


class ForumThreadFilter(filters.FilterSet):

    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gt',)
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='lt',)
    date_range = filters.DateRangeFilter(field_name='created_at')
    created_by = filters.CharFilter(field_name='created_by__username', lookup_expr='icontains')
    posts_author = filters.CharFilter(field_name='posts__author__username', lookup_expr='icontains')

    class Meta:
        model = ForumThread
        fields = ['title', 'created_by', 'posts_author', ]


class ForumPostFilter(filters.FilterSet):

    body = filters.CharFilter(field_name='body', lookup_expr='icontains')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gt', )
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='lt', )
    date_range = filters.DateRangeFilter(field_name='created_at')
    author_username = filters.CharFilter(field_name='author__username', lookup_expr='icontains')

    class Meta:
        model = ForumPost
        fields = ['body', 'author_username', ]
