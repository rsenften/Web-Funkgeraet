from django.shortcuts import render
from .models import Room

def home_view(request):
    return render(request, 'home_view.html', {})


def list_rooms(request):
    return render(request, 'list_rooms.html', {"rooms": Room.objects.all().order_by('room_name')})


def create_rooms(request):
    return render(request, 'create_rooms.html', {})


def create_room(request):
    return render(request, 'create_room.html', {})


def simple_call(request):

    return render(request, 'simple_call.html', {"rooms": Room.objects.all().order_by('room_name')})


def simulator(request):
    return render(request, 'simulator.html', {})


def save_room(request):
    created = {}
    if request.method == "POST":
        rna = request.POST.get("room-name")
        rid = request.POST.get("room-id")
        print("reveiced from GUI: " + rna + " / " + rid)

        exists = Room.objects.filter(room_name=rna)
        if not exists:
            newroom = Room.objects.create(room_name=rna, room_id=rid)
            print("created in DB: " + newroom.room_name + " / " + newroom.room_id)
            created = {"room": {"name": newroom.room_name, "id": newroom.room_id}}
        else:
            created = {"room": {"name": "Room " + rna + " already exists", "id": "not saved"}}
    return render(request, 'save_room.html', created)


def recaptcha_demo(request):
    return render(request, 'recaptcha.html')
