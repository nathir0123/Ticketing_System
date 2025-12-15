from rest_framework import serializers
from tickets.models import Ticket

class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ('title', 'description','category')

class TicketListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ('id','title', 'description','category','status','created_at','attachment')