from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import LoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    # auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/login/", LoginView.as_view(), name="login"),
    # tasks
    path("api/tasks/", include("tasks.urls")),
    # users
    path("api/users/", include("users.urls")),
]
