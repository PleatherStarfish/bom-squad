# Generated by Django 3.2.9 on 2022-02-16 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0010_auto_20220216_2045'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='inventory_structure',
            field=models.JSONField(blank=True, default={'container_name': 'default_container', 'contents': {'container_name': 'default_box', 'contents': []}}, null=True),
        ),
    ]