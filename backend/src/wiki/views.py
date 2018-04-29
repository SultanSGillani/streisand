# -*- coding: utf-8 -*-

from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import View
from .forms import WikiArticleForm
from .models import WikiArticle


def wiki_index(request):
    wiki_articles = WikiArticle.objects.all()

    return render(
        request=request,
        template_name='wiki_index.html',
        context={
            'wiki_articles': wiki_articles,
        },
    )


def wiki_article_details(request, wiki_article_id):
    article = get_object_or_404(
        WikiArticle.objects.accessible_to_user(request.user),
        id=wiki_article_id,
    )

    return render(
        request=request,
        template_name='wiki_article_details.html',
        context={
            'article': article,
        }
    )


class WikiArticleEditView(View):

    def dispatch(self, request, *args, **kwargs):

        self.article = get_object_or_404(
            WikiArticle.objects.editable_by_user(request.user),
            id=kwargs.pop('wiki_article_id'),
        )

        return super().dispatch(request, *args, **kwargs)

    def get(self, request):

        form = WikiArticleForm(instance=self.article, author=request.user)

        return self._render(
            context={
                'new': False,
                'form': form,
            },
        )

    def post(self, request):

        form = WikiArticleForm(instance=self.article, data=request.POST, author=request.user)

        if form.is_valid():

            article = form.save()
            return redirect(article)

        else:

            return self._render(
                context={
                    'new': False,
                    'form': form,
                }
            )

    def _render(self, context):

        return render(
            request=self.request,
            template_name='wiki_article_edit.html',
            context=context,
        )


class WikiArticleCreationView(View):

    def get(self, request):

        form = WikiArticleForm(author=request.user)

        return render(
            request=request,
            template_name='wiki_article_edit.html',
            context={
                'new': True,
                'form': form,
            }
        )

    def post(self, request):

        form = WikiArticleForm(request.POST, author=request.user)

        if form.is_valid():

            article = form.save()
            return redirect(article)

        else:

            return render(
                request=request,
                template_name='wiki_article_edit.html',
                context={
                    'new': True,
                    'form': form,
                }
            )


def wiki_article_delete(request, wiki_article_id):
    article = get_object_or_404(
        WikiArticle,
        id=wiki_article_id,
    )

    article.delete()

    return redirect('wiki_index')
