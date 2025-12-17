from django.contrib.auth.models import User
from rest_framework import generics, permissions, filters
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Ticket
from .permissions import IsStaffOrReadOnly
from .serializers import TicketCreateSerializer,TicketStatusSerializer,TicketListSerializer,RegisterSerializer
from .services import change_ticket_status
from django_filters.rest_framework import DjangoFilterBackend

class TicketListCreateAPIView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TicketCreateSerializer
        return TicketListSerializer

    permission_classes = [permissions.IsAuthenticated]
    queryset = Ticket.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['title', 'category']
    search_fields = ['title', 'created_by__username']
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all().order_by('-created_at')
        return Ticket.objects.filter(created_by=user).order_by('-created_at')

    def perform_create(self, serializer):

        if self.request.user.is_staff:
            raise ValidationError({'status': "You can't create tickets"})
        serializer.save(created_by=self.request.user)





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


class TicketDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketListSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
             return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]