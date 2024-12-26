from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken


def make_user():
    user = User.objects.create(
        first_name='testuser',
        last_name='testuser',
        email='testuser@example.com',
    )
    user.set_password("password")  
    user.save()
    return user


def login_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"
    }
