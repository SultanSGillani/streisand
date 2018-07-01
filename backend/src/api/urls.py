# -*- coding: utf-8 -*-

from django.conf.urls import url, include

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from knox import views as knox_views
from rest_framework import routers, permissions
from rest_framework.documentation import include_docs_urls

from .films import views as films_views
from .forums import views as forums_views
from .invites import views as invites_views
from .releases import views as releases_views
from .torrents import views as torrents_views
from .tracker import views as tracker_views
from .users import views as users_views
from .wiki import views as wiki_views
from .private_messages import views as pm_views

swagger_info = openapi.Info(
    title="Streisand API",
    default_version='v1',
    description="""Streisand API Swagger Definition""",  # noqa
    terms_of_service="https://www.something.com/policies/terms/",
    contact=openapi.Contact(email="contact@something.xyz"),
    license=openapi.License(name="MIT License"),
)

SchemaView = get_schema_view(
    validators=['ssv', 'flex'],
    public=True,
    permission_classes=(permissions.IsAuthenticated,),
)

router = routers.DefaultRouter()

# Users
router.register(r'users', viewset=users_views.AdminUserViewSet, base_name='user')
router.register(r'user-profiles', viewset=users_views.PublicUserViewSet, base_name='user-profile')
router.register(r'groups', viewset=users_views.GroupViewSet, base_name='group')

# PMs
router.register(r'conversations', viewset=pm_views.ConversationViewSet, base_name='conversation')

# Invites
router.register(r'invites', viewset=invites_views.InviteViewSet, base_name='invite')

# Films
router.register(r'films', viewset=films_views.FilmViewSet, base_name='film')
router.register(r'film-comments', viewset=films_views.FilmCommentViewSet, base_name='film-comment')

# Film Collections
router.register(r'collection-comments', viewset=films_views.CollectionCommentViewSet, base_name='collection-comment')
router.register(r'film-collections', viewset=films_views.CollectionViewSet, base_name='collection')

# Releases
router.register(r'releases', viewset=releases_views.ReleaseViewSet, base_name='release')
router.register(r'release-comments', viewset=releases_views.ReleaseCommentViewSet, base_name='release-comment')

# Torrents
router.register(r'torrent-files', viewset=torrents_views.TorrentFileViewSet, base_name='torrent-file')
router.register(r'torrents-no-releases', viewset=torrents_views.TorrentFileWithNoReleaseViewSet, base_name='torrent-no-release')
router.register(r'torrent-stats', viewset=torrents_views.TorrentStatsViewSet, base_name='torrent-stat')
router.register(r'torrent-requests', viewset=torrents_views.TorrentRequestViewSet, base_name='torrent-request')
router.register(r'torrent-reseed-requests', viewset=torrents_views.ReseedRequestViewSet, base_name='torrent-reseed-request')

# Tracker
router.register(r'torrent-clients', viewset=tracker_views.TorrentClientViewSet, base_name='torrent-client')
router.register(r'tracker-swarm', viewset=tracker_views.SwarmViewSet, base_name='tracker-swarm')
router.register(r'tracker-peers', viewset=tracker_views.PeerViewSet, base_name='tracker-peer')
router.register(r'announce-requests', viewset=users_views.UserAnnounceViewSet, base_name='user-announce')

# Forum
router.register(r'forum-index', viewset=forums_views.ForumIndexViewSet, base_name='forums')
router.register(r'forum-group-items', viewset=forums_views.ForumGroupItemViewSet, base_name='forum-group-item')
router.register(r'forum-topic-index', viewset=forums_views.ForumTopicIndexViewSet, base_name='forum-topic-index')
router.register(r'forum-topic-items', viewset=forums_views.ForumTopicItemViewSet, base_name='forum-topic-item')
router.register(r'forum-thread-index', viewset=forums_views.ForumThreadIndexViewSet, base_name='forum-thread-index')
router.register(r'forum-thread-items', viewset=forums_views.ForumThreadItemViewSet, base_name='forum-thread-items')
router.register(r'forum-post-items', viewset=forums_views.ForumPostItemViewSet, base_name='forum-post-items')
router.register(r'forum-thread-subscriptions', viewset=forums_views.ForumThreadSubscriptionViewSet, base_name='forum-thread-subscription')
router.register(r'forum-reports', viewset=forums_views.ForumReportViewSet, base_name='forum-report')

# News Posts
router.register(r'news-posts', viewset=forums_views.NewsPostViewSet, base_name='news-post')

# Wiki
router.register(r'wikis', viewset=wiki_views.WikiArticleCreateUpdateDestroyViewSet, base_name='wiki')
router.register(r'wiki-articles', viewset=wiki_views.WikiArticleViewListOnlyViewSet, base_name='wiki-article')
router.register(r'wiki-bodies', viewset=wiki_views.WikiArticleBodyViewSet, base_name='wiki-body')

urlpatterns = [

    # Router URLs
    url(r'^', include(router.urls)),

    # DRF browsable API
    url(r'^session/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', SchemaView.without_ui(cache_timeout=None), name='schema-json'),
    url(r'^swagger/$', SchemaView.with_ui('swagger', cache_timeout=None), name='schema-swagger-ui'),

    # API Core-Schema Docs TODO: Update this when better Api Docs come out and work.
    url(r'^schema/', include_docs_urls(title='streisand API v1', public=False)),

    # Login and user items
    url(r'^current-user/$', users_views.CurrentUserView.as_view()),
    url(r'^login/$', users_views.UserLoginView.as_view()),
    url(r'^change-password/$', users_views.ChangePasswordView.as_view()),

    # Registration
    url(r'^check-invite-key/(?P<pk>[0-9a-f\-]{36})/$', invites_views.InviteCheckViewSet.as_view(), name='invite-key-check'),
    url(r'^check-username/$', users_views.UsernameAvailabilityView.as_view(), name='username-check'),
    url(r'^register-user/$', users_views.UserRegistrationView.as_view(), name='user-registration'),

    # DRF-Knox Authentication
    url(r'^knox/', include('knox.urls')),
    url(r'^logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    url(r'^logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),

    # Media formats
    url(r'^valid-media-formats/', releases_views.valid_media_formats, name='valid-media-formats'),

]
