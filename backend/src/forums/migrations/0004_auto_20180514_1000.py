# Generated by Django 2.0.5 on 2018-05-14 10:00

import api.positions
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0003_auto_20180511_0334'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='forumpost',
            options={'get_latest_by': ['created_at'], 'ordering': ['created_at']},
        ),
        migrations.AlterField(
            model_name='forumpost',
            name='modified_by',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='modified_posts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='forumpost',
            name='position',
            field=api.positions.PositionField(default=-1, editable=False),
        ),
    ]