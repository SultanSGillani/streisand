# -*- coding: utf-8 -*-

from django import forms

from .models import ForumPost


class ForumPostForm(forms.ModelForm):
    """
    A form that creates a new forum post.
    """

    BLACKLIST = {
        'fight club',
    }

    body = forms.TextInput()

    class Meta:
        model = ForumPost
        fields = (
            'body',
        )

    def __init__(self, *args, **kwargs):
        author = kwargs.pop('author')
        thread = kwargs.pop('thread')
        super().__init__(*args, **kwargs)
        self.instance.author = author
        self.instance.thread = thread

    def clean_body(self):
        body = self.cleaned_data['body']
        for word in self.BLACKLIST:
            if word in body:
                raise forms.ValidationError(
                    message="Don't talk about {word}".format(word=word),
                    code='blacklist_error',
                )
        return body
