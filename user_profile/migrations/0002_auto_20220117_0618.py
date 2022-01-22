# Generated by Django 3.2.9 on 2022-01-17 06:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0017_auto_20220105_0502'),
        ('modules', '0020_rename_component_modulebomlistitem_components_options'),
        ('user_profile', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='component_inventory',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='want_to_build_modules',
            field=models.ManyToManyField(blank=True, null=True, related_name='want_to_build', to='modules.Module'),
        ),
        migrations.CreateModel(
            name='UserProfileComponentInventoryData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(default=0)),
                ('component', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='components.component')),
                ('profile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user_profile.userprofile')),
            ],
        ),
        migrations.AddField(
            model_name='userprofile',
            name='component_inventory',
            field=models.ManyToManyField(blank=True, null=True, through='user_profile.UserProfileComponentInventoryData', to='components.Component'),
        ),
    ]