import json
from django.db.models import Avg
from rest_framework import serializers
from .models import (
    Course, Enrollment, CalendarEvent, Task, 
    TaskSubmission, Department, Topic, Lesson
)
from analytics.models import SystemLog

# --- Supporting Serializers ---

class DepartmentSerializer(serializers.ModelSerializer):
    """Provides metadata for academic department categorization."""
    class Meta:
        model = Department
        fields = ['id', 'name']

class CalendarEventSerializer(serializers.ModelSerializer):
    """Handles course scheduling, including exams and deadlines."""
    course_title = serializers.ReadOnlyField(source='course.title')

    class Meta:
        model = CalendarEvent
        fields = ['id', 'course', 'course_title', 'title', 'start_time', 'end_time', 'is_exam']

class TaskSerializer(serializers.ModelSerializer):
    """Represents graded assignments linked to specific courses."""
    class Meta:
        model = Task
        fields = ['id', 'course', 'title', 'due_date', 'weight']

class SystemLogSerializer(serializers.ModelSerializer):
    """Technical audit trail for system-wide action tracking."""
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SystemLog
        fields = ['id', 'action', 'user', 'user_name', 'timestamp', 'details']
        read_only_fields = fields

# --- Core Logic Serializers ---

class TaskSubmissionSerializer(serializers.ModelSerializer):
    """Manages student work uploads and grading workflows."""
    task_title = serializers.ReadOnlyField(source='task.title')
    course_title = serializers.ReadOnlyField(source='task.course.title')
    student_name = serializers.ReadOnlyField(source='student.username')

    class Meta:
        model = TaskSubmission
        fields = [
            'id', 'task', 'task_title', 'course_title', 'student', 
            'student_name', 'file', 'is_completed', 'progress_percentage', 
            'grade'
        ]
        read_only_fields = ['student']

class CourseSerializer(serializers.ModelSerializer):
    """Base representation of a course with nested read-only topic data."""
    teacher = serializers.StringRelatedField(read_only=True)
    topics = serializers.SerializerMethodField() 

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'code', 'description', 
            'price', 'is_published', 'thumbnail', 'teacher', 'topics'
        ]

    def get_topics(self, obj):
        """Serializes nested topics and their respective lessons for read operations."""
        return [
            {
                "id": topic.id,
                "title": topic.title,
                "lessons": [{"id": l.id, "title": l.title} for l in topic.lessons.all()]
            }
            for topic in obj.topics.all()
        ]

    def validate(self, data):
        """Ensures logical consistency between publishing status and pricing."""
        is_published = data.get('is_published', getattr(self.instance, 'is_published', False))
        price = data.get('price', getattr(self.instance, 'price', 0))

        if is_published and float(price) < 0:
            raise serializers.ValidationError({"price": "Published courses must have a non-negative price."})
        return data 

class LessonSerializer(serializers.ModelSerializer):
    """Detailed representation of a specific learning unit."""
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'lesson_type', 'order']

class TopicSerializer(serializers.ModelSerializer):
    """Groups lessons into modular topics."""
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ['id', 'title', 'lessons', 'order']

class CourseDetailSerializer(serializers.ModelSerializer):
    """Full-depth course data including all nested curriculum structures."""
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'code', 'description', 'topics']
        
    def update(self, instance, validated_data):
        """Synchronizes course attributes and handles atomic updates for topics."""
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance 

class EnrollmentSerializer(serializers.ModelSerializer):
    """Tracks student progress and calculates cumulative performance metrics."""
    student_name = serializers.ReadOnlyField(source='student.username')
    course_title = serializers.ReadOnlyField(source='course.title')
    overall_progress = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'course', 
            'course_title', 'grade', 'overall_progress', 'enrolled_at'
        ]

    def get_overall_progress(self, obj):
        """Aggregates TaskSubmission data to determine total course completion percentage."""
        avg = TaskSubmission.objects.filter(
            student=obj.student, 
            task__course=obj.course
        ).aggregate(Avg('progress_percentage'))['progress_percentage__avg']
        
        return round(avg, 2) if avg is not None else 0
    
class CourseCreateSerializer(serializers.ModelSerializer):
    """Handles bulk creation of a course including nested Topics and Lessons."""
    class Meta:
        model = Course
        fields = ['id', 'title', 'code', 'description', 'price', 'is_published', 'thumbnail']
        read_only_fields = ['teacher']

    def create(self, validated_data):
        """
        Parses multi-part form data to create a course hierarchy.
        Extracts stringified JSON topics and assigns the requesting user as the teacher.
        """
        request = self.context.get('request')
        if not (request and request.user):
            raise serializers.ValidationError("Valid user context required for course creation.")

        # Handle stringified JSON from FormData (standard React/Web behavior)
        topics_raw = request.data.get('topics')
        try:
            topics_data = json.loads(topics_raw) if isinstance(topics_raw, str) else (topics_raw or [])
        except (ValueError, TypeError):
            topics_data = []

        validated_data['teacher'] = request.user
        course = Course.objects.create(**validated_data)

        for topic_item in topics_data:
            lessons_data = topic_item.pop('lessons', [])
            topic = Topic.objects.create(
                course=course, 
                title=topic_item.get('title'), 
                order=topic_item.get('order', 0)
            )
            
            for lesson_item in lessons_data:
                Lesson.objects.create(topic=topic, **lesson_item)
                
        return course