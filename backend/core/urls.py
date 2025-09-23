from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('pages/<slug:page_name>/', views.page_data, name='page_data'),
    path('admin-stats/', views.admin_dashboard_stats, name='admin_stats'),
    path('health/', views.system_health, name='system_health'),
]
