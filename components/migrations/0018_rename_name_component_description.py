# Generated by Django 3.2.9 on 2022-01-31 07:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0017_auto_20220105_0502'),
    ]

    operations = [
        migrations.RenameField(
            model_name='component',
            old_name='name',
            new_name='description',
        ),
    ]
