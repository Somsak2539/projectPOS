# Generated by Django 5.1.4 on 2025-01-04 21:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('productapp', '0006_product2_sale'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sale',
            name='product',
        ),
        migrations.DeleteModel(
            name='Product2',
        ),
        migrations.DeleteModel(
            name='Sale',
        ),
    ]
