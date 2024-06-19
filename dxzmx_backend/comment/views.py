from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from article.models import ArticlePost
from .forms import CommentForm
from notifications.signals import notify
from django.contrib.auth.models import User

# 文章评论
class post_comment (APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    # 处理 POST 请求
    def post(self, request, article_id):
        article = get_object_or_404(ArticlePost, id=article_id)
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.article = article
            new_comment.user = request.user

            new_comment.save()

            notify.send(
                    request.user,
                    recipient=User.objects.get(id=article.author.id),
                    verb='评论了你的经验',
                    target=article,
                    action_object=new_comment,
                )
                
            return Response({'code': 'post ok'})
        else:
            return Response("表单内容有误，请重新填写。")
