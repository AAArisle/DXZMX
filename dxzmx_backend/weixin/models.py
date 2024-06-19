from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from PIL import Image

# 和文章相关的数据存储
class AboutArticles(models.Model):
    # 与 User 模型构成一对一的关系
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 收藏
    star = models.CharField(max_length=255, default="", blank=True)
    # 点赞/踩
    like = models.CharField(max_length=255, default="", blank=True)
    # 关注的学校
    schoolFollows = models.CharField(max_length=255, default="", blank=True)
    # 关注的专业
    majorFollows = models.CharField(max_length=255, default="", blank=True)
    # 关注的课程
    courseFollows = models.CharField(max_length=255, default="", blank=True)

# 用户信息
class Profile(models.Model):
    # 与 User 模型构成一对一的关系
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 昵称
    nickname = models.CharField(max_length=20, default="")
    # 头像
    avatar_url = models.ImageField(upload_to='userprofile/', blank=True)
    # 性别
    sex = models.CharField(max_length=20, default="未知")
    # 邮箱
    email = models.EmailField(max_length=50, default="")
    # 学校
    school = models.CharField(max_length=20, default="未知")
    # 年级
    grade = models.CharField(max_length=20, default="未知")
    # 专业
    major = models.CharField(max_length=20, default="未知")

    # 保存
    def save(self, *args, **kwargs):
        # 调用原有的 save() 的功能
        profile = super(Profile, self).save(*args, **kwargs)

        if self.avatar_url and not kwargs.get('update_fields'):
            image = Image.open(self.avatar_url)
            image.save(self.avatar_url.path)
        return profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    print("收到信号\n")
    if created:
        print("创建\n")
        Profile.objects.create(user=instance)
        AboutArticles.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
    instance.aboutarticles.save()