# -*- coding: utf-8 -*-

from django import forms

from users.models import User


class RegistrationForm(forms.ModelForm):
    """
    A form that creates a new user from the given username and password.
    """

    error_strings = {
        'duplicate_username': "A user with that username already exists.",
        'password_mismatch': "The two password fields did not match.",
    }

    username = forms.RegexField(
        label="Username",
        max_length=30,
        regex=r'^[\w.@+-]+$',
        help_text="Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.",
        error_messages={
            'invalid': "This value may contain only letters, numbers and @/./+/-/_ characters."
        }
    )
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput,
        help_text="Enter the same password as above, for verification.",
    )

    class Meta:
        model = User
        fields = (
            'username',
        )

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError(
                self.error_strings['duplicate_username'],
                code='duplicate_username',
            )
        else:
            return username

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_strings['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user
