from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .forms import ArticlePostForm
from .models import ArticlePost
from django.db.models import Q
import re
from django.core import serializers
from comment.models import Comment
from django.utils import timezone
import math
from django.utils import dateparse

# 分享经验（新建文章）
class article_create(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]
        
    def post(self, request, format=None):
        # print("收到请求",request.data)
        # 将提交的数据赋值到表单实例中
        article_post_form = ArticlePostForm(request.POST, request.FILES)
        # 判断提交的数据是否满足模型的要求
        if article_post_form.is_valid():
            # 保存数据，但暂时不提交到数据库中
            new_article = article_post_form.save(commit=False)

            # 指定目前登录的用户为作者
            new_article.author = User.objects.get(id=request.user.id)

            # 将新文章保存到数据库中
            new_article.save()

            # 完成后让前端返回到文章列表
            return Response({'code': 'post ok'})
        # 如果数据不合法，返回错误信息
        else:
            return Response("表单内容有误，请重新填写。")

# 经验列表（文章列表）
class article_list(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        # 获取历史记录里的文章
        history_list = request.data['historys']
        history_list = [int(i) for i in history_list]

        # 过滤历史记录的文章
        article_list = ArticlePost.objects.filter(id__in=history_list)

        # 按照原顺序对文章进行排序
        article_list = sorted(article_list, key=lambda x: history_list.index(x.id))

        # 转为json
        articles = serializers.serialize('json', article_list)

        # 替换作者id为昵称和头像url，添加评论数量
        articles = re.sub(
            r'"pk": (\d+), "fields": {"author": (\d+),',
            lambda match: '"pk": {}, "fields": {{"comments": {}, "avatar_url": "{}", "author": "{}",'.format(match.group(1),
                                                                                                            ArticlePost.objects.get(id=match.group(1)).comments.count(),
                                                                                                            'http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(2)).profile.avatar_url),
                                                                                                            User.objects.get(id=match.group(2)).profile.nickname),
            articles
        )

        return Response({
                'code': 'get ok',
                'articles': articles,
        })


    def get(self, request, format=None):
        # 从 url 中提取查询参数
        search = request.GET.get('search')
        order = request.GET.get('order')
        school = request.GET.get('school')
        major = request.GET.get('major')
        course = request.GET.get('course')

        # 初始化查询集
        article_list = ArticlePost.objects.all()
        
        # 搜索查询集
        if search:
            article_list = ArticlePost.objects.filter(
                Q(title__icontains=search) |
                Q(body__icontains=search)
            )
        else:
            # 将 search 参数重置为空
            search = ''

        # 标签查询集
        if school and school != '-1':
            article_list = article_list.filter(school=school)
        if major and major != '-1':
            article_list = article_list.filter(major=major)
        if course and course != '-1':
            article_list = article_list.filter(course=course)

        # 根据GET请求中查询条件返回不同排序的对象数组
        # 按照浏览量排序显示
        if order == 'total_views':
            # 取出所有博客文章
            article_list = article_list.order_by('-total_views')

        # 按照点赞数排序显示
        elif order == 'likes':
            article_list = article_list.order_by('-likes')

        # 按照默认（修改时间）排序显示
        else:
            order = 'normal'
            article_list = article_list.order_by('-updated')

        # 转为json
        articles = serializers.serialize('json', article_list)

        # 替换作者id为昵称和头像url，添加评论数量
        articles = re.sub(
            r'"pk": (\d+), "fields": {"author": (\d+),',
            lambda match: '"pk": {}, "fields": {{"comments": {}, "avatar_url": "{}", "author": "{}",'.format(match.group(1),
                                                                                                            ArticlePost.objects.get(id=match.group(1)).comments.count(),
                                                                                                            'http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(2)).profile.avatar_url),
                                                                                                            User.objects.get(id=match.group(2)).profile.nickname),
            articles
        )

        return Response({
                'code': 'get ok',
                'articles': articles,
        })

# 经验详情（文章详情）
class article_detail(APIView):
    # 获取相对时间
    def time_since_zh(self, value):
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
        
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        # 取出相应的文章
        article = ArticlePost.objects.get(id=id)

        # 浏览量 +1
        article.total_views += 1
        article.save(update_fields=['total_views'])

        article.image = 'http://127.0.0.1:8000/media/'+str(article.image)

        # 转为json
        article_json = serializers.serialize('json', [article])

        # 替换作者id为昵称和头像url，添加评论数量
        article_json = re.sub(
            r'"pk": (\d+), "fields": {"author": (\d+),',
            lambda match: '"pk": {}, "fields": {{"comments": {}, "avatar_url": "{}", "author": "{}",'.format(match.group(1),
                                                                                                            ArticlePost.objects.get(id=match.group(1)).comments.count(),
                                                                                                            'http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(2)).profile.avatar_url),
                                                                                                            User.objects.get(id=match.group(2)).profile.nickname),
            article_json
        )

        # 取出文章评论
        comments = Comment.objects.filter(article=id)
        # 转为json
        comments_json = serializers.serialize('json', comments)

        # 替换作者id为昵称和头像url
        comments_json = re.sub(
            r'"user": (\d+),',
            lambda match: '"avatarUrl": "{}", "user": "{}",'.format('http://127.0.0.1:8000/media/'+str(User.objects.get(id=match.group(1)).profile.avatar_url), 
                                                                                            User.objects.get(id=match.group(1)).profile.nickname),
            comments_json
        )

        # 替换时间
        comments_json = re.sub(
            r'"created": "(\S+)"',
            lambda match: '"created": "{}"'.format(self.time_since_zh(match.group(1))),
            comments_json
        )

        print(comments_json)

        return Response({
                'code': 'get ok',
                'article': article_json,
                'comments': comments_json,
        })
    
# 更新经验
class article_update(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        # 取出相应的文章
        article = ArticlePost.objects.get(id=id)

        article.image = 'http://127.0.0.1:8000/media/'+str(article.image)
        
        # 转为json
        article_json = serializers.serialize('json', [article])
        return Response({
                'code': 'get ok',
                'article': article_json,
        })
    
    def post(self, request, id, format=None):
        # 将提交的数据赋值到表单实例中
        article_post_form = ArticlePostForm(request.POST, request.FILES)
        # 判断提交的数据是否满足模型的要求
        if article_post_form.is_valid():
            article = ArticlePost.objects.get(id=id)

            # 过滤非作者的用户
            if article.author != request.user:
                return Response("抱歉，你无权修改这篇文章。")

            if request.POST['title']:
                article.title = request.POST['title']
                article.body = request.POST['body']
                article.school = request.POST['school']
                article.major = request.POST['major']
                article.course = request.POST['course']

            if request.FILES.get('image'):
                article.image = request.FILES.get('image')

            article.save()

            # 完成后让前端返回到文章列表
            return Response({'code': 'post ok'})
        # 如果数据不合法，返回错误信息
        else:
            return Response("表单内容有误，请重新填写。")
        
        
# 删除文章
class article_delete(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id, format=None):
        # 根据 id 获取需要删除的文章
        article = ArticlePost.objects.get(id=id)

        # 过滤非作者的用户
        if article.author != request.user:
            return Response("抱歉，你无权删除这篇文章。")
        
        # 调用.delete()方法删除文章
        article.delete()

        # 完成后让前端返回到文章列表
        return Response({'code': 'post ok'})