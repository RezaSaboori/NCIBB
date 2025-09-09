from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from .models import Message, MessageThread, ThreadMessage, Notification
from .serializers import (
    MessageSerializer, 
    MessageCreateSerializer,
    MessageThreadSerializer,
    MessageThreadCreateSerializer,
    ThreadMessageSerializer,
    ThreadMessageCreateSerializer,
    NotificationSerializer,
    InboxSerializer
)
from authentication.permissions import IsOwnerOrAdmin


class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_read', 'sender', 'recipient']
    search_fields = ['subject', 'content']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).distinct()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageCreateSerializer
        return MessageSerializer


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).distinct()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Mark as read if recipient is viewing
        if instance.recipient == request.user:
            instance.mark_as_read()
        return super().retrieve(request, *args, **kwargs)


class MessageThreadListView(generics.ListCreateAPIView):
    serializer_class = MessageThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['subject']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-updated_at']
    
    def get_queryset(self):
        user = self.request.user
        return MessageThread.objects.filter(participants=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MessageThreadCreateSerializer
        return MessageThreadSerializer


class MessageThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return MessageThread.objects.filter(participants=user)


class ThreadMessageListView(generics.ListCreateAPIView):
    serializer_class = ThreadMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering = ['created_at']
    
    def get_queryset(self):
        thread_id = self.kwargs['thread_id']
        user = self.request.user
        
        # Check if user is participant in the thread
        try:
            thread = MessageThread.objects.get(id=thread_id, participants=user)
            return ThreadMessage.objects.filter(thread=thread)
        except MessageThread.DoesNotExist:
            return ThreadMessage.objects.none()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThreadMessageCreateSerializer
        return ThreadMessageSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['thread'] = MessageThread.objects.get(id=self.kwargs['thread_id'])
        return context


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['notification_type', 'is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.mark_as_read()
        return super().retrieve(request, *args, **kwargs)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def inbox_view(request):
    """Get inbox summary with unread counts and recent messages"""
    user = request.user
    
    # Get unread counts
    unread_messages = Message.objects.filter(recipient=user, is_read=False).count()
    unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
    # Get recent messages
    recent_messages = Message.objects.filter(recipient=user).order_by('-created_at')[:5]
    
    # Get recent notifications
    recent_notifications = Notification.objects.filter(user=user).order_by('-created_at')[:5]
    
    data = {
        'unread_messages': unread_messages,
        'unread_notifications': unread_notifications,
        'recent_messages': MessageSerializer(recent_messages, many=True).data,
        'recent_notifications': NotificationSerializer(recent_notifications, many=True).data,
    }
    
    return Response(data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read_view(request):
    """Mark all messages and notifications as read"""
    user = request.user
    
    # Mark all messages as read
    Message.objects.filter(recipient=user, is_read=False).update(is_read=True)
    
    # Mark all notifications as read
    Notification.objects.filter(user=user, is_read=False).update(is_read=True)
    
    return Response({"message": "All messages and notifications marked as read"})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message_view(request):
    """Send a message to another user"""
    serializer = MessageCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        message = serializer.save()
        
        # Create notification for recipient
        Notification.objects.create(
            user=message.recipient,
            notification_type='message',
            title='New Message',
            message=f"You received a new message from {message.sender.get_full_name()}: {message.subject}"
        )
        
        return Response(
            MessageSerializer(message).data, 
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def message_stats_view(request):
    """Get message statistics for dashboard"""
    user = request.user
    
    stats = {
        'total_sent': Message.objects.filter(sender=user).count(),
        'total_received': Message.objects.filter(recipient=user).count(),
        'unread_count': Message.objects.filter(recipient=user, is_read=False).count(),
        'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
    }
    
    return Response(stats)