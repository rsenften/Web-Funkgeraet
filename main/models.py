from django.db import models
from django.utils import timezone


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

    def __str__(self):
        return self.room_name
