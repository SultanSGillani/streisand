from django_extensions.db.fields import (
    CreationDateTimeField, ModificationDateTimeField,
)

from django.db import models


class TimeStampedModel(models.Model):
    """ TimeStampedModel modified from django extensions
    An abstract base class model that provides self-managed "created_at" and
    "modified_at" fields.
    """
    created_at = CreationDateTimeField()
    modified_at = ModificationDateTimeField()

    def save(self, **kwargs):
        self.update_modified = kwargs.pop('update_modified', getattr(self, 'update_modified', True))
        super(TimeStampedModel, self).save(**kwargs)

    class Meta:
        get_latest_by = 'modified_at'
        ordering = ('-modified_at', '-created_at',)
        abstract = True


