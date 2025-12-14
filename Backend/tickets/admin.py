from django.contrib import admin
from .models import Ticket

class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by','status','category','created_at')

    list_filter = ('status', 'category', 'created_at')

    search_fields = ('title', 'description', 'created_by__username')

admin.site.register(Ticket, TicketAdmin)