# Generated by Django 3.2.9 on 2022-01-02 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0011_auto_20220102_2032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='component',
            name='farads',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='If the component type involves capacitance, this value MUST be set.', max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='component',
            name='ohms',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='If the component type involves resistance, this value MUST be set.', max_digits=10, null=True),
        ),
    ]
