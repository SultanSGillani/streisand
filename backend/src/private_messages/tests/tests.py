from django.test import TestCase
from django.test.client import RequestFactory
from django.utils import timezone

from private_messages.models import Message
from private_messages.models import inbox
from users.models import User


class SendTestCase(TestCase):
    def setUp(self):
        self.fuckneebs = User.objects.create_user(
            'FuckNeebs', 'user1@example.com', '123456')
        self.dantheman = User.objects.create_user(
            'DanIsTheMan', 'user2@example.com', '123456')
        self.msg1 = Message(sender=self.fuckneebs, recipient=self.dantheman,
                            subject='Subject Text', body='Body Text')
        self.msg1.save()

    def TestBasicSentMessage(self):
        self.assertEqual(self.msg1.sender, self.fuckneebs)
        self.assertEqual(self.msg1.recipient, self.dantheman)
        self.assertEqual(self.msg1.subject, 'Subject Text')
        self.assertEqual(self.msg1.body, 'Body Text')
        self.assertEqual(self.fuckneebs.sent_messages.count(), 1)
        self.assertEqual(self.fuckneebs.received_messages.count(), 0)
        self.assertEqual(self.dantheman.received_messages.count(), 1)
        self.assertEqual(self.dantheman.sent_messages.count(), 0)


class DeleteTestCase(TestCase):
    def setUp(self):
        self.fuckneebs = User.objects.create_user(
            'user3', 'user3@example.com', '123456')
        self.dantheman = User.objects.create_user(
            'user4', 'user4@example.com', '123456')
        self.msg1 = Message(sender=self.fuckneebs, recipient=self.dantheman,
                            subject='Subject Text 1', body='Body Text 1')
        self.msg2 = Message(sender=self.fuckneebs, recipient=self.dantheman,
                            subject='Subject Text 2', body='Body Text 2')
        self.msg1.sender_deleted_at = timezone.now()
        self.msg2.recipient_deleted_at = timezone.now()
        self.msg1.save()
        self.msg2.save()

    def TestBasicSentMessage(self):
        self.assertEqual(Message.objects.outbox(self.fuckneebs).count(), 1)
        self.assertEqual(
            Message.objects.outbox(self.fuckneebs)[0].subject,
            'Subject Text 2'
        )
        self.assertEqual(Message.objects.inbox(self.dantheman).count(), 1)
        self.assertEqual(
            Message.objects.inbox(self.dantheman)[0].subject,
            'Subject Text 1'
        )

        self.msg1.sender_deleted_at = None
        self.msg2.recipient_deleted_at = None
        self.msg1.save()
        self.msg2.save()
        self.assertEqual(Message.objects.outbox(self.fuckneebs).count(), 2)
        self.assertEqual(Message.objects.inbox(self.dantheman).count(), 2)


class InboxCountTestCase(TestCase):
    """Test inbox-count."""

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username='test_user', email='test@example.com', password='secret'
        )
        self.user_2 = User.objects.create_user(
            username='test_user_2', email='test2@example.de', password='secret'
        )
        Message.objects.create(
            recipient=self.user_2,
            subject="Subject",
            body="Body",
            sender=self.user
        )

    def TestCountForEmptyInbox(self):
        """Test message count for user with empty inbox."""
        r = self.factory.get('/')
        r.user = self.user
        self.assertEquals(inbox(r), {'messages_inbox_count': 0})

    def TestCountForInboxWithMessage(self):
        """Test message count for user with one unread message."""
        r = self.factory.get('/')
        r.user = self.user_2
        self.assertEquals(inbox(r), {'messages_inbox_count': 1})
