import os
from datetime import *

from django.contrib.auth.models import User
from django.contrib.gis.db import models as gismodels
from django.contrib.gis.geos import Point
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from opencage.geocoder import OpenCageGeocode


class JobType(models.TextChoices):
    Internship = "کارآموزی"
    Permenant = "تمام وقت"
    Temporary = "پاره وقت"


class Education(models.TextChoices):
    No_Education = "بدون تحصیلات"
    Bachelor = "لیسانس"
    Master = "فوق لیسانس"
    Phd = "دکترا"


class Industry(models.TextChoices):
    Business = "کسب و کار"
    It = "فناوری و رایانه"
    Banking = "بانکداری"
    Tahsilat = "تحصیلاتی/تمرینی"
    Telecommunication = "ارتباطات"
    Others = "دیگر"


class Experience(models.TextChoices):
    No_Experience = "بدون سابقه"
    One_Year = "یک سال"
    Two_Year = "دو سال"
    Three_Year_Plus = "سه سال و بیشتر"


def return_last_date():
    now = datetime.now()
    return now + timedelta(days=10)


class Job(models.Model):
    title = models.CharField(max_length=200, null=True)
    description = models.TextField(null=True)
    salary = models.IntegerField(
        default=1000000,
        validators=[MinValueValidator(1000000), MaxValueValidator(1000000000)],
    )
    email = models.EmailField(null=True)
    address = models.CharField(max_length=100, null=True)
    positions = models.IntegerField(default=1)
    company = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_date = models.DateTimeField(default=return_last_date)
    location = gismodels.PointField(default=Point(0.0, 0.0))
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    jobtype = models.CharField(
        max_length=10, choices=JobType.choices, default=JobType.Permenant
    )
    education = models.CharField(
        max_length=20, choices=Education.choices, default=Education.Bachelor
    )
    industry = models.CharField(
        max_length=20, choices=Industry.choices, default=Industry.Business
    )
    experience = models.CharField(
        max_length=20, choices=Experience.choices, default=Experience.No_Experience
    )

    def save(self, *args, **kwargs):
        geocoder = OpenCageGeocode(os.environ.get("GEO_API"))
        results = geocoder.geocode(self.address)
        latitude = results[0]["geometry"]["lat"]
        longitude = results[0]["geometry"]["lng"]
        self.location = Point(longitude, latitude)

        super().save(*args, **kwargs)


class JobApplied(models.Model):
    job = models.ForeignKey(Job, related_name="jobapply", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    resume = models.CharField(max_length=200)
    appliedAt = models.DateTimeField(auto_now_add=True)
