from django.urls import path
from .views import CommentNoticeListView, CommentNoticeUpdateView, CommentNoticeReadedView

app_name = 'notice'

urlpatterns = [
    # 通知列表
    path('list/', CommentNoticeListView.as_view(), name='list'),
    # 更新通知状态
    path('update/', CommentNoticeUpdateView.as_view(), name='update'),
    # 已读
    path('read/', CommentNoticeReadedView.as_view(), name='read')
]