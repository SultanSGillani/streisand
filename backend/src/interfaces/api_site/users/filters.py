from django_filters import rest_framework as filters
from users.models import User, UserClass


class PublicUserFilter(filters.FilterSet):

    class Meta:
        model = User
        fields = {
            'username': ['exact', 'in', 'startswith']
        }


class UserFilter(filters.FilterSet):

    is_staff = filters.BooleanFilter(field_name='is_staff',)

    class Meta:
        model = User
        fields = {
            'username': ['exact', 'in', 'startswith'],
            'user_class__name': ['exact', 'in', 'startswith'],
        }


class UserClassFilter(filters.FilterSet):

    class Meta:
        model = UserClass
        fields = {
            'name': ['exact', 'in', 'startswith'],
            'rank': ['exact', 'in', 'startswith'],
        }
