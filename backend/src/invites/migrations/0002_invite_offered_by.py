# Generated by Django 2.0.6 on 2018-07-08 06:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('invites', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='invite',
            name='offered_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invites', to=settings.AUTH_USER_MODEL),
        ),
    ]