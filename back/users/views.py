from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User
from users.serializers import UserSerializer



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email, is_active=True).first()
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=401)
        
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_id': user.id
                }, status=200)
        return Response({'message': 'Invalid credentials'}, status=401) 


class CreateUserView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
            email = request.data.get('email')
            password = request.data.get('password')
            user = User.objects.filter(email=email).first()
            
            if user:
                if not user.is_active:
                    user.is_active = True
                    user.password = make_password(password)
                    user.save()
                    return Response(UserSerializer(user).data, status=200)
                else:
                    return Response({'message': 'User already exists'}, status=400)
            
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                user.set_password(password)
                user.save()
                return Response(UserSerializer(user).data, status=201)
        
            return Response(serializer.errors, status=400)


class RetrieveUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
        


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_active = False
        user.save()
        return Response(status=204)