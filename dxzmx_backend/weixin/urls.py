from django.urls import path
from weixin.views import WeixinLogin, UserData, UserAboutArticle, UserArticle, TagArticle

app_name = 'weixin'

urlpatterns = [
    # 微信登录，获取openid，返回token
    path('login/', WeixinLogin.as_view(), name='login'),
    
    # 用户数据，返回用户数据
    path('data/', UserData.as_view(), name='data'),

    # 用户收藏点赞
    path('about/', UserAboutArticle.as_view(), name='about'),

    # 用户文章
    path('myshared/', UserArticle.as_view(), name='myshared'),

    # 标签文章
    path('tag/', TagArticle.as_view(), name='tag'),
]