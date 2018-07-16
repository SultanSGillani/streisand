from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from django_elasticsearch_dsl.registries import registry


@receiver(post_save)
def update_document(sender, **kwargs):

    
    app_label = sender._meta.app_label
    model_name = sender._meta.model_name
    instance = kwargs['instance']

    if app_label == 'films':
        # If it is `films.imdb` that is being updated.
        if model_name == 'imdb':
            instances = instance.films.all()
            for _instance in instances:
                registry.update(_instance)

        # If it is `films.rotten_tomatoes` that is being updated.
        if model_name == 'rotten_tomatoes':
            instances = instance.films.all()
            for _instance in instances:
                registry.update(_instance)


@receiver(post_delete)
def delete_document(sender, **kwargs):

    app_label = sender._meta.app_label
    model_name = sender._meta.model_name
    instance = kwargs['instance']

    if app_label == 'films':
        # If it is `films.imdb` that is being updated.
        if model_name == 'imdb':
            instances = instance.films.all()
            for _instance in instances:
                registry.update(_instance)
                # registry.delete(_instance, raise_on_error=False)

        # If it is `films.rotten_tomatoes` that is being updated.
        if model_name == 'rotten_tomatoes':
            instances = instance.films.all()
            for _instance in instances:
                registry.update(_instance)
                # registry.delete(_instance, raise_on_error=False)
