# Generated by Django 3.2.9 on 2023-01-14 06:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0015_auto_20220630_1306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofilecomponentinventorydata',
            name='location',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
