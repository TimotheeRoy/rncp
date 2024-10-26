from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import  TokenRefreshView

from users.views import CustomTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    # auth
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # tasks
    path("api/tasks/", include("tasks.urls")),
    # users
    path("api/users/", include("users.urls")),
]
