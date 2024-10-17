from django.urls import path

from tasks.views import TaskDetailView, TasksListView


urlpatterns = [
    path(
        "",
        TasksListView.as_view(),
        name="tasks-list",
    ),
    path(
        "<int:pk>/",
        TaskDetailView.as_view(),
        name="task-detail",
    ),
    path(
        "<int:pk>/delete/",
        TaskDetailView.delete,
        name="task-delete",
    ),
    path(
        "<int:pk>/update/",
        TaskDetailView.put,
        name="task-update",
    ),
    path(
        "create/",
        TaskDetailView.post,
        name="task-create",
    ),
]
