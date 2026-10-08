from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from .serializers import signUpSerializer, userSerializer
from rest_framework.permissions import IsAuthenticated
from .validators import validate_file_format

@api_view(['POST'])
def register(request):
    data = request.data

    user = signUpSerializer(data=data)

    if user.is_valid():
        if not User.objects.filter(username=user.data['email']).exists():
            user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                username=data['email'],
                email=data['email'],
                password=make_password(data['password']),
            )
            return Response({"message":"کاربر ثبت نام شد"},status=status.HTTP_200_OK)
        else:
            return Response({'error':'کاربر درحال حاضر وجود دارد'},status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(user.errors)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = userSerializer(request.user)
    return Response(user.data)




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user
    data= request.data
    print(data['first_name'],data['last_name'],data['email'],data['password'],data['username'],)
    if data['first_name'] != '':
        user.first_name = data['first_name']
    if data['last_name'] != '': 
        user.last_name = data['last_name']
    if data['email'] != '':
        user.email = data['email']
    if data['username'] != '':
        user.username = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    serializer = userSerializer(user,many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def uploadResume(request):
    
    user = request.user 
    resume = request.FILES['resume']

    if resume == '':
        return Response({'error':'لطفا رزومه خود را بارگذاری کنید'},status=status.HTTP_400_BAD_REQUEST)
    
    isValidFile = validate_file_format(resume.name)

    if not isValidFile:
        return Response({'error':'فقط pdf , png ، jpg آپلود کن'},status=status.HTTP_400_BAD_REQUEST)

    user.userprofile.resume = resume
    user.userprofile.save()
    serializer = userSerializer(user,many=False)
    return Response(serializer.data)