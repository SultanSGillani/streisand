# -*- coding: utf-8 -*-

from django.contrib.auth.decorators import permission_required
from django.db.models import Sum
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.decorators import method_decorator
from django.views.generic import View

from www.utils import paginate

from .forms import TorrentRequestForm, VoteForm
from .models import TorrentRequest


class NewTorrentRequestView(View):

    def get(self, request):

        torrent_request_form = TorrentRequestForm(requester=request.user)
        return self._render(torrent_request_form)

    @method_decorator(permission_required('torrent_requests.can_request', raise_exception=True))
    def post(self, request):

        torrent_request_form = TorrentRequestForm(
            request.POST,
            requester=request.user,
        )

        if torrent_request_form.is_valid():

            # Save the new TorrentRequest object
            new_torrent_request = torrent_request_form.save()
            return redirect(new_torrent_request)

        else:

            # Render the form with errors
            return self._render(torrent_request_form)

    def _render(self, form):
        """
        Render the page with the given form.
        """
        return render(
            request=self.request,
            template_name='new_torrent_request.html',
            context={'form': form},
        )


def torrent_request_index(request):

    all_torrent_requests = TorrentRequest.objects.select_related(
        'created_by',
        'filling_torrent',
        'source_media',
        'resolution',
        'codec',
        'container',
    )

    created_by = request.GET.get('created_by')

    if created_by:
        all_torrent_requests = all_torrent_requests.filter(created_by__username=created_by)

    order_by = request.GET.get('order_by')

    if order_by == 'bounty':
        all_torrent_requests = all_torrent_requests.annotate(
            Sum('votes__bounty_in_bytes')
        ).order_by('-votes__bounty_in_bytes__sum')
    elif order_by == 'created_at':
        all_torrent_requests = all_torrent_requests.order_by('created_at')

    torrent_requests = paginate(
        request=request,
        queryset=all_torrent_requests,
    )

    return render(
        request=request,
        template_name='torrent_request_index.html',
        context={
            'torrent_requests': torrent_requests,
        }
    )


class TorrentRequestView(View):

    def get(self, request, torrent_request_id):

        torrent_request = self._get_torrent_request(torrent_request_id)

        vote_form = VoteForm(
            voter=request.user,
            torrent_request=torrent_request,
        )

        return self._render(torrent_request=torrent_request, vote_form=vote_form)

    @method_decorator(permission_required('torrent_requests.can_vote', raise_exception=True))
    def post(self, request, torrent_request_id):

        torrent_request = self._get_torrent_request(torrent_request_id)

        vote_form = VoteForm(
            request.POST,
            voter=request.user,
            torrent_request=torrent_request,
        )

        if vote_form.is_valid():
            vote_form.save()
            vote_form = VoteForm(
                voter=request.user,
                torrent_request=torrent_request,
            )

        return self._render(torrent_request=torrent_request, vote_form=vote_form)

    @staticmethod
    def _get_torrent_request(torrent_request_id):

        return get_object_or_404(
            TorrentRequest.objects.select_related(
                'created_by',
                'filling_torrent',
                'source_media',
                'resolution',
                'codec',
                'container',
            ),
            id=torrent_request_id,
        )

    def _render(self, torrent_request, vote_form):
        """
        Render the page with the given form.
        """
        return render(
            request=self.request,
            template_name='torrent_request_details.html',
            context={
                'torrent_request': torrent_request,
                'vote_form': vote_form,
            },
        )
