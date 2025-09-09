from django.urls import path
from . import views

app_name = 'projects'

urlpatterns = [
    # Project endpoints
    path('', views.ProjectListView.as_view(), name='project_list'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('stats/', views.project_stats_view, name='project_stats'),
    path('<int:project_id>/add-collaborator/', views.add_collaborator_view, name='add_collaborator'),
    
    # Project tasks
    path('<int:project_id>/tasks/', views.ProjectTaskListView.as_view(), name='task_list'),
    path('<int:project_id>/tasks/<int:pk>/', views.ProjectTaskDetailView.as_view(), name='task_detail'),
    
    # Project comments
    path('<int:project_id>/comments/', views.ProjectCommentListView.as_view(), name='comment_list'),
    
    # Project files
    path('<int:project_id>/files/', views.ProjectFileListView.as_view(), name='file_list'),
]
