# Generated by Django 3.2.24 on 2024-04-19 05:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weixin', '0004_auto_20240419_1317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='grade',
            field=models.PositiveIntegerField(choices=[(0, '未知'), (1, '大一'), (2, '大二'), (3, '大三'), (4, '大四')], default=0),
        ),
    ]