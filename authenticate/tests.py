from django.test import RequestFactory, TestCase, Client
from django.contrib.auth import get_user_model
from .views import home

class HomePageTest(TestCase):
    def test_view_url_exists_at_desired_location(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

class LoginPageTest(TestCase):
    def test_view_url_exists_at_desired_location(self):
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 200)

