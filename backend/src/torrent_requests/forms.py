# -*- coding: utf-8 -*-

from django.forms import ModelForm, ValidationError

from .models import TorrentRequest, Vote


class TorrentRequestForm(ModelForm):

    class Meta:
        model = TorrentRequest
        fields = (
            'film_title',
            'film_year',
            'imdb',
            'description',
            'is_source',
            'source_media',
            'resolution',
            'codec',
            'container',
        )

    def __init__(self, *args, **kwargs):
        requester = kwargs.pop('requester')
        super().__init__(*args, **kwargs)
        self.instance.created_by = requester


class VoteForm(ModelForm):

    class Meta:
        model = Vote
        fields = (
            'bounty_in_bytes',
        )

    def __init__(self, *args, **kwargs):
        voter = kwargs.pop('voter')
        torrent_request = kwargs.pop('torrent_request')
        super().__init__(*args, **kwargs)
        self.instance.author = voter
        self.instance.torrent_request = torrent_request

    def clean(self):
        if Vote.objects.filter(author=self.instance.author, torrent_request=self.instance.torrent_request).exists():
            raise ValidationError("You may not vote more than once.")
