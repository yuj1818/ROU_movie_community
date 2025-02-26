import os
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

@receiver(pre_save, sender=User)
def update_profile_img(sender, instance, **kwargs):
    if instance.pk:
        try:
            pre_img = User.objects.get(pk=instance.pk).profile_image
            if pre_img and pre_img != instance.profile_image:
                pre_img_path = pre_img.path
                if os.path.exists(pre_img_path):
                    os.remove(pre_img_path)
        except User.DoesNotExist:
            pass