from django.urls import reverse
from rest_framework.test import APITestCase

from tasks.models import Task
from users.test.factories import login_user, make_user


class TasksListViewTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.path = reverse("tasks-list")

    def test_can_get(self):
        header = login_user(self.user)
        response = self.client.get(self.path, **header)
        self.assertEqual(response.status_code, 200)

    def test_can_post(self):
        data = {
            "title": "test",
            "description": "test",
            "due_date": "2023-01-01",
            "user": self.user.id,
        }
        header = login_user(self.user)
        response = self.client.post(self.path, data, **header)
        self.assertEqual(response.status_code, 201)


class TaskDetailViewTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.task = Task.objects.create(
            title="test", description="test", user=self.user, due_date="2023-01-01"
        )
        self.path = reverse("task-detail", args=[self.task.id])

    def test_can_get(self):
        header = login_user(self.user)
        response = self.client.get(self.path, **header)
        self.assertEqual(response.status_code, 200)

    def test_can_put(self):
        data = {
            "title": "test",
            "description": "test",
        }
        header = login_user(self.user)
        response = self.client.put(self.path, data, **header)
        self.assertEqual(response.status_code, 200)

    def test_can_delete(self):
        header = login_user(self.user)
        response = self.client.delete(self.path, **header)
        self.assertEqual(response.status_code, 204)
