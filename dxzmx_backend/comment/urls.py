from django.urls import path
from .views import post_comment

app_name = 'comment'

urlpatterns = [
    # 发表评论
    path('post-comment/<int:article_id>/', post_comment.as_view(), name='post_comment'),
]