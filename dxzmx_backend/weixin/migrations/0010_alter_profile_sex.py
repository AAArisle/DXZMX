# Generated by Django 3.2.24 on 2024-05-20 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0009_auto_20240520_1545'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='sex',
            field=models.CharField(default='未知', max_length=20),
        ),
    ]
