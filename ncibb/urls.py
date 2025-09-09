"""
URL configuration for NCIBB project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('main.urls')),
    
    # API endpoints
    path('api/auth/', include('authentication.urls')),
    path('api/credits/', include('credits.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/messaging/', include('messaging.urls')),
    path('api/core/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
