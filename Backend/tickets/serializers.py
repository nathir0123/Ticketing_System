from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from tickets.models import Ticket, TicketStatusHistory


class TicketCreateSerializer(serializers.ModelSerializer):
    category = serializers.CharField(required=False,allow_blank=True,allow_null=True,)
    attachment = serializers.FileField(required=False,allow_null=True,)
    class Meta:
        model = Ticket
        fields = ('id','title', 'description','category','attachment','created_at',)
        read_only_fields = ('id','created_at')


class TicketStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.ReadOnlyField(source='changed_by.username')

    class Meta:
        model = TicketStatusHistory
        fields = ('old_status', 'new_status', 'changed_by', 'created_at',)

class TicketListSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    attachment = serializers.SerializerMethodField()
    status_history = TicketStatusHistorySerializer(source='ticket_history', many=True,read_only=True)


    class Meta:
        model = Ticket
        fields = ('id', 'title', 'description', 'category', 'status', 'created_at', 'attachment', 'created_by','status_history')

    def get_attachment(self, obj):
        if not obj.attachment:
            return None

        request = self.context.get('request')
        if request is not None:
            # This forces the URL to include http://res.cloudinary.com or your local domain
            return request.build_absolute_uri(obj.attachment.url)

        return obj.attachment.url


class TicketStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ('status',)



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')


    def create(self, validated_data):
            user = User.objects.create_user(
                validated_data['username'],
                validated_data['email'],
                validated_data['password']
            )
            return user




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (These will show up when you jwtDecode in React)
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token