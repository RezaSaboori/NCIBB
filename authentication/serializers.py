from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'password', 'password_confirm', 'phone', 'role'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'bio', 'organization', 'website', 'location', 'birth_date',
            'created_at', 'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at')


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    get_full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'avatar', 'is_verified', 'is_active',
            'created_at', 'updated_at', 'profile', 'get_full_name'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'is_verified')


class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password')


class UserDashboardSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    get_full_name = serializers.ReadOnlyField()
    
    # Additional dashboard data
    credits = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    recent_messages = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'avatar', 'is_verified', 'is_active',
            'created_at', 'updated_at', 'profile', 'get_full_name',
            'credits', 'projects', 'recent_messages'
        )
    
    def get_credits(self, obj):
        try:
            credits = obj.credits
            return {
                'balance': str(credits.balance),
                'total_earned': str(credits.total_earned),
                'total_spent': str(credits.total_spent),
            }
        except:
            return {
                'balance': '0.00',
                'total_earned': '0.00',
                'total_spent': '0.00',
            }
    
    def get_projects(self, obj):
        try:
            from projects.models import Project
            active_projects = Project.objects.filter(owner=obj, status='active').count()
            total_projects = Project.objects.filter(owner=obj).count()
            return {
                'active_count': active_projects,
                'total_count': total_projects,
            }
        except:
            return {
                'active_count': 0,
                'total_count': 0,
            }
    
    def get_recent_messages(self, obj):
        try:
            from messaging.models import Message
            messages = Message.objects.filter(recipient=obj).order_by('-created_at')[:5]
            return [
                {
                    'id': msg.id,
                    'subject': msg.subject,
                    'sender_name': msg.sender.get_full_name(),
                    'created_at': msg.created_at,
                    'is_read': msg.is_read,
                }
                for msg in messages
            ]
        except:
            return []
