from tickets.models import Ticket,TicketStatusHistory
from django.core.exceptions import ValidationError

def create_ticket(*, title, description , category ,user, attachment = None):
    ticket = Ticket(
        title=title,
        description=description,
        category=category,
        created_by = user,
        attachment=attachment
    )
    ticket.full_clean()
    ticket.save()
    return ticket

ALLOWED_TRANSITIONS = {
    "NEW":["REVIEW","RESOLVED"],
    "REVIEW":["RESOLVED"],
    "RESOLVED":[],
}

def change_ticket_status(*,ticket, new_status, changed_by):
    allowed = ALLOWED_TRANSITIONS.get(ticket.status,[])
    if new_status not in allowed: # if the transition is allowed -> raise error
        raise ValidationError(
            f"cannot change status from {ticket.status} to {new_status}"
                              )

    old_status = ticket.status
    ticket.status = new_status

    ticket.save(update_fields=["status"])
    TicketStatusHistory.objects.create(
        ticket=ticket,
        old_status=old_status,
        new_status=new_status,
        changed_by=changed_by
    )
    return ticket