# Generated by Django 2.0.4 on 2018-05-03 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(max_length=1024)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='CollectionComment',
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
        migrations.CreateModel(
            name='Film',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('old_id', models.PositiveIntegerField(db_index=True, null=True)),
                ('title', models.CharField(max_length=1024)),
                ('year', models.PositiveSmallIntegerField()),
                ('tmdb_id', models.IntegerField(null=True, unique=True)),
                ('poster_url', models.URLField()),
                ('fanart_url', models.URLField()),
                ('trailer_url', models.URLField()),
                ('trailer_type', models.CharField(max_length=64)),
                ('duration_in_minutes', models.IntegerField(null=True)),
                ('description', models.TextField()),
                ('moderation_notes', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='FilmComment',
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
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('name', models.CharField(max_length=32, primary_key=True, serialize=False)),
            ],
        ),
    ]
