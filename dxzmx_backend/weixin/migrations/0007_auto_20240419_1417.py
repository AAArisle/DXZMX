# Generated by Django 3.2.24 on 2024-04-19 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0006_auto_20240419_1352'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='avatar',
        ),
        migrations.AddField(
            model_name='profile',
            name='avatar_url',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]