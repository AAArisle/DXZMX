# Generated by Django 3.2.24 on 2024-06-02 16:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0016_auto_20240603_0003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='aboutarticles',
            name='like',
            field=models.CharField(blank=True, default=' ', max_length=255),
        ),
        migrations.AlterField(
            model_name='aboutarticles',
            name='star',
            field=models.CharField(blank=True, default=' ', max_length=255),
        ),
    ]
