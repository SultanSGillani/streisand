# -*- coding:utf-8 -*-
from django.test import TestCase
from model_mommy import mommy

from forums.models import ForumGroup, ForumTopic, ForumThread, ForumPost


class ForumTestMommy(TestCase):
    """
    Class to test the Forums, needs way more tests.
    """

    def setUp(self):
        """
        Set up all the tests
        """
        self.group = mommy.make(ForumGroup)
        self.topic = mommy.make(ForumTopic)
        self.thread = mommy.make(ForumThread)
        self.post = mommy.make(ForumPost)

    def test_forum_creation_mommy(self):
        new_group = mommy.make('forums.ForumGroup')
        new_topic = mommy.make('forums.ForumTopic')
        new_thread = mommy.make('forums.ForumThread')
        new_post = mommy.make('forums.ForumPost')

        self.assertTrue(isinstance(new_group, ForumGroup))
        self.assertTrue(isinstance(new_topic, ForumTopic))
        self.assertTrue(isinstance(new_thread, ForumThread))
        self.assertTrue(isinstance(new_post, ForumPost))

        self.assertEqual(new_group.__str__(), new_group.name)
        self.assertEqual(new_topic.__str__(), new_topic.name)
        self.assertEqual(new_thread.__str__(), new_thread.title)
