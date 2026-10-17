from django.db.models import Avg, Count, Max, Min
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .filters import JobFilter
from .models import Job, JobApplied
from .serializers import JobAppliedSerializer, JobSerializer,CandidateSerializer


@api_view(["GET"])
def getJobs(request):

    filterset = JobFilter(request.GET, queryset=Job.objects.all().order_by("id"))
    paginator = PageNumberPagination()
    resPerPage = 3
    count = filterset.qs.count()
    paginator.page_size = resPerPage
    queryset = paginator.paginate_queryset(filterset.qs, request)
    serializer = JobSerializer(queryset, many=True)
    return Response({"resperpage": resPerPage, "count": count, "job": serializer.data})


@api_view(["GET"])
def getjob(request, pk):
    job = get_object_or_404(Job, id=pk)
    serializer = JobSerializer(job)
    cadidateds = job.jobapply.all().count()

    return Response({"job": serializer.data, "applied": cadidateds})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addjob(request):
    data = request.data.copy()
    data["user"] = request.user.id

    serializer = JobSerializer(data=data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updatejob(request, pk):
    job = get_object_or_404(Job, id=pk)

    if job.user != request.user:
        return Response(
            {"message": "cant update this job"},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = JobSerializer(
        job,
        data=request.data,
        context={"request": request},
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deletejob(request, pk):
    job = get_object_or_404(Job, id=pk)
    if job.user != request.user:
        return Response(
            {"message": "cant delete this job"}, status=status.HTTP_403_FORBIDDEN
        )
    job.delete()
    return Response(
        {"message": f"the job {job} removed successfully"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def getTopicStats(request, topic):
    args = {"title__icontains": topic}
    jobs = Job.objects.filter(**args)
    stats = jobs.aggregate(
        total_jobs=Count("title"),
        avg_positions=Avg("positions"),
        avg_salary=Avg("salary"),
        min_salary=Min("salary"),
        max_salary=Max("salary"),
    )

    return Response(stats)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def applyJob(request, pk):

    user = request.user
    job = get_object_or_404(Job, id=pk)

    if user.userprofile.resume == "":
        return Response(
            {"error": "please upload your resume"}, status=status.HTTP_400_BAD_REQUEST
        )

    if job.last_date < timezone.now():
        return Response(
            {"error": "you can`t apply to this job , date is over"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    alreadyapplied = job.jobapply.filter(user=user).exists()
    if alreadyapplied:
        return Response(
            {"error": "you already applied to this job"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    applyjob = JobApplied.objects.create(
        job=job, user=user, resume=user.userprofile.resume
    )

    return Response({"applied": True, "job_id": applyjob.id}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getCurrentApplieds(request):

    args = {"user_id": request.user.id}

    jobs = JobApplied.objects.filter(**args)

    serializer = JobAppliedSerializer(jobs, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def isApplied(request, pk):

    user = request.user
    job = get_object_or_404(Job, id=pk)

    applied = job.jobapply.filter(user=user).exists()
    return Response(applied)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getCurrentUserJobs(request):

    args = {"user": request.user.id}

    jobs = Job.objects.filter(**args)
    serializer = JobSerializer(jobs, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getCandidatesForJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    if job.user != request.user:
        return Response(
            {"error": "You can not access this job"},
            status=status.HTTP_403_FORBIDDEN,
        )

    applied = job.jobapply.select_related("user")
    serializer = CandidateSerializer(applied, many=True)
    return Response(serializer.data)