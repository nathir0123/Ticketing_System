import pytest
from django.contrib.auth.models import User

@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser',

        password='1111'
    )