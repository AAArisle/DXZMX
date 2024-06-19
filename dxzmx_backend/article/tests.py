from django.test import TestCase
import datetime
from django.utils import timezone
from article.models import ArticlePost
from django.contrib.auth.models import User


class ArticlePostModelTests(TestCase):

    def test_was_created_recently_with_future_article(self):
        # 若文章创建时间为未来，返回 False
        ...

    def test_was_created_recently_with_seconds_before_article(self):
        # 若文章创建时间为 1 分钟内，返回 True
        author = User(username='user1', password='test_password')
        author.save()
        seconds_before_article = ArticlePost(
            author=author,
            title='test1',
            body='test1',
            created=timezone.now() - datetime.timedelta(seconds=45)
            )
        self.assertIs(seconds_before_article.was_created_recently(), True)

    def test_was_created_recently_with_hours_before_article(self):
        # 若文章创建时间为几小时前，返回 False
        author = User(username='user2', password='test_password')
        author.save()
        hours_before_article = ArticlePost(
            author=author,
            title='test2',
            body='test2',
            created=timezone.now() - datetime.timedelta(hours=3)
            )
        self.assertIs(hours_before_article.was_created_recently(), False)

    def test_was_created_recently_with_days_before_article(self):
        # 若文章创建时间为几天前，返回 False
        author = User(username='user3', password='test_password')
        author.save()
        months_before_article = ArticlePost(
            author=author,
            title='test3',
            body='test3',
            created=timezone.now() - datetime.timedelta(days=5)
            )
        self.assertIs(months_before_article.was_created_recently(), False)