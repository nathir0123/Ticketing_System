from datetime import datetime

import pytest
from tickets.models import Ticket
from django.core.exceptions import ValidationError
from tickets.tests.conftest import user
@pytest.mark.django_db
def test_ticket_default_status_is_new(user):

    ticket = Ticket.objects.create(
        title= "Test ticket",
        description= "Test description",
        category= "TECH",
        created_by= user,
    )
    assert ticket.status == "NEW"

@pytest.mark.django_db
def test_ticket_category_must_be_valid(user):

    ticket = Ticket(
        title= "Test ticket",
        description= "Test description",
        category= "INVALID",
        created_by= user,
    )
    with pytest.raises(ValidationError):
        ticket.full_clean()

@pytest.mark.django_db
def test_ticket_has_timestamp(user):
    ticket = Ticket.objects.create(
        title= "Timestamp Test",
        description= "Checking time",
        category= "TECH",
        created_by= user,
    )
    assert ticket.created_at is not None

    assert isinstance(ticket.created_at, datetime)

