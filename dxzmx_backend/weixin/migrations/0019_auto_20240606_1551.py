# Generated by Django 3.2.24 on 2024-06-06 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0018_auto_20240603_1127'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='grade',
            field=models.CharField(default='未知', max_length=20),
        ),
        migrations.AlterField(
            model_name='profile',
            name='major',
            field=models.CharField(default='未知', max_length=20),
        ),
        migrations.AlterField(
            model_name='profile',
            name='school',
            field=models.CharField(default='未知', max_length=20),
        ),
    ]
