# Generated by Django 3.2.9 on 2022-01-03 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suppliers', '0004_supplier_date_updated'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplier',
            name='short_name',
            field=models.CharField(default='Tayda', max_length=30),
            preserve_default=False,
        ),
    ]