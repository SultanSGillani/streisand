# -*- coding: utf-8 -*-

from functools import wraps, update_wrapper

from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils.decorators import method_decorator, available_attrs
from django.views.generic import View


def https_required(view_func):
    """
    Decorator for views that checks that the request uses SSL/TLS,
    redirecting to the HTTPS version if necessary.
    """

    @wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        if request.is_secure() or settings.DEBUG:
            return view_func(request, *args, **kwargs)
        else:
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace('http://', 'https://')
            return HttpResponseRedirect(secure_url)
    return _wrapped_view


def class_based_view_decorator(decorator):
    """
    Converts a function decorator into a class-based view decorator.

    Converts the function decorator into a method decorator, then
    applies that method decorator to the view's dispatch method.
    """
    def _dec(cls):
        assert (isinstance(cls, type) and issubclass(cls, View)), (
            "Only subclasses of django.views.generic.View may use this decorator."
        )
        _method_decorator = method_decorator(decorator)
        cls.dispatch = _method_decorator(cls.dispatch)
        return cls

    update_wrapper(_dec, decorator, assigned=available_attrs(decorator))
    return _dec
