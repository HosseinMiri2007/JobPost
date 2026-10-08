from django.urls import path
from . import views
urlpatterns = [
    # job view and monitoring
    path("job/", views.getJobs),
    path("job/stats/<str:topic>/", views.getTopicStats),

    # job CRUD
    path("job/new/", views.addjob),
    path("job/update/<str:pk>/", views.updatejob),
    path("job/delete/<str:pk>/", views.deletejob),

    # job others
    path("job/apply/<str:pk>/", views.applyJob),
    path("job/me/apply/", views.getCurrentApplieds),
    path("job/me/check/<str:pk>/", views.isApplied),
    path("job/me/jobs/", views.getCurrentUserJobs),
    path("job/applied/<str:pk>/", views.getCandidatesForJob),

    # dynamic route MUST be after the static routes
    path("job/<str:pk>/", views.getjob),
]