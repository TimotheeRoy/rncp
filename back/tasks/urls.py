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
]
