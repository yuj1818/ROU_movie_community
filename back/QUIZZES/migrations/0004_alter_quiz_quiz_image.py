# Generated by Django 5.1.6 on 2025-03-19 06:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('QUIZZES', '0003_remove_quiz_quiz_movie'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='quiz_image',
            field=models.ImageField(default='', upload_to='quiz_images/'),
        ),
    ]
