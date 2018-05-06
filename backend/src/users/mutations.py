import graphene
from graphene_django_extras import DjangoSerializerMutation

from interfaces.api_site.users.serializers import AdminUserProfileSerializer
from .schema import UserInputType, UserType


class UserSerializerMutation(DjangoSerializerMutation):
    """
        DjangoSerializerMutation auto implement Create, Delete and Update functions
    """
    class Meta:
        description = " DRF serializer based Mutation for Users "
        serializer_class = AdminUserProfileSerializer


