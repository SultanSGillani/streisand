# -*- coding: utf-8 -*-

from django.conf.urls import url, include
from rest_framework import routers, permissions

from .invites import views as invites_views
from .films import views as films_views
from .torrents import views as torrents_views
from .tracker import views as tracker_views
from .users import views as users_views
from .forums import views as forums_views
from .wiki import views as wiki_views
from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from graphene_django.views import GraphQLView


schema_view = get_schema_view(

    openapi.Info(
        title="Streisand API",
        default_version='v1',
        description="Open Api Schema",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@ronzertnert.me"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


router = routers.DefaultRouter()

# Users
router.register(r'users', viewset=users_views.AdminUserViewSet, base_name='user')
router.register(r'user-profiles', viewset=users_views.PublicUserProfileViewSet, base_name='user-profile')
router.register(r'groups', viewset=users_views.GroupViewSet, base_name='group')

# Invites
router.register(r'invites', viewset=invites_views.InviteViewSet, base_name='invite')

# Films
router.register(r'films', viewset=films_views.FilmViewSet, base_name='film')
router.register(r'film-comments', viewset=films_views.FilmCommentViewSet, base_name='film-comment')
router.register(r'collections', viewset=films_views.CollectionViewSet, base_name='collection')
router.register(r'collection-comments', viewset=films_views.CollectionCommentViewSet, base_name='collection-comment')

# Torrents
router.register(r'torrents', viewset=torrents_views.TorrentViewSet, base_name='torrent')
router.register(r'torrent-comments', viewset=torrents_views.TorrentCommentViewset, base_name='torrent-comment')

# Tracker
router.register(r'torrent-clients', viewset=tracker_views.TorrentClientViewSet, base_name='torrent-client')
router.register(r'tracker-swarm', viewset=tracker_views.SwarmViewSet, base_name='tracker-swarm')
router.register(r'tracker-peers', viewset=tracker_views.PeerViewSet, base_name='tracker-peer')

# Forum
router.register(r'forum-groups', viewset=forums_views.ForumGroupViewSet, base_name='forum-group')
router.register(r'forum-topics', viewset=forums_views.ForumTopicViewSet, base_name='forum-topic')
router.register(r'forum-thread-index', viewset=forums_views.ForumThreadIndexViewSet, base_name='forum-thread-index')
router.register(r'forum-threads', viewset=forums_views.ForumThreadWithAllPostsViewSet, base_name='forum-thread')
router.register(r'forum-thread-items', viewset=forums_views.ForumThreadItemViewSet, base_name='forum-thread-item')
router.register(r'forum-thread-subscriptions', viewset=forums_views.ForumThreadSubscriptionViewSet,
                base_name='forum-thread-subscription')
router.register(r'forum-posts', viewset=forums_views.ForumPostViewSet, base_name='forum-post')
router.register(r'news-posts', viewset=forums_views.NewsPostViewSet, base_name='news-post')

# Wiki
router.register(r'wikis', viewset=wiki_views.WikiArticleCreateUpdateDestroyViewSet, base_name='wiki')
router.register(r'wiki-articles', viewset=wiki_views.WikiArticleViewListOnlyViewSet, base_name='wiki-article')
router.register(r'wiki-bodies', viewset=wiki_views.WikiArticleBodyViewSet, base_name='wiki-body')

urlpatterns = [

    # Router URLs
    url(r'^', include(router.urls)),

    # DRF browsable API
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=None), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=None), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    url(r'^login/', users_views.UserLoginView.as_view()),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),
    url(r'^register/$', users_views.UserRegisterView.as_view()),
    url(r'^current-user/', users_views.CurrentUserView.as_view()),
    url(r'^change-password/', users_views.ChangePasswordView.as_view()),
    url(r'^graphql', GraphQLView.as_view(graphiql=True)),

]
