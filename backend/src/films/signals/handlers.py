from django.db.models.signals import post_save
from django.dispatch import receiver

from ..models import Film


@receiver(post_save, sender=Film)
def index_film(sender, instance, **kwargs):
    instance.indexing()
