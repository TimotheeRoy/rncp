from django.urls import path

from users.views import CreateUserView, DeleteUserView, RetrieveUserView, UpdateUserView

urlpatterns = [
    path(
        "<int:pk>/",
        RetrieveUserView.as_view(),
        name="user-detail",
    ),
    path(
        "<int:pk>/delete/",
        DeleteUserView.as_view(),
        name="user-delete",
    ),
    path(
        "<int:pk>/update/",
        UpdateUserView.as_view(),
        name="user-update",
    ),
    path(
        "create/",
        CreateUserView.as_view(),
        name="user-create",
    ),
]
