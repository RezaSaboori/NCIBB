from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Test endpoint
    path('test/', views.test_api, name='test_api'),
    
    # Authentication endpoints
    path('login/', views.simple_login, name='login'),
    path('login-old/', views.CustomTokenObtainPairView.as_view(), name='login_old'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    
    # User endpoints
    path('dashboard/', views.UserDashboardView.as_view(), name='dashboard'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('stats/', views.user_stats_view, name='user_stats'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]
