import graphene
import forums.schema

from graphene_django.debug import DjangoDebug


class Query(forums.schema.Query, graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='__debug')


schema = graphene.Schema(query=Query)
