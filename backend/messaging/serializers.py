from rest_framework import serializers
from .models import Message, MessageThread, ThreadMessage, Notification


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    
    class Meta:
        model = Message
        fields = (
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'subject', 'content', 'is_read', 'created_at', 'read_at'
        )
        read_only_fields = ('id', 'created_at', 'read_at')


class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('recipient', 'subject', 'content')
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class ThreadMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = ThreadMessage
        fields = (
            'id', 'sender', 'sender_name', 'content', 'is_read',
            'created_at', 'read_at'
        )
        read_only_fields = ('id', 'created_at', 'read_at')


class ThreadMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThreadMessage
        fields = ('content',)
    
    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        validated_data['thread'] = self.context['thread']
        return super().create(validated_data)


class MessageThreadSerializer(serializers.ModelSerializer):
    participants_names = serializers.StringRelatedField(source='participants', many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MessageThread
        fields = (
            'id', 'subject', 'participants', 'participants_names',
            'last_message', 'unread_count', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def get_last_message(self, obj):
        last_msg = obj.last_message
        if last_msg:
            return ThreadMessageSerializer(last_msg).data
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.unread_count(request.user)
        return 0


class MessageThreadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageThread
        fields = ('subject', 'participants')
    
    def create(self, validated_data):
        participants = validated_data.pop('participants', [])
        thread = MessageThread.objects.create(**validated_data)
        thread.participants.set(participants)
        return thread


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            'id', 'notification_type', 'title', 'message',
            'is_read', 'created_at', 'read_at'
        )
        read_only_fields = ('id', 'created_at', 'read_at')


class InboxSerializer(serializers.Serializer):
    """Serializer for inbox summary"""
    unread_messages = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    recent_messages = MessageSerializer(many=True)
    recent_notifications = NotificationSerializer(many=True)
