from rest_framework.views import APIView
from article.models import ArticlePost
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core import serializers
from django.utils import timezone
from django.utils import dateparse
import math
import re
from django.contrib.auth.models import User
from comment.models import Comment

# 获取相对时间
def time_since_zh(value):
    value = dateparse.parse_datetime(value)
    now = timezone.now()
    diff = now - value

    if diff.days == 0 and diff.seconds >= 0 and diff.seconds < 60:
        return '刚刚'

    if diff.days == 0 and diff.seconds >= 60 and diff.seconds < 3600:
        return str(math.floor(diff.seconds / 60)) + "分钟前"

    if diff.days == 0 and diff.seconds >= 3600 and diff.seconds < 86400:
        return str(math.floor(diff.seconds / 3600)) + "小时前"

    if diff.days >= 1 and diff.days < 30:
        return str(diff.days) + "天前"

    if diff.days >= 30 and diff.days < 365:
        return str(math.floor(diff.days / 30)) + "个月前"

    if diff.days >= 365:
        return str(math.floor(diff.days / 365)) + "年前"
    
# 目标经验id添加标题信息
def replace_title(match):
    target_object_id = match.group(1)
    try:
        title = ArticlePost.objects.get(id=target_object_id).title
    except ArticlePost.DoesNotExist:
        title = ''
    return '"target_object_id": "{}", "title": "{}",'.format(target_object_id, title)

# 替换评论id为评论内容
def replace_comment(match):
    action_object_object_id = match.group(1)
    try:
        body = Comment.objects.get(id=action_object_object_id).body
    except Comment.DoesNotExist:
        body = ''
    return '"body": "{}",'.format(body)

class CommentNoticeListView(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    """通知列表"""

    # 未读通知的查询集
    def get(self, request, format=None):
        notices = request.user.notifications.unread()

        # 转为json
        notices_json = serializers.serialize('json', notices)

        # 替换评论者id为昵称和头像url
        notices_json = re.sub(
            r'"actor_object_id": "(\d+)",',
            lambda match: '"avatarUrl": "{}", "user": "{}",'.format('http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(1)).profile.avatar_url), 
                                                                    User.objects.get(id=match.group(1)).profile.nickname),
            notices_json
        )

        # 目标经验id添加标题信息
        notices_json = re.sub(
            r'"target_object_id": "(\d+)",',
            replace_title,
            notices_json
        )

        # 替换评论id为评论内容
        notices_json = re.sub(
            r'"action_object_object_id": "(\d+)",',
            replace_comment,
            notices_json
        )
        

        # 替换时间
        notices_json = re.sub(
            r'"timestamp": "(\S+)"',
            lambda match: '"timestamp": "{}"'.format(time_since_zh(match.group(1))),
            notices_json
        )

        return Response({'code': 'post ok',
                  'notices': notices_json
                })
    

class CommentNoticeUpdateView(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    """更新通知状态"""
    # 处理 get 请求
    def get(self, request, format=None):
        # 获取未读消息
        notice_id = request.GET.get('notice_id')
        # 更新单条通知
        if notice_id:
            request.user.notifications.get(id=notice_id).mark_as_read()
            return Response({
                'code': 'post ok',
                })
        # 更新全部通知
        else:
            request.user.notifications.mark_all_as_read()
            return Response({'code': 'post ok'})
        

class CommentNoticeReadedView(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    """通知列表"""

    # 已读通知的查询集
    def get(self, request, format=None):
        notices = request.user.notifications.read()

        # 转为json
        notices_json = serializers.serialize('json', notices)

        # 替换评论者id为昵称和头像url
        notices_json = re.sub(
            r'"actor_object_id": "(\d+)",',
            lambda match: '"avatarUrl": "{}", "user": "{}",'.format('http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(1)).profile.avatar_url), 
                                                                    User.objects.get(id=match.group(1)).profile.nickname),
            notices_json
        )

        # 目标经验id添加标题信息
        notices_json = re.sub(
            r'"target_object_id": "(\d+)",',
            replace_title,
            notices_json
        )

        # 替换评论id为评论内容
        notices_json = re.sub(
            r'"action_object_object_id": "(\d+)",',
            replace_comment,
            notices_json
        )
        

        # 替换时间
        notices_json = re.sub(
            r'"timestamp": "(\S+)"',
            lambda match: '"timestamp": "{}"'.format(time_since_zh(match.group(1))),
            notices_json
        )

        return Response({'code': 'post ok',
                  'notices': notices_json
                })