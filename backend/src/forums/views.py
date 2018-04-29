# -*- coding: utf-8 -*-

from collections import OrderedDict
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import View
from www.utils import paginate
from .forms import ForumPostForm
from .models import ForumTopic, ForumThread, ForumPost


def forum_index(request):

    forum_topics = ForumTopic.objects.accessible_to_user(request.user).select_related(
        'group',
    ).order_by(
        'group__sort_order',
        'sort_order',
    )

    forum_groups = OrderedDict()
    for topic in forum_topics:
        group_name = topic.group.name
        if group_name in forum_groups:
            forum_groups[group_name].append(topic)
        else:
            forum_groups[group_name] = [topic]

    return render(
        request=request,
        template_name='forum_index.html',
        context={
            'forum_groups': forum_groups,
        }
    )


def forum_topic_details(request, topic_id):

    topic = get_object_or_404(
        ForumTopic.objects.accessible_to_user(request.user),
        id=topic_id,
    )

    threads = paginate(
        request=request,
        queryset=topic.threads.select_related('created_by'),
        items_per_page=25,
    )

    return render(
        request=request,
        template_name='forum_topic_details.html',
        context={
            'topic': topic,
            'threads': threads,
        }
    )


def forum_post_delete(request, post_id):

    post = get_object_or_404(
        ForumPost,
        id=post_id
    )

    thread = post.thread

    post.delete()

    return redirect(thread)


class ForumThreadView(View):

    def dispatch(self, request, *args, **kwargs):

        self.thread = get_object_or_404(
            ForumThread.objects.accessible_to_user(request.user),
            id=kwargs.pop('thread_id'),
        )

        self.posts = paginate(
            request=request,
            queryset=self.thread.posts.select_related('author'),
            items_per_page=25,
        )

        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):

        form = ForumPostForm(
            thread=self.thread,
            author=request.user,
        )

        return self._render(
            thread=self.thread,
            posts=self.posts,
            form=form,
        )

    def post(self, request):

        form = ForumPostForm(
            request.POST,
            thread=self.thread,
            author=request.user,
        )

        if form.is_valid():

            forum_post = form.save()
            return redirect(forum_post)

        else:

            return self._render(
                thread=self.thread,
                posts=self.posts,
                form=form,
            )

    def _render(self, thread, posts, form):
        return render(
            request=self.request,
            template_name='forum_thread_details.html',
            context={
                'thread': thread,
                'posts': posts,
                'form': form,
            },
        )
