# Generated by Django 3.2.9 on 2022-02-16 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0009_userprofilecomponentinventorydata_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='inventory_structure',
            field=models.JSONField(default={'container_name': 'default_container', 'contents': {'container_name': 'default_box', 'contents': []}}),
        ),
        migrations.AlterField(
            model_name='userprofilecomponentinventorydata',
            name='location',
            field=models.JSONField(blank=True),
        ),
    ]