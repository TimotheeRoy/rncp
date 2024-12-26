from django.urls import reverse
from rest_framework.test import APITestCase

from users.models import User
from users.test.factories import make_user, login_user


class LoginViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = make_user()

    @property
    def path(self):
        return reverse("login")

    def test_can_login(self):
        data = {
            "email": self.user.email,
            "password": "password",
        }
        response = self.client.post(self.path, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user_id"], self.user.id)


class CreateUserViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    @property
    def path(self):
        return reverse("user-create")

    def test_can_post(self):
        data = {
            "first_name": "test",
            "last_name": "test",
            "email": "testuser@example.com",
            "password": "password",
        }
        response = self.client.post(self.path, data)
        self.assertEqual(response.status_code, 201)
    

class RetrieveUserViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = make_user()

    @property
    def path(self):
        return reverse("user-detail", args=[self.user.id])

    def test_can_get(self):
        header = login_user(self.user)
        response = self.client.get(self.path, **header)
        self.assertEqual(response.status_code, 200)


class UpdateUserViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = make_user()

    @property
    def path(self):
        return reverse("user-update", args=[self.user.id])
    
    def test_can_put(self):
        data = {
            "first_name": "test",
            "last_name": "test",
        }
        header = login_user(self.user)
        response = self.client.put(self.path, data, **header)
        self.assertEqual(response.status_code, 200)

class DeleteUserViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.user = make_user()

    @property
    def path(self):
        return reverse("user-delete", args=[self.user.id])
    
    def test_can_delete(self):
        header = login_user(self.user)
        response = self.client.delete(self.path, **header)
        self.assertEqual(response.status_code, 204)