# Generated by Django 3.2.9 on 2022-01-23 05:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0017_auto_20220105_0502'),
        ('modules', '0020_rename_component_modulebomlistitem_components_options'),
        ('user_profile', '0005_auto_20220123_0455'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofileshoppinglistdata',
            name='bom_item',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='modules.modulebomlistitem'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userprofileshoppinglistdata',
            name='component',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='components.component'),
        ),
        migrations.AlterField(
            model_name='userprofileshoppinglistdata',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='modules.module'),
        ),
        migrations.AlterField(
            model_name='userprofileshoppinglistdata',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user_profile.userprofile'),
        ),
    ]
