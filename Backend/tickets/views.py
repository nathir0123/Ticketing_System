from rest_framework import generics, permissions

from tickets.models import Ticket
from tickets.serializers import TicketCreateSerializer
from tickets.services import create_ticket
class TicketCreateAPIView(generics.CreateAPIView):
    serializer_class = TicketCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        create_ticket(
            user=self.request.user,
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            category=serializer.validated_data['category'],

        )

   #  def get_queryset(self):
   #      return Ticket.objects.filter(created_by=self.request.user)
   #