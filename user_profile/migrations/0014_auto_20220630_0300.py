# Generated by Django 3.2.9 on 2022-06-30 03:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0013_auto_20220324_0319'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='component_inventory_json',
            field=models.JSONField(null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='shopping_list_json',
            field=models.JSONField(null=True),
        ),
    ]
