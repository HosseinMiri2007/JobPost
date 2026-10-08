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
    
