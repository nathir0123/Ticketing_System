import pytest

from tickets.models import Ticket
from tickets.tests.conftest import user
from django.core.exceptions import ValidationError
from tickets.services import change_ticket_status,create_ticket
@pytest.mark.django_db
def test_user_can_create_ticket(user):
    ticket = create_ticket(
        user=user,
        title="Service ticket",
        description="Created via service",
        category="TECH",
    )

    assert isinstance(ticket, Ticket)
    assert ticket.created_by == user
    assert ticket.status == "NEW"
@pytest.mark.django_db
def test_ticket_can_move_from_new_to_review(user):
    ticket = create_ticket(
        user=user,
        title="status ticket",
        description="testing transitions",
        category="TECH",

    )
    change_ticket_status(ticket=ticket, new_status="REVIEW",changed_by=user)
    assert ticket.status == "REVIEW"
# @pytest.mark.django_db
# def test_ticket_cannot_skip_status(user):
#     ticket = create_ticket(
#         user=user,
#         title="Invalid transition",
#         description="Skip transitions",
#         category="TECH",
#     )
#     with pytest.raises(ValidationError):
#         change_ticket_status(ticket=ticket, new_status="RESOLVED")