from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from .models import Page
from .serializers import PageSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def page_data(request, page_name):
    """
    Retrieve data for a specific page.
    """
    try:
        page = Page.objects.get(slug=page_name, is_published=True)
        serializer = PageSerializer(page)
        return Response(serializer.data)
    except Page.DoesNotExist:
        return Response({"error": "Page not found"}, status=404)


User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """Get admin dashboard statistics"""
    if request.user.role != 'admin':
        return Response(
            {"error": "Only administrators can access this endpoint"}, 
            status=403
        )
    
    # Get user statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    verified_users = User.objects.filter(is_verified=True).count()
    
    # Get project statistics
    from apps.projects.models import Project
    total_projects = Project.objects.count()
    active_projects = Project.objects.filter(status='active').count()
    completed_projects = Project.objects.filter(status='completed').count()
    
    # Get credit statistics
    from apps.credits.models import UserCredit
    total_credits = UserCredit.objects.aggregate(
        total=models.Sum('balance')
    )['total'] or 0
    
    # Get message statistics
    from apps.messaging.models import Message
    total_messages = Message.objects.count()
    
    stats = {
        'total_users': total_users,
        'active_users': active_users,
        'verified_users': verified_users,
        'total_projects': total_projects,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
        'total_credits': str(total_credits),
        'total_messages': total_messages,
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_health(request):
    """Get system health information"""
    from django.db import connection
    from django.core.cache import cache
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Check cache
    try:
        cache.set('health_check', 'ok', 10)
        cache_status = "healthy" if cache.get('health_check') == 'ok' else "error"
    except Exception as e:
        cache_status = f"error: {str(e)}"
    
    health_data = {
        'database': db_status,
        'cache': cache_status,
        'timestamp': timezone.now().isoformat(),
    }
    
    return Response(health_data)