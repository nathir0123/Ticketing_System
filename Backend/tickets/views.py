from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Ticket
from .permissions import IsStaffOrReadOnly
from .serializers import TicketCreateSerializer,TicketStatusSerializer
from .services import create_ticket, change_ticket_status

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





class TicketStatusUpdateAPIView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketStatusSerializer
    permission_classes = [IsStaffOrReadOnly]
    http_method_names = ['patch']

    def perform_update(self, serializer):
        ticket = self.get_object()
        new_status = serializer.validated_data['status']

        try:
            change_ticket_status(
                ticket=ticket,
                new_status=new_status
            )
        except Exception as e:
            raise ValidationError({'status': str(e)})

        serializer.save()