from django.conf import settings
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenVerifyView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('job.urls')),
    path('api/',include('account.urls')),
    path('api/token/',TokenObtainPairView.as_view()),
    path('api/token/verify',TokenVerifyView.as_view())
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'utils.error_views.handler404'
handler500 = 'utils.error_views.handler500'
