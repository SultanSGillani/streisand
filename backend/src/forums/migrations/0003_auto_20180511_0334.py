# Generated by Django 2.0.4 on 2018-05-11 03:34

import api.utils.positions
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('forums', '0002_forumpost_position'),
    ]

    operations = [
        migrations.AlterField(
            model_name='forumpost',
            name='position',
            field=api.utils.positions.PositionField(default=-1),
        ),
    ]
