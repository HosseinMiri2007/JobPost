from rest_framework import serializers
from .models import Job,JobApplied

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobAppliedSerializer(serializers.ModelSerializer):
    job = JobSerializer()
    class Meta:
        model = JobApplied
        fields = ['user','job','resume','appliedAt']
    

class CandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", default="—")
    first_name = serializers.CharField(source="user.first_name", default="")
    last_name = serializers.CharField(source="user.last_name", default="")

    class Meta:
        model = JobApplied
        fields = ["id", "username", "first_name", "last_name", "resume", "appliedAt"]