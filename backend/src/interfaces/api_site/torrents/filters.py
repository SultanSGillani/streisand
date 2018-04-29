from django_filters import rest_framework as filters

from torrents.models import Torrent


class TorrentFilter(filters.FilterSet):
    encoded_by = filters.CharFilter(field_name='encoded_by__username', lookup_expr='icontains')
    uploaded_by = filters.CharFilter(field_name='uploaded_by__username', lookup_expr='icontains')
    moderated_by = filters.CharFilter(field_name='moderated_by__username', lookup_expr='icontains')
    film = filters.CharFilter(field_name='film__title', lookup_expr='icontains')

    class Meta:
        model = Torrent
        fields = (
            'id',
            'cut',
            'film',
            'codec',
            'encoded_by',
            'container',
            'resolution',
            'is_source',
            'is_3d',
            'uploaded_by',
            'uploaded_at',
            'last_seeded',
            'snatch_count',
            'reseed_request',
            'is_approved',
            'moderated_by',
            'release_name',
            'release_group',
            'source_media',
            'is_scene',
            'description',
        )
