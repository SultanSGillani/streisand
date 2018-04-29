from django.shortcuts import render, get_object_or_404
from www.utils import paginate
from .models import User


def user_profile_index(request):

    users = paginate(
        request=request,
        queryset=User.objects.filter(account_status='enabled'),
    )

    return render(
        request=request,
        template_name='user_profile_index.html',
        context={
            'users': users,
        }
    )


def user_profile_details(request, username):

    user = get_object_or_404(
        User.objects.all(),
        username__iexact=username,
    )

    return render(
        request=request,
        template_name='user_profile_details.html',
        context={
            'user': user,
        },
    )
