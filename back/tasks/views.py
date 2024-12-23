
from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tasks.serializers import TaskAddSerializer, TaskSerializer
from .models import Task


class TaskNameSearchFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        print("searching")
        search = request.query_params.get("search", None)
        if search:
            return queryset.filter(title__icontains=search).distinct()
        return queryset

class TasksListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [TaskNameSearchFilter]
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return user.tasks.order_by("due_date")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        completed = queryset.filter(completed=True)
        not_completed = queryset.filter(completed=False)
        completed_data = self.get_serializer(completed, many=True).data
        not_completed_data = self.get_serializer(not_completed, many=True).data
        return Response({"completed" : completed_data, "not_completed": not_completed_data})

    
    def post(self, request):
        serializer = TaskAddSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TaskDetailView(APIView):
    def get(self, request, pk):
        task = Task.objects.get(pk=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = Task.objects.get(pk=pk)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        task = Task.objects.get(pk=pk)
        task.delete()
        return Response(status=204)
