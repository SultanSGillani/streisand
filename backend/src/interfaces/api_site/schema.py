import graphene
import forums.schema
import users.schema

from graphene_django.debug import DjangoDebug


class Query(forums.schema.Query, users.schema.Query, graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='__debug')


class Mutation(forums.schema.Mutation, users.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
