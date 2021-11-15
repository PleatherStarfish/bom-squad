# Generated by Django 3.2.9 on 2021-11-12 14:47

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0002_alter_component_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='component',
            name='date_updated',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='types',
            name='date_updated',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
