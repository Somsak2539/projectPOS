# Generated by Django 5.1.4 on 2025-02-14 08:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productapp', '0010_product1_barcode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product1',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='productapp.category'),
        ),
        migrations.AlterField(
            model_name='product1',
            name='image',
            field=models.ImageField(upload_to='product'),
        ),
    ]
