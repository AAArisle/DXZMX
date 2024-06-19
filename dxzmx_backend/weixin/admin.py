from django.contrib import admin

# 导入用户信息模型
from .models import Profile
from .models import AboutArticles

# 注册UserProfile到admin中
admin.site.register(Profile)
admin.site.register(AboutArticles)
