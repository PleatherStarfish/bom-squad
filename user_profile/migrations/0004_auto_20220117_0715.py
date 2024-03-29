# Generated by Django 3.2.9 on 2022-01-17 07:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('components', '0017_auto_20220105_0502'),
        ('user_profile', '0003_auto_20220117_0630'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='component_inventory',
            field=models.ManyToManyField(blank=True, related_name='user_component_inventory', through='user_profile.UserProfileComponentInventoryData', to='components.Component'),
        ),
        migrations.CreateModel(
            name='UserProfileShoppingListData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(default=0)),
                ('component', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='components.component')),
                ('profile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user_profile.userprofile')),
            ],
        ),
        migrations.AddField(
            model_name='userprofile',
            name='shopping_list',
            field=models.ManyToManyField(blank=True, related_name='user_shopping_list', through='user_profile.UserProfileShoppingListData', to='components.Component'),
        ),
    ]
