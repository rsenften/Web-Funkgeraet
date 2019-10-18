from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Channel transmission modes are:
TransmissionMode = (
    ('SIMPLEX', 'Simplex'),
    ('HALF_DUPLEX', 'Half-Duplex'),
    ('DUPLEX', 'Duplex'),
)


# Create your models here.
class Room(models.Model):
    room_name = models.CharField(max_length=80, name='room_name', blank=False)
    room_id = models.CharField(max_length=50, name='room_id', blank=False)
    trans_mode = models.CharField(max_length=20, name='trans_mode',
                                  choices=TransmissionMode,
                                  default="DUPLEX")
    remark = models.TextField(name='remark', blank=True, null=True)
    created = models.DateTimeField(name='created', default=timezone.now)

    class Meta:
        verbose_name = "Room"
        verbose_name_plural = "Rooms"
        ordering = ['room_name']

    def __str__(self):
        return self.room_name


class UserAccessToken(models.Model):
    user = models.ForeignKey(User, name='user', on_delete=models.PROTECT)
    token = models.CharField(max_length=500, name='token', blank=False)

    def __str__(self):
        return self.token
