# -*- coding: utf-8 -*-

from ratelimit.decorators import ratelimit

from django.contrib.auth import REDIRECT_FIELD_NAME, login as auth_login
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.http import is_safe_url
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters

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
