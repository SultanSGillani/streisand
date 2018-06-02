# -*- coding: utf-8 -*-

from positions import PositionField

from django.db import models
from django.db.models import F
from django.urls import reverse

from .managers import ForumGroupQuerySet, ForumTopicQuerySet, ForumThreadQuerySet, ForumPostQuerySet


class ForumGroup(models.Model):
    old_id = models.PositiveIntegerField(null=True, db_index=True)
    parent = models.ForeignKey('self', blank=True, null=True, on_delete=models.SET_NULL)
    sort_order = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=256)
    objects = ForumGroupQuerySet.as_manager()

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return '{name}'.format(name=self.name)

    @property
    def topics(self):
        return ForumTopic.objects.filter(group__id=self.id)

    @property
    def threads(self):
        return ForumThread.objects.filter(topic__id=self.id)

    @property
    def thread_count(self):
        return self.threads.count()

    @property
    def topics_count(self):
        return self.topics.count()

    @property
    def is_group(self):
        if self.parent_id:
            return True
        else:
            return False


class ForumTopic(models.Model):
    old_id = models.PositiveIntegerField(null=True, db_index=True)
    creator = models.ForeignKey(
        to='users.User',
        related_name='topic_author',
        null=True,
        on_delete=models.SET_NULL,
    )
    sort_order = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024)
    group = models.ForeignKey(
        to='forums.ForumGroup',
        related_name='topics',
        null=False,
        on_delete=models.PROTECT,
    )
    minimum_user_class = models.ForeignKey(
        to='users.UserClass',
        related_name='unlocked_forum_topics',
        null=True,
        on_delete=models.SET_NULL,
    )

    staff_only_thread_creation = models.BooleanField(default=False)
    number_of_threads = models.PositiveIntegerField(default=0)
    number_of_posts = models.PositiveIntegerField(default=0)
    latest_post = models.OneToOneField(
        to='forums.ForumPost',
        related_name='topic_latest',
        null=True,
        on_delete=models.SET_NULL,
    )

    objects = ForumTopicQuerySet.as_manager()

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return '{name}'.format(name=self.name)

    def get_absolute_url(self):
        return reverse(
            viewname='forum_topic_details',
            kwargs={
                'topic_id': self.id,
            }
        )

    @property
    def posts(self):
        return ForumPost.objects.filter(thread__id=self.id)

    @property
    def post_count(self):
        return self.posts.count()


class ForumThread(models.Model):
    old_id = models.PositiveIntegerField(null=True, db_index=True)

    title = models.CharField(max_length=1024)
    is_locked = models.BooleanField(default=False)
    is_sticky = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        to='users.User',
        related_name='forum_threads_created',
        null=True,
        on_delete=models.SET_NULL,
    )
    modified = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now=True, null=True)
    modified_count = models.PositiveIntegerField(default=0, editable=False)
    modified_by = models.ForeignKey(
        to='users.User',
        related_name='modified_threads',
        null=True,
        on_delete=models.SET_NULL,
    )
    topic = models.ForeignKey(
        to='forums.ForumTopic',
        related_name='threads',
        null=False,
        on_delete=models.CASCADE,
    )
    number_of_posts = models.PositiveIntegerField(default=0, editable=False)
    latest_post = models.OneToOneField(
        to='forums.ForumPost',
        related_name='thread_latest',
        null=True,
        on_delete=models.SET_NULL,
    )
    subscribed_users = models.ManyToManyField(
        to='users.User',
        through='forums.ForumThreadSubscription',
        related_name='forum_threads_subscribed',
    )

    objects = ForumThreadQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return '{title}'.format(title=self.title)

    def get_absolute_url(self):
        return reverse(
            viewname='forum_thread_details',
            kwargs={
                'thread_id': self.id,
            }
        )

    @property
    def count(self):
        return self.count()

    def save(self, *args, **kwargs):
        if self.pk:
            if self.modified:
                self.modified_count = F('modified_count') + 1

        super(ForumThread, self).save(*args, **kwargs)

        if self.pk:
            # As we use F expression, its not possible to know modified_count until refresh from db
            self.refresh_from_db()


class ForumPost(models.Model):
    old_id = models.PositiveIntegerField(null=True, db_index=True)

    author = models.ForeignKey(
        to='users.User',
        related_name='forum_posts',
        null=True,
        on_delete=models.PROTECT,
    )
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now=True, null=True, editable=False)
    modified_count = models.PositiveIntegerField(default=0, editable=False)
    modified_by = models.ForeignKey(
        to='users.User',
        related_name='modified_posts',
        null=True,
        on_delete=models.SET_NULL,
        editable=False,
    )
    thread = models.ForeignKey(
        to='forums.ForumThread',
        related_name='posts',
        on_delete=models.CASCADE,
    )
    position = PositionField(collection='thread', editable=False)
    objects = ForumPostQuerySet.as_manager()

    class Meta:
        ordering = ['created_at']
        get_latest_by = ['created_at']

    def __str__(self):
        return 'Forum post by {author} in thread {thread}'.format(
            author=self.author,
            thread=self.thread,
        )

    def get_absolute_url(self):
        return '{thread_url}#{post_id}'.format(
            thread_url=self.thread.get_absolute_url(),
            post_id=self.id,
        )

    def save(self, *args, **kwargs):
        if self.pk:
            if self.modified:
                self.modified_count = F('modified_count') + 1

        super(ForumPost, self).save(*args, **kwargs)

        if self.pk:
            # As we use F expression, its not possible to know modified_count until refresh from db
            self.refresh_from_db()


class ForumReport(models.Model):
    reporting_user = models.ForeignKey(
        to='users.User',
        related_name='reports',
        null=True,
        on_delete=models.PROTECT,
    )
    reported_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(max_length=1024, blank=False, null=False)
    thread = models.ForeignKey(
        ForumThread, blank=True, null=True, default=None, on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        ForumPost, blank=True, null=True, default=None, on_delete=models.CASCADE
    )
    resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        to='users.User',
        related_name='report_resolved',
        null=True,
        on_delete=models.PROTECT,
    )
    date_resolved = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ('-reported_at',)

    def __str__(self):
        return 'Report by {reporting_user} in thread {thread}'.format(
            reporting_user=self.reporting_user,
            thread=self.thread,
        )

    def get_absolute_url(self):
        return '{thread_url}#{report_id}'.format(
            thread_url=self.thread.get_absolute_url(),
            report_id=self.id,
        )


class ForumThreadSubscription(models.Model):
    user = models.ForeignKey(
        to='users.User',
        related_name='forum_thread_subscriptions',
        on_delete=models.CASCADE,
    )
    thread = models.ForeignKey(
        to='forums.ForumThread',
        related_name='subscriptions',
        on_delete=models.CASCADE,
    )
