# -*- coding: utf-8 -*-

from django.core.cache import cache
from django.urls import reverse

from django_dynamic_fixture import G
from rest_framework import status
from rest_framework.test import APITestCase

from invites.models import Invite
from users.models import User


class UserTests(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.existing_user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@example.com',
        )
        cls.registration_url = reverse('user-registration')

    def setUp(self):
        self.invite = G(Invite, offered_by=self.existing_user)

    def tearDown(self):
        # Clear the cache so we don't get throttled
        cache.clear()

    def registration_request(self, data):
        return self.client.post(path=self.registration_url, data=data, format='json')

    def test_create_user_with_no_password(self):
        data = {
            'username': 'foobar',
            'email': 'foobarbaz@example.com',
            'password': '',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_create_user_with_too_long_username(self):
        data = {
            'username': 'foo' * 30,
            'email': 'foobarbaz@example.com',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_no_username(self):
        data = {
            'username': '',
            'email': 'foobarbaz@example.com',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_preexisting_username(self):
        data = {
            'username': 'testuser',
            'email': 'user@example.com',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_preexisting_email(self):
        data = {
            'username': 'testuser2',
            'email': 'test@example.com',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_with_invalid_email(self):
        data = {
            'username': 'foobarbaz',
            'email': 'testing',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_with_no_email(self):
        data = {
            'username': 'foobar',
            'email': '',
            'password': 'testpassword',
            'inviteKey': self.invite.key,
        }
        response = self.registration_request(data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
