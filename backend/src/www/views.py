# -*- coding: utf-8 -*-

import json
import logging

from ratelimit.decorators import ratelimit

from django.contrib.auth import REDIRECT_FIELD_NAME, authenticate, login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.http import is_safe_url
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import View

from films.models import Film, Collection
from torrents.models import Torrent
from users.models import User
from www.models import Feature

from .forms import RegistrationForm
from .signals.signals import successful_login, failed_login


def home(request):

    return render(
        request=request,
        template_name='index.html',
    )


@ratelimit(key='ip', rate='6/2h', method='POST', group='login')
@sensitive_post_parameters()
@csrf_protect
@never_cache
def login(request):
    """
    Displays the login form and handles the login action.
    """
    redirect_to = request.POST.get(REDIRECT_FIELD_NAME,
                                   request.GET.get(REDIRECT_FIELD_NAME, ''))

    if request.method == 'POST' and not request.limited:

        form = AuthenticationForm(request, data=request.POST)
        ip_address = request.META['REMOTE_ADDR']

        if form.is_valid():

            if request.user.is_authenticated:
                # this user might have more than one account
                # check if request.user.username == form.username
                # maybe they're logging in on a friend's computer
                pass

            # Ensure the user-originating redirection url is safe.
            if not is_safe_url(url=redirect_to, host=request.get_host()):
                redirect_to = '/'

            # Okay, security check complete. Log the user in.
            auth_login(request, form.get_user())

            # Signal a successful login attempt
            successful_login.send(
                sender=login,
                user=form.get_user(),
                ip_address=ip_address,
            )

            return HttpResponseRedirect(redirect_to)

        else:

            # Signal a failed login attempt
            failed_login.send(
                sender=login,
                username=form.cleaned_data.get('username'),
                ip_address=ip_address,
            )

    else:

        form = AuthenticationForm(request)

    return render(
        request=request,
        template_name='login.html',
        context={
            'form': form,
            REDIRECT_FIELD_NAME: redirect_to,
        }
    )


class RegistrationView(View):

    def dispatch(self, request, *args, **kwargs):

        if not Feature.objects.is_enabled('open_registration'):
            raise Http404

        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return self.render_form(RegistrationForm())

    def post(self, request):

        form = RegistrationForm(request.POST)

        if form.is_valid():

            # Flag potential dupers
            self.log_potential_dupers(request, form)

            form.save()

            # Authenticate the newly registered user
            new_authenticated_user = authenticate(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
            )
            auth_login(request, new_authenticated_user)
            return redirect('home')

        else:

            return self.render_form(form)

    @staticmethod
    def log_potential_dupers(request, form):

        if request.user.is_authenticated:
            log = logging.getLogger('streisand.security')
            log.warning(
                'New user "{new_user}" registered while logged in as '
                'existing user "{existing_user}".'.format(
                    new_user=form.cleaned_data['username'],
                    existing_user=request.user.username,
                )
            )

    def render_form(self, form):
        return render(
            request=self.request,
            template_name='register.html',
            context={'form': form},
        )


class LegacyURLView(View):
    """
    This view provides support for old URLs so users have time to
    update their bookmarks.

    Each section of the old site has its own method, which will
    return a permanent redirect to the equivalent part of the new site.
    """

    def get(self, request, section):
        if hasattr(self, section):
            return getattr(self, section)(request)
        else:
            return redirect('home')

    def forums(self, request):
        pass

    def inbox(self, request):
        pass

    def peoples(self, request):
        pass

    def queue(self, request):

        if 'user' in request.GET:
            user = get_object_or_404(User, old_id=request.GET['user'])
        else:
            user = request.user
        return redirect(user.watch_queue)

    def requests(self, request):
        pass

    def reseed(self, request):
        pass

    def rules(self, request):
        pass

    def staffpm(self, request):
        pass

    def top10(self, request):
        pass

    def torrents(self, request):

        if 'id' not in request.GET:
            return redirect('film_index')

        # Torrents
        if 'torrentid' in request.GET:
            try:
                torrent = Torrent.objects.get(old_id=request.GET['torrentid'])
            except Torrent.DoesNotExist:
                pass
            else:
                return redirect(torrent)

        # Collection
        elif 'montage' in request.GET:
            get_object_or_404(Collection, old_id=request.GET['montage'])

        # Films
        film = get_object_or_404(Film, old_id=request.GET['id'])
        return redirect(film)

    def user(self, request):

        if 'id' not in request.GET:
            return redirect('profile_index')

        # Users
        user = get_object_or_404(User, old_id=request.GET['id'])
        return redirect(user)

    def wiki(self, request):
        pass


def template_viewer(request, template_path):
    return render(request, template_path, json.loads(request.GET.get('context', '{}')))
