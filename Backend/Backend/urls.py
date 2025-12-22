
from django.contrib import admin
from django.urls import path , include
from rest_framework_simplejwt.views import (

    TokenRefreshView,
)

from tickets.views import RegisterAPIView,MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),


    path('api/auth/register/',RegisterAPIView.as_view(), name='auth_register'),
    path('api/auth/login/',MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('tickets.urls')),
]
