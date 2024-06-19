from django.urls import path
from article.views import article_create
from article.views import article_list
from article.views import article_detail
from article.views import article_update
from article.views import article_delete

app_name = 'article'

urlpatterns = [
    # 分享经验（新建文章）
    path('article-create/', article_create.as_view(), name='article_create'),

    # 经验列表（文章列表）
    path('article-list/', article_list.as_view(), name='article_list'),

    # 经验详情（文章详情）
    path('article-detail/<int:id>/', article_detail.as_view(), name='article_detail'),

    # 更新经验
    path('article-update/<int:id>/', article_update.as_view(), name='article_update'),

    # 删除经验
    path('article-delete/<int:id>/', article_delete.as_view(), name='article_delete'),
]