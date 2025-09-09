from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from .models import User, UserProfile
from .permissions import CanManageUsers
from .serializers import (
    UserRegistrationSerializer, 
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    UserDashboardSerializer,
    UserSerializer
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_api(request):
    """Test endpoint to verify API is working"""
    return Response({"message": "API is working!", "status": "success"})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def simple_login(request):
    """Simple login endpoint for testing"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {"error": "Email and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate user
        user = authenticate(username=email, password=password)
        
        if user is None:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {"error": "User account is disabled"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_active': user.is_active,
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class UserDashboardView(generics.RetrieveAPIView):
    serializer_class = UserDashboardSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['role', 'is_active', 'is_verified']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'last_login', 'username']
    ordering = ['-created_at']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), CanManageUsers()]
        return [permissions.IsAuthenticated()]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out"}, 
                       status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, 
                       status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats_view(request):
    """
    Get user statistics for dashboard
    """
    user = request.user
    
    # Get user's project stats
    try:
        from projects.models import Project
        project_stats = {
            'total_projects': Project.objects.filter(owner=user).count(),
            'active_projects': Project.objects.filter(owner=user, status='active').count(),
            'completed_projects': Project.objects.filter(owner=user, status='completed').count(),
        }
    except:
        project_stats = {
            'total_projects': 0,
            'active_projects': 0,
            'completed_projects': 0,
        }
    
    # Get user's credit stats
    try:
        credits = user.credits
        credit_stats = {
            'balance': str(credits.balance),
            'total_earned': str(credits.total_earned),
            'total_spent': str(credits.total_spent),
        }
    except:
        credit_stats = {
            'balance': '0.00',
            'total_earned': '0.00',
            'total_spent': '0.00',
        }
    
    # Get recent activity
    try:
        from messaging.models import Message
        recent_messages = Message.objects.filter(recipient=user).order_by('-created_at')[:5]
        recent_activity = [
            {
                'type': 'message',
                'title': msg.subject,
                'description': f"From {msg.sender.get_full_name()}",
                'created_at': msg.created_at,
            }
            for msg in recent_messages
        ]
    except:
        recent_activity = []
    
    return Response({
        'project_stats': project_stats,
        'credit_stats': credit_stats,
        'recent_activity': recent_activity,
    })