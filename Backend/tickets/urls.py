from django.urls import path
from .views import TicketCreateAPIView,TicketStatusUpdateAPIView

urlpatterns = [
    path("tickets/", TicketCreateAPIView.as_view(), name="ticket-list-create"),

    path("tickets/<int:pk>/status/", TicketStatusUpdateAPIView.as_view(), name="ticket-status-update"),
]