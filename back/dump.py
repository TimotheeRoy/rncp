import random
from faker import Faker
from users.models import User
from tasks.models import Task


fake = Faker()


def create_users(num_users):
    for _ in range(num_users):
        User.objects.create(
            email=fake.email(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            is_active=fake.boolean(),
            is_staff=fake.boolean(),
        )


def create_tasks(num_tasks):
    users = list(User.objects.all())
    for _ in range(num_tasks):
        Task.objects.create(
            title=fake.sentence(nb_words=6),
            description=fake.paragraph(),
            created_at=fake.date_time(),
            due_date=fake.future_date(),
            completed=fake.boolean(),
            user=random.choice(users),
        )
