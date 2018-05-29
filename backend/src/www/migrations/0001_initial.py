# Generated by Django 2.0.5 on 2018-05-29 11:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('name', models.CharField(max_length=128, primary_key=True, serialize=False)),
                ('description', models.TextField()),
                ('is_enabled', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='LogEntry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('action', models.CharField(db_index=True, max_length=128)),
                ('text', models.CharField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='LoginAttempt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('ip_address', models.GenericIPAddressField(null=True)),
                ('success', models.BooleanField()),
                ('time_stamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='login_attempts', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'get_latest_by': 'time_stamp',
            },
        ),
    ]
