from graphene_django.types import DjangoObjectType
from .models import User
import graphene
from graphql_extensions.auth.decorators import (
    login_required, staff_member_required,
)
from graphql_extensions import mixins


class UserType(DjangoObjectType):
    class Meta:
        model = User


class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.List(UserType)
    user = graphene.Field(UserType,
                          id=graphene.Int(),
                          username=graphene.String())

    @login_required
    def resolve_viewer(self, info, **kwargs):
        return info.context.user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Unauthorized!!!')

        if id is not None:
            return User.objects.get(pk=id)

        if username is not None:
            return User.objects.get(username=user.username)
        return None


class UpdateUser(mixins.UpdateMixin, graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True)
        username = graphene.String(required=True)

    @classmethod
    def get_queryset(cls, info, **kwargs):
        return info.context.user.users.all()

    @classmethod
    @login_required
    def mutate(cls, root, info, **kwargs):
        user = cls.update(info, **kwargs)
        return cls(user=user)


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=False)

    def mutate(self, info, username, password, email):
        user = User(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
