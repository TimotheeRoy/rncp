from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tasks.serializers import TaskAddSerializer, TaskSerializer
from .models import Task


class TasksListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        completed_tasks = user.tasks.filter(completed=True)
        not_completed_tasks = user.tasks.filter(completed=False)
        completed_tasks_data = TaskSerializer(completed_tasks, many=True)
        not_completed_tasks_data = TaskSerializer(not_completed_tasks, many=True)
        return Response({"completed": completed_tasks_data.data, "not_completed": not_completed_tasks_data.data})
    
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
        print(request.data)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        task = Task.objects.get(pk=pk)
        task.delete()
        return Response(status=204)
