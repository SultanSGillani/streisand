from users.models import User
# api/tests.py
from django.urls import reverse
# Add these imports at the top
from rest_framework import status
from rest_framework.test import APITestCase

from api.forums.serializers import ForumPostCreateSerializer
from api.users.serializers import AdminUserProfileSerializer
from forums.models import ForumPost
from .base import BaseAPITestCase
from .factories import UserFactory, PostFactory, ThreadFactory
from rest_framework.test import APIClient

# Make all requests in the context of a logged in session.
user = User.objects.get(username='admin')
client = APIClient()
client.force_authenticate(user=None)


class UserAPITest(BaseAPITestCase, APITestCase):
    api_base_name = 'user'
    urls = 'router.urls'
    model = User
    model_factory_class = UserFactory
    serializer_class = AdminUserProfileSerializer


class PostAPITest(BaseAPITestCase, APITestCase):
    api_base_name = 'forum-post'
    urls = 'router.urls'
    model = ForumPost
    model_factory_class = PostFactory
    serializer_class = ForumPostCreateSerializer

    def test_create_models_instance(self):
        modified_by = UserFactory.create()
        thread = ThreadFactory.create()
        ForumPost.objects.create(body='asshat', thread=thread, modified_by=modified_by)


def test_api_can_get_a_post(self):
    """Test the api can get a given a forum post."""
    post = ForumPost.objects.get()
    response = self.client.get(
        reverse('details',
                kwargs={'pk': post.id}), format="json")

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertContains(response, post)


def test_api_can_update_post(self):
    """Test the api can update a given a forum post."""
    post = ForumPost.objects.get()
    change_post = {'body': 'Something new'}
    res = self.client.put(
        reverse('details', kwargs={'pk': post.id}),
        change_post, format='json'
    )
    self.assertEqual(res.status_code, status.HTTP_200_OK)


def test_api_can_delete_post(self):
    """Test the api can delete a a forum post."""
    post = ForumPost.objects.get()
    response = self.client.delete(
        reverse('details', kwargs={'pk': post.id}),
        format='json',
        follow=True)

    self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
