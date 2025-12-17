from django.urls import path
#we combine List and Create
from .views import TicketListCreateAPIView,TicketStatusUpdateAPIView,TicketDetailAPIView

urlpatterns = [
    path("tickets/", TicketListCreateAPIView.as_view(), name="ticket-list-create"),
    path("tickets/<int:pk>/", TicketDetailAPIView.as_view(), name="ticket-detail"),
    path("tickets/<int:pk>/status/", TicketStatusUpdateAPIView.as_view(), name="ticket-status-update"),


]