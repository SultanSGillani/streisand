from rest_framework import serializers
from forums.models import *
class ForumGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumGroup
        fields = ('old_id','parent','sort_order','name',)


class ForumTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumTopic
        fields = ('old_id','creator','','sort_order','name','description','group','',)


class Serializer(serializers.ModelSerializer):
    class Meta:
        model = 
        fields = ('','is_archived','staff_only_thread_creation','number_of_threads','number_of_posts','latest_post','',)


class ForumThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumThread
        fields = ('old_id','title','is_locked','is_sticky','created_at','created_by','','modified','modified_at','modified_count','modified_by','','topic','','number_of_posts','latest_post','','subscribed_users',)


class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ('old_id','author','','body','created_at','modified','modified_at','modified_count','modified_by','','thread','',)


class ForumReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumReport
        fields = ('reporting_user','','reported_at','reason','thread','','post','','resolved','resolved_by','','date_resolved',)


