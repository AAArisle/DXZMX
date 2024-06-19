from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import json
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from article.models import ArticlePost
import re
from django.core import serializers
from django.db.models import Q

# 用户关注的tag的文章
class TagArticle(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    # 返回文章列表
    def get(self, request, format=None):
        user = request.user

        schoolFollows = user.aboutarticles.schoolFollows.split()
        schoolFollows = [int(i) for i in schoolFollows]
        majorFollows = user.aboutarticles.majorFollows.split()
        majorFollows = [int(i) for i in majorFollows]
        courseFollows = user.aboutarticles.courseFollows.split()
        courseFollows = [int(i) for i in courseFollows]

        # 初始化查询集
        article_list = ArticlePost.objects.all()
        
        # 搜索查询集
        article_list = ArticlePost.objects.filter(
            Q(school__in = schoolFollows) |
            Q(major__in = majorFollows) |
            Q(course__in = courseFollows)
        )

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
        
    # 保存tag更改
    def post(self, request, format=None):
        user = request.user

        # 修改tag
        if request.data['change']:
            schoolFollows = request.data['schoolFollows']
            schoolFollows = [str(i) for i in schoolFollows]
            user.aboutarticles.schoolFollows = " ".join(schoolFollows)

            majorFollows = request.data['majorFollows']
            majorFollows = [str(i) for i in majorFollows]
            user.aboutarticles.majorFollows = " ".join(majorFollows)

            courseFollows = request.data['courseFollows']
            courseFollows = [str(i) for i in courseFollows]
            user.aboutarticles.courseFollows = " ".join(courseFollows)

            user.save()
            return Response({
                    'code': 'get ok',
            })
        
        # 获取tag
        else:
            schoolFollows = user.aboutarticles.schoolFollows.split()
            schoolFollows = [int(i) for i in schoolFollows]
            majorFollows = user.aboutarticles.majorFollows.split()
            majorFollows = [int(i) for i in majorFollows]
            courseFollows = user.aboutarticles.courseFollows.split()
            courseFollows = [int(i) for i in courseFollows]

            return Response({
                    'code': 'get ok',
                    'schoolFollows': schoolFollows,
                    'majorFollows': majorFollows,
                    'courseFollows': courseFollows,
            })

    

# 用户发布的文章
class UserArticle(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        
        # 过滤收藏的文章
        article_list = ArticlePost.objects.filter(author__in=[request.user.id])

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

# 用户与文章相关的内容
class UserAboutArticle(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    # 详情页的收藏和点赞
    def post(self, request, format=None):
        user = request.user

        
        if "id" in request.data:
            id = request.data["id"]
            starlist = user.aboutarticles.star.split()
            likelist = user.aboutarticles.like.split()
            # 更新收藏点赞状态
            if "star" in request.data:
                star = request.data["star"]
                like = request.data["like"]
                print(star,like)
                
                if star == True and str(id) not in starlist:
                    user.aboutarticles.star += " "+str(id)
                elif star == False and str(id) in starlist:
                    starlist.remove(str(id))
                    user.aboutarticles.star = " ".join(starlist)

                # 取出相应的文章
                article = ArticlePost.objects.get(id=id)
                # 点赞
                if like == 1:
                    if "-"+str(id) in likelist:
                        likelist.remove("-"+str(id))
                        likelist.append(str(id))
                        user.aboutarticles.like = " ".join(likelist)
                        article.hates -= 1
                        article.likes += 1
                        article.save()
                    elif str(id) not in likelist:
                        user.aboutarticles.like += " "+str(id)
                        article.likes += 1
                        article.save()
                # 点踩
                elif like == -1:
                    if str(id) in likelist:
                        likelist.remove(str(id))
                        likelist.append("-"+str(id))
                        user.aboutarticles.like = " ".join(likelist)
                        article.likes -= 1
                        article.hates += 1
                        article.save()
                    elif "-"+str(id) not in likelist:
                        user.aboutarticles.like += " -"+str(id)
                        article.hates += 1
                        article.save()
                # 不点
                elif like == 0:
                    if str(id) in likelist:
                        likelist.remove(str(id))
                        user.aboutarticles.like = " ".join(likelist)
                        article.likes -= 1
                        article.save()
                    elif "-"+str(id) in likelist:
                        likelist.remove("-"+str(id))
                        user.aboutarticles.like = " ".join(likelist)
                        article.hates -= 1
                        article.save()

                user.save()

                # 转为json
                article_json = serializers.serialize('json', [article])
                return Response({
                    'code': 'post ok',
                    'article': article_json,
                    })


            # 显示用户是否收藏和点赞
            else:
                star = False
                like = 0
                
                if str(id) in starlist:
                    star = True
                    
                if str(id) in likelist:
                    like = 1
                elif "-"+str(id) in likelist:
                    like = -1

                return Response({
                    'code': 'get ok', 
                    'star': star,
                    'like': like,
                    })
        
        else:
            return Response({
                '应该在详情页调用该接口才对'
            })
        
            
    # 用户主页的收藏
    def get(self, request, format=None):
        user = request.user

        starlist = user.aboutarticles.star.split()
        starlist = [int(i) for i in starlist]
        print(starlist)

        # 过滤收藏的文章
        article_list = ArticlePost.objects.filter(id__in=starlist)

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

# 用户信息
class UserData(APIView):
    # 鉴权方式
    permission_classes = [IsAuthenticated]

    # 获取用户信息
    def get(self, request, format=None):
        if request.user.profile.avatar_url:
            avatar_url = 'http://127.0.0.1:8000/media/'+str(request.user.profile.avatar_url)
        else:
            avatar_url= 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

        return Response({
            'code': 'get ok', 
            'nickname': request.user.profile.nickname, 
            'avatar_url': avatar_url,
            'sex': request.user.profile.sex,
            'email': request.user.profile.email,
            'school': request.user.profile.school,
            'grade': request.user.profile.grade,
            'major': request.user.profile.major,
            })


    # 更新用户信息
    def post(self, request, format=None):
        user = request.user
        if "userInfo" in request.data:
            userInfo = request.data["userInfo"]
            user.profile.nickname = userInfo["nickName"]
            user.profile.sex = userInfo["sex"]
            user.profile.email = userInfo["email"]
            user.profile.school = userInfo["school"]
            user.profile.grade = userInfo["grade"]
            user.profile.major = userInfo["major"]
        if 'avatarUrl' in request.FILES:
            user.profile.avatar_url = request.FILES['avatarUrl']
        user.save()
        return Response({'code': 'post ok'})

class WeixinLogin(APIView):
    def post(self, request, format=None):
        """
        提供 post 请求
        """
        # 从请求中获得code
        code = json.loads(request.body).get('code')
        
        # 填写你的测试号密钥
        appid = 'appid'
        appsecret = 'appsecret'
        
        # 微信接口服务地址
        base_url = 'https://api.weixin.qq.com/sns/jscode2session'
        # 微信接口服务的带参数的地址
        url = base_url + "?appid=" + appid + "&secret=" + appsecret + "&js_code=" + code + "&grant_type=authorization_code"
        response = requests.get(url)
        
        # 处理获取的 openid
        try:
            openid = response.json()['openid']
            session_key = response.json()['session_key']
        except KeyError:
            return Response({'code': 'fail'})
        else:
            # 打印到后端命令行
            print("获取openid：\n", openid, session_key)
            # 根据openid确定用户的本地身份
            try:
                user = User.objects.get(username=openid)
            except User.DoesNotExist:
                user = None

            if user:
                user = User.objects.get(username=openid)
            else:
                user = User.objects.create(
                    username=openid,
                    password=openid
                )

            refresh = RefreshToken.for_user(user)

            return Response({
                    'code': 'success',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                })