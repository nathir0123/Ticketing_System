from django.db import models
from django.contrib.auth.models import User

class Ticket(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    CATEGORY_CHOICES = [
        ("TECH", "Technical"),
        ("FIN", "Finance"),
        ("PROD", "Product"),
    ]
    category = models.CharField(
        max_length=10,
        choices=CATEGORY_CHOICES,
    )
    STATUS_CHOICES = [
        ("NEW", "New"),
        ("REVIEW", "Under Review"),
        ("RESOLVED", "Resolved"),
    ]

    status =models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="NEW",

    )
    attachment = models.FileField(
        upload_to='attachments/',
        null=True,
        blank=True,
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tickets",
    )
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

