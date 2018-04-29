from django.apps import AppConfig


class UsersAppConfig(AppConfig):

    name = 'users'
    verbose_name = "User"

    def ready(self):
        # noinspection PyUnresolvedReferences

        import users.signals  # NOQA
