from rest_framework import serializers
from .models import Project, ProjectTask, ProjectComment, ProjectFile


class ProjectFileSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectFile
        fields = (
            'id', 'name', 'description', 'file', 'file_size',
            'uploaded_by', 'uploaded_by_name', 'created_at'
        )
        read_only_fields = ('id', 'file_size', 'created_at')


class ProjectCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectComment
        fields = (
            'id', 'content', 'author', 'author_name',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProjectTaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectTask
        fields = (
            'id', 'title', 'description', 'status', 'due_date',
            'assigned_to', 'assigned_to_name', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProjectSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    collaborators_names = serializers.StringRelatedField(source='collaborators', many=True, read_only=True)
    tasks = ProjectTaskSerializer(many=True, read_only=True)
    comments = ProjectCommentSerializer(many=True, read_only=True)
    files = ProjectFileSerializer(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = (
            'id', 'title', 'description', 'status', 'priority',
            'start_date', 'end_date', 'budget', 'owner', 'owner_name',
            'collaborators', 'collaborators_names', 'tasks', 'comments',
            'files', 'progress_percentage', 'is_overdue',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProjectListSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    collaborators_count = serializers.SerializerMethodField()
    tasks_count = serializers.SerializerMethodField()
    progress_percentage = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = (
            'id', 'title', 'description', 'status', 'priority',
            'start_date', 'end_date', 'budget', 'owner', 'owner_name',
            'collaborators_count', 'tasks_count', 'progress_percentage',
            'is_overdue', 'created_at', 'updated_at'
        )
    
    def get_collaborators_count(self, obj):
        return obj.collaborators.count()
    
    def get_tasks_count(self, obj):
        return obj.tasks.count()


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            'title', 'description', 'status', 'priority',
            'start_date', 'end_date', 'budget', 'collaborators'
        )
    
    def create(self, validated_data):
        collaborators = validated_data.pop('collaborators', [])
        project = Project.objects.create(**validated_data)
        project.collaborators.set(collaborators)
        return project
    
    def update(self, instance, validated_data):
        collaborators = validated_data.pop('collaborators', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if collaborators is not None:
            instance.collaborators.set(collaborators)
        
        return instance


class ProjectTaskCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ('title', 'description', 'status', 'due_date', 'assigned_to')
    
    def create(self, validated_data):
        validated_data['project'] = self.context['project']
        return super().create(validated_data)


class ProjectCommentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectComment
        fields = ('content',)
    
    def create(self, validated_data):
        validated_data['project'] = self.context['project']
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
