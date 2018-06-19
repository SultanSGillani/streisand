# -*- coding: utf-8 -*-

import re

from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator, EmailValidator as DjangoEmailValidator
from django.utils.deconstruct import deconstructible


@deconstructible
class UsernameValidator(RegexValidator):
    regex = r'^[\w.-]+$'
    message = "Enter a valid username. This value may contain only ASCII letters, numbers, and ./-/_ characters."
    flags = re.ASCII


@deconstructible
class EmailValidator(DjangoEmailValidator):

    user_regex = re.compile(r"^\w+(\.?[-\w]+)*$", re.IGNORECASE | re.ASCII)
    message = "Enter a valid email address.  The user identifier may contain only ASCII letters, numbers, and ./-/_ characters."

    def __call__(self, value):

        if not value or '@' not in value:
            self._fail()

        user_part, domain_part = value.strip().rsplit('@', 1)

        if not self.user_regex.match(user_part):
            self._fail()

        if not self.validate_domain_part(domain_part):
            self._fail()

    def _fail(self):
        raise ValidationError(self.message, code=self.code)
