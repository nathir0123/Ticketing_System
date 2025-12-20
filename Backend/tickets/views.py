from django.contrib.auth.models import User
from rest_framework import generics, permissions, filters
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Ticket
from .permissions import IsStaffOnly
from .serializers import TicketCreateSerializer,TicketStatusSerializer,TicketListSerializer,RegisterSerializer,MyTokenObtainPairSerializer
from .services import change_ticket_status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
class TicketListCreateAPIView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TicketCreateSerializer
        return TicketListSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]
    queryset = Ticket.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['title', 'category']
    search_fields = ['title', 'created_by__username']
    def get_queryset(self):
        user = self.request.user
        # Base Queryset based on role
        if user.is_staff:
            queryset = Ticket.objects.all()
        else:
            queryset = Ticket.objects.filter(created_by=user)

        # Explicit Filtering for Status and Category from Query Params
        status = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if status:
            queryset = queryset.filter(status=status)
        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)

        return queryset.order_by('-created_at','id')

    def perform_create(self, serializer):

        if self.request.user.is_staff:
            raise ValidationError({'detail': "You can't create tickets"})
        serializer.save(created_by=self.request.user)





class TicketStatusUpdateAPIView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketStatusSerializer
    permission_classes = [IsStaffOnly]
    http_method_names = ['patch']

    def perform_update(self, serializer):
        ticket = self.get_object()
        new_status = serializer.validated_data['status']


        change_ticket_status(
            ticket=ticket,
            new_status=new_status,
            changed_by=self.request.user,
        )





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

class MyTokenObtainPairView(TokenObtainPairView):
        serializer_class = MyTokenObtainPairSerializer