import graphene
from graphene_django.types import DjangoObjectType
from graphene_django.debug import DjangoDebug
from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost
from users.schema import UserType


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


class Query(graphene.ObjectType):
    all_groups = graphene.List(ForumGroupType)
    group = graphene.Field(ForumGroupType,
                           id=graphene.Int(),
                           name=graphene.String())

    all_topics = graphene.List(ForumTopicType)
    topic = graphene.Field(ForumTopicType,
                           id=graphene.Int(),
                           name=graphene.String())

    all_threads = graphene.List(ForumThreadType)
    thread = graphene.Field(ForumThreadType,
                            id=graphene.Int(),
                            title=graphene.String())

    all_posts = graphene.List(ForumPostType)
    post = graphene.Field(ForumPostType, id=graphene.Int())

    debug = graphene.Field(DjangoDebug, name='__debug')

    def resolve_all_groups(self, info, **kwargs):
        return ForumGroup.objects.all()

    def resolve_group(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')

        if id is not None:
            return ForumGroup.objects.get(pk=id)

        if name is not None:
            return ForumGroup.objects.get(name=name)

        return None

    def resolve_all_topics(self, info, **kwargs):
        return ForumTopic.objects.select_related('group').all()

    def resolve_topic(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')

        if id is not None:
            return ForumTopic.objects.get(pk=id)

        if name is not None:
            return ForumTopic.objects.get(name=name)

        return None

    def resolve_all_threads(self, info, **kwargs):
        return ForumThread.objects.select_related('topic').all()

    def resolve_thread(self, info, **kwargs):
        id = kwargs.get('id')
        title = kwargs.get('title')

        if id is not None:
            return ForumThread.objects.get(pk=id)

        if title is not None:
            return ForumThread.objects.get(title=title)

        return None

    def resolve_all_posts(self, info, **kwargs):
        return ForumPost.objects.select_related('thread').all()

    def resolve_post(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return ForumPost.objects.get(pk=id)
        return None


class CreateGroup(graphene.Mutation):
    id = graphene.Int()
    sort_order = graphene.Int()
    name = graphene.String()

    class Arguments:
        name = graphene.String()
        description = graphene.String()

    def mutate(self, info, name, sort_order):
        user = info.context.user or None

        group = ForumGroup(
            name=name,
            sort_order=sort_order,
            user=user,
        )

        group.save()

        return CreateGroup(
            id=group.id,
            name=group.name,
            sort_order=group.sort_order,
        )


class CreateTopic(graphene.Mutation):
    id = graphene.Int()
    sort_order = graphene.Int()
    name = graphene.String()
    description = graphene.String()
    creator = graphene.Field(UserType)

    class Arguments:
        name = graphene.String()
        sort_order = graphene.Int()
        description = graphene.String()

    def mutate(self, info, name, sort_order, description):
        user = info.context.user or None

        topic = ForumTopic(
            name=name,
            sort_order=sort_order,
            description=description,
            creator=user,
        )

        topic.save()

        return CreateTopic(
            id=topic.id,
            name=topic.name,
            sort_order=topic.sort_order,
            description=topic.description,
            creator=topic.creator,
        )


class Mutation(graphene.ObjectType):
    create_group = CreateGroup.Field()
    create_topic = CreateTopic.Field()
