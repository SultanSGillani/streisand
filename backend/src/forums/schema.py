import graphene
from graphene_django.types import DjangoObjectType
from graphene_django.debug import DjangoDebug
from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost


class ForumGroupType(DjangoObjectType):
    class Meta:
        model = ForumGroup


class ForumTopicType(DjangoObjectType):
    class Meta:
        model = ForumTopic


class ForumThreadType(DjangoObjectType):
    class Meta:
        model = ForumThread


class ForumPostType(DjangoObjectType):
    class Meta:
        model = ForumPost


class Query(object):
    all_groups = graphene.List(ForumGroupType)
    group = graphene.Field(ForumGroupType, id=graphene.Int())
    all_topics = graphene.List(ForumTopicType)
    topic = graphene.Field(ForumTopicType, id=graphene.Int())
    all_threads = graphene.List(ForumThreadType)
    thread = graphene.Field(ForumThreadType, id=graphene.Int())
    all_posts = graphene.List(ForumPostType)
    post = graphene.Field(ForumPostType, id=graphene.Int())

    debug = graphene.Field(DjangoDebug, name='__debug')

    def resolve_all_groups(self, info, **kwargs):
        return ForumGroup.objects.all()

    def resolve_group(self, args, context, info):
        id = args.get('id')
        if id is not None:
            return ForumGroup.objects.get(pk=id)
        return None

    def resolve_all_topics(self, info, **kwargs):
        return ForumTopic.objects.all()

    def resolve_topic(self, args, context, info):
        id = args.get('id')
        if id is not None:
            return ForumTopic.objects.get(pk=id)
        return None

    def resolve_all_threads(self, info, **kwargs):
        return ForumThread.objects.all()

    def resolve_thread(self, args, context, info):
        id = args.get('id')
        if id is not None:
            return ForumThread.objects.get(pk=id)
        return None

    def resolve_all_posts(self, info, **kwargs):
        return ForumPost.objects.all()

    def resolve_post(self, args, context, info):
        id = args.get('id')
        if id is not None:
            return ForumPost.objects.get(pk=id)
        return None
