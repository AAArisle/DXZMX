from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# 用pillow库处理图片
from PIL import Image

# 博客文章数据模型
class ArticlePost(models.Model):
    # 文章作者。指定数据删除的方式为级联删除（和用户一起删除）
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    # 文章标题。使用 CharField 存储较短的字符串
    title = models.CharField(max_length=100)

    # 文章正文。保存大量文本使用 TextField
    body = models.TextField()

    # 文章创建时间。指定其在创建数据时将默认写入当前的时间
    created = models.DateTimeField(default=timezone.now)

    # 文章更新时间。指定每次数据更新时自动写入当前时间
    updated = models.DateTimeField(auto_now=True)

    # 文章浏览量
    total_views = models.PositiveIntegerField(default=0)

    # 文章点赞数
    likes = models.PositiveIntegerField(default=0)

    # 文章点踩数
    hates = models.PositiveIntegerField(default=0)

    # 文章图片
    image = models.ImageField(upload_to='article/%Y%m%d/', blank=True)

    # 文章标签
    # 学校
    school = models.CharField(max_length=10, default=-1)
    # 专业
    major = models.CharField(max_length=10, default=-1)
    # 课程
    course = models.CharField(max_length=10, default=-1)

    # 内部类 class Meta 用于给 model 定义元数据
    class Meta:
    	# ordering 指定模型返回的数据的排列顺序
    	# '-created' 表明数据应该以倒序排列
        ordering = ('-created',)

    # 函数 __str__ 定义当调用对象的 str() 方法时的返回值内容
    def __str__(self):
    	# 将文章标题返回
        return self.title

    # 保存文章
    def save(self, *args, **kwargs):
        # 调用原有的 save() 的功能
        article = super(ArticlePost, self).save(*args, **kwargs)

        # 固定宽度缩放图片大小
        if self.image and not kwargs.get('update_fields'):
            image = Image.open(self.image)
            (x, y) = image.size
            new_x = 350
            new_y = int(new_x * (y / x))
            resized_image = image.resize((new_x, new_y), Image.ANTIALIAS)
            resized_image.save(self.image.path)
        return article
    
    # 判断文章是否是刚创建的
    def was_created_recently(self):
        diff = timezone.now() - self.created
        
        if diff.days == 0 and diff.seconds >= 0 and diff.seconds < 60:
            return True
        else:
            return False