# -*- coding: utf-8 -*-

from django import forms

from .models import WikiArticle


class WikiArticleForm(forms.ModelForm):

    body = forms.TextInput()

    class Meta:
        model = WikiArticle
        fields = (
            'title',
            'body',
        )

    def __init__(self, *args, **kwargs):
        author = kwargs.pop('author')
        super().__init__(*args, **kwargs)
        self.instance.modified_by = author
