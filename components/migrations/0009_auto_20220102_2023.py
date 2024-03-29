# Generated by Django 3.2.9 on 2022-01-02 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0008_auto_20220102_1944'),
    ]

    operations = [
        migrations.AddField(
            model_name='component',
            name='ohms',
            field=models.IntegerField(blank=True, default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='component',
            name='ohms_unit',
            field=models.CharField(blank=True, choices=[('R', 'Ω'), ('kΩ', 'kΩ'), ('MΩ', 'MΩ')], max_length=2),
        ),
    ]
