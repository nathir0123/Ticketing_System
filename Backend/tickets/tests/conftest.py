import pytest
from django.contrib.auth.models import User

@pytest.fixture
def user():
    return User.objects.create_user(
        username='user',
        email='test@test.com',
        password='1111'
    )