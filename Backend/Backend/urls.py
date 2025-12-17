
from django.contrib import admin
from django.urls import path , include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from tickets.views import RegisterAPIView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('tickets.urls')),

    path('api/auth/register/',RegisterAPIView.as_view(), name='auth_register'),
    path('api/auth/login/',TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
]
