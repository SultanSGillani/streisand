# Generated by Django 2.0.6 on 2018-06-04 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Release',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cut', models.CharField(default=None, max_length=128, null=True)),
                ('name', models.CharField(max_length=1024)),
                ('group', models.CharField(max_length=32)),
                ('is_scene', models.NullBooleanField(default=False)),
                ('description', models.TextField()),
                ('nfo', models.TextField()),
                ('is_3d', models.BooleanField(default=False)),
                ('is_source', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ReleaseComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('text', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
