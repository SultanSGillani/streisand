import datetime

import factory
from factory import fuzzy, PostGenerationMethodCall, lazy_attribute, SubFactory
from factory.django import DjangoModelFactory

from forums.models import ForumPost, ForumThread, ForumTopic, ForumGroup
from forums.signals import handlers
from users.models import User


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = fuzzy.FuzzyText()
    first_name = fuzzy.FuzzyText()
    last_name = fuzzy.FuzzyText()
    password = PostGenerationMethodCall('set_password', 'changeM3')
    is_active = True
    is_staff = True
    is_superuser = True
    is_banned = False
    account_status = 'enabled'

    @lazy_attribute
    def email(self):
        return '{}@example.com'.format(self.username)


def get_admin(username=None):
    from django.contrib.auth import get_user_model

    kwargs = {
        'is_superuser': True,
        'is_staff': True
    }

    if username is not None:
        kwargs['username'] = username

    users = get_user_model().objects.filter(**kwargs)
    if users.count() > 0:
        return users[0]

    rv = UserFactory(**kwargs)
    rv.save()

    return rv


@factory.django.mute_signals(handlers.post_save, handlers.post_delete)
class FooFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ForumPost


# factories.py

class GroupFactory(DjangoModelFactory):
    class Meta:
        model = ForumGroup

    sort_order = fuzzy.FuzzyInteger(0, 3)


class TopicFactory(DjangoModelFactory):
    class Meta:
        model = ForumTopic
        django_get_or_create = ('group',)

    group = factory.SubFactory(GroupFactory)

    sort_order = fuzzy.FuzzyInteger(0, 3)


class ThreadFactory(DjangoModelFactory):
    class Meta:
        model = ForumThread
        django_get_or_create = ('topic',)

    topic = factory.SubFactory(TopicFactory)


class PostFactory(DjangoModelFactory):
    class Meta:
        model = ForumPost
        django_get_or_create = ('thread', 'author')

    thread = factory.SubFactory(ThreadFactory)

    body = fuzzy.FuzzyText()
    author = SubFactory(UserFactory)
    created_at = factory.LazyFunction(datetime.datetime.now)
    modified = False


def make_chain():
    with factory.django.mute_signals(handlers.post_save, handlers.post_delete):
        # pre_save/post_save won't be called here.
        return PostFactory(),
