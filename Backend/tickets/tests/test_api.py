import pytest
from django.urls import reverse

from rest_framework.test import APIClient
from tickets.models import Ticket
from tickets.tests.conftest import user
@pytest.mark.django_db
def test_authenticated_user_can_create_ticket_via_api(user):
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('ticket_list')
    response = client.post(
        url,
        {
            'title': 'test API Ticket',
            'description': 'Created via API',
            'category': 'TECH',

        },
        format='json',
    )
    assert response.status_code == 201
    assert Ticket.objects.count() == 1
    assert Ticket.objects.first().created_by == user



@pytest.mark.django_db
def test_user_can_login_and_get_jwt(user):
    client = APIClient()
    response = client.post(
        "/api/auth/login/",
        {
            'username': "testuser",
            'password': "1111",
        },
        format='json',
    )
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data




# @pytest.mark.django_db
# def test_user_only_sees_their_own_tickets(user):
#     other_user = User.objects.create_user(
#         username='other_user',
#         email='other@test.com',
#         password='1234'
#     )
#
#     Ticket.objects.create(
#         title='my Ticket',
#         description='Mine',
#         category='TECH',
#         created_by=user,
#     )
#     Ticket.objects.create(
#         title='other Ticket',
#         description='not mine',
#         category='TECH',
#         created_by=other_user,
#     )
#
#     client = APIClient()
#     client.force_authenticate(user=user)
#     url = reverse('ticket_list')
#     response = client.get(url)
#
#     assert response.status_code == 200
#     assert len(response.data) == 1
#     assert response.data[0]['title'] == 'my Ticket'