import pytest
from django.urls import reverse

from rest_framework.test import APIClient
from tickets.models import Ticket
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.mark.django_db
def test_authenticated_user_can_create_ticket_via_api(user):
    client = APIClient()
    login_response = client.post(
    "/api/auth/login/",
    {
            "username": "testuser",
            "password": "1111",

        },
        format="json"

    )
    assert login_response.status_code == 200
    token = login_response.data["access"]

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )
    url = reverse('ticket-list-create')
    response = client.post(
        url,
    {
            "title": "test API Ticket",
            "description": "Created via api",
            "category": "TECH",
        },
        format="json",
    )
    assert response.status_code == 201
    assert Ticket.objects.count() == 1
    assert Ticket.objects.first().created_by == user

@pytest.mark.django_db
def test_user_can_login_and_get_jwt(user):
    client = APIClient()
    login_response = client.post(
    "/api/auth/login/",
    {
            "username": "testuser",
            "password": "1111",
        },
        format="json",
    )
    assert login_response.status_code == 200
    assert "access" in login_response.data
    assert "refresh" in login_response.data


@pytest.mark.django_db
def test_non_staff_cannot_change_ticket_status(user):
    ticket = Ticket.objects.create(
        title="test ticket",
        description="Initial ticket",
        category="TECH",
        created_by=user,
        status="NEW"
    )

    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('ticket-status-update', kwargs={"pk": ticket.pk})

    response = client.patch(
        url,
    {
            "status": "RESOLVED",
    }, format="json",

    )

    assert response.status_code == 403

    ticket.refresh_from_db()
    assert ticket.status == "NEW"

@pytest.mark.django_db
def test_staff_can_change_ticket_status(user):
    staff_user = User.objects.create_user(username='staff', password='1111',is_staff=True)
    ticket = Ticket.objects.create(
        title="Staff test",
        description="Staff changes status",
        category="TECH",
        created_by=user,
        status="NEW"
    )
    client = APIClient()
    client.force_authenticate(user=staff_user)

    url = reverse('ticket-status-update', kwargs={"pk": ticket.pk})

    response = client.patch(
        url,{
            "status": "RESOLVED",

        },
        format="json",
    )
    assert response.status_code == 200
    ticket.refresh_from_db()
    assert ticket.status == "RESOLVED"


@pytest.mark.django_db
def test_user_can_only_see_their_own_tickets(user):
    other_user = User.objects.create_user(username='other', password='1111')
    ticket = Ticket.objects.create(
        title="my ticket",
        description="my description",
        category="TECH",
        created_by=user)
    ticket = Ticket.objects.create(
        title="Other ticket",
        description="other description",
        category="TECH",
        created_by=other_user)
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('ticket-list-create')
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]["title"] == "my ticket"

@pytest.mark.django_db
def test_staff_can_see_all_tickets(user):
    other_user = User.objects.create_user(username='other', password='1111')
    ticket = Ticket.objects.create(
        title="User 1 ticket",
        description="test description",
        category="TECH",
        created_by=user)
    ticket = Ticket.objects.create(
        title="User 2 ticket",
        description="test description",
        category="TECH",
        created_by=other_user)
    staff_user = User.objects.create_user(username='staff', password='1111', is_staff=True)
    client = APIClient()
    client.force_authenticate(user=staff_user)

    url = reverse('ticket-list-create')
    response = client.get(url)
    assert response.status_code == 200
    assert len(response.data['results']) == 2


@pytest.mark.django_db
def test_user_can_create_ticket_withattachement(user):
    client = APIClient()
    client.force_authenticate(user=user)

    dummy_file = SimpleUploadedFile(
        "test_file.txt",
        b"this is some dummy file content",
        content_type="text/plain"
    )

    data = {
        "title": "Attachment title",
        "description": "Testing file upload to cloudinary",
        "category": "TECH",
        "attachment": dummy_file,
    }

    url = reverse('ticket-list-create')
    response = client.post(url, data, format="multipart")

    assert response.status_code == 201
    assert Ticket.objects.count() == 1

    ticket = Ticket.objects.first()
    assert bool(ticket.attachment) is True


    assert ticket.attachment.url is not None