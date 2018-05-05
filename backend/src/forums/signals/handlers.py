# -*- coding: utf-8 -*-

from django.db.models import F
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from forums.models import ForumPost


@receiver(post_save, sender='forums.ForumThread')
def handle_new_forum_thread(**kwargs):

    if kwargs['created']:

        thread = kwargs['instance']
        topic = thread.topic

        topic.number_of_threads = F('number_of_threads') + 1
        topic.save()


@receiver(post_delete, sender='forums.ForumThread')
def handle_deleted_forum_thread(**kwargs):

    thread = kwargs['instance']
    topic = thread.topic

    topic.number_of_threads = F('number_of_threads') - 1
    topic.save()


@receiver(post_save, sender='forums.ForumPost')
def handle_new_forum_post(**kwargs):

    if kwargs['created']:

        post = kwargs['instance']
        thread = post.thread
        topic = thread.topic

        thread.number_of_posts = F('number_of_posts') + 1
        topic.number_of_posts = F('number_of_posts') + 1
        thread.latest_post = post
        topic.latest_post = post
        thread.save()
        topic.save()


@receiver(post_delete, sender='forums.ForumPost')
def handle_deleted_forum_post(**kwargs):

    post = kwargs['instance']
    thread = post.thread
    topic = thread.topic

    thread.number_of_posts = F('number_of_posts') - 1
    topic.number_of_posts = F('number_of_posts') - 1
    try:
        thread.latest_post = ForumPost.objects.filter(thread=thread).latest()
    except ForumPost.DoesNotExist:
        thread.latest_post = None
    try:
        topic.latest_post = ForumPost.objects.filter(thread__topic=topic).latest()
    except ForumPost.DoesNotExist:
        topic.latest_post = None
    thread.save()
    topic.save()
