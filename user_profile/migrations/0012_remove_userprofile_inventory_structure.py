# Generated by Django 3.2.9 on 2022-02-19 06:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0011_alter_userprofile_inventory_structure'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='inventory_structure',
        ),
    ]
