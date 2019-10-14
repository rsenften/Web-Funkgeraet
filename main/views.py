from django.shortcuts import render


def home_view(request):
    return render(request, 'home_view.html', {})


def create_rooms(request):
    return render(request, 'create_rooms.html', {})


def simple_call(request):
    return render(request, 'simple_call.html', {})


def simulator(request):
    return render(request, 'simulator.html', {})
