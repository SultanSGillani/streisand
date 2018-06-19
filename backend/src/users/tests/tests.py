# -*- coding: utf-8 -*-

from django.core.exceptions import ValidationError
from django.test import TestCase

from users.validators import EmailValidator


class EmailValidatorTests(TestCase):

    def setUp(self):
        self.validator = EmailValidator()
        self.valid_email_addresses = (
            'testing@test.com',
            'testing123@test.com',
            'testing.123@test.com',
            'testing_123@test.com',
            'testing-123@test.com',
            '_starts_with_underscore@test.com',

        )
        self.invalid_email_addresses = (
            '',
            'no.at.sign',
            'testing@notadomain',
            'testing@localhost',
            'single.letter.domain@test.d',
            'unicöde.characters@test.com',
            'testing+123@test.com',
            'consecutive..dots@test.com',
            '.starts.with.dot@test.com',
            '-starts.with.dash@test.com',
        )

    def test_invalid_email_addresses(self):
        for email_address in self.invalid_email_addresses:
            with self.assertRaises(ValidationError, msg=email_address):
                self.validator(email_address)

    def test_valid_email_addresses(self):
        for email_address in self.valid_email_addresses:
            try:
                self.validator(email_address)
            except ValidationError:
                self.fail(email_address)
