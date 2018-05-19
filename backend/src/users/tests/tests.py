# -*- coding:utf-8 -*-
from django.test import TestCase
from model_mommy import mommy

from users.models import User, UserClass


class UserTestMommy(TestCase):
    """
    Class to test the model
    User
    """

    def setUp(self):
        """
        Set up all the tests
        """
        self.user = mommy.make(User)
        self.user_class = mommy.make(UserClass)

    def test_user_creation_mommy(self):
        new_user = mommy.make('users.User')
        new_user_class = mommy.make('users.UserClass')
        self.assertTrue(isinstance(new_user, User))
        self.assertTrue(isinstance(new_user_class, UserClass))

        self.assertEqual(new_user.__str__(), new_user.username)
        self.assertEqual(new_user_class.__str__(), new_user_class.name)
