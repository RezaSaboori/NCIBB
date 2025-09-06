from django.shortcuts import render
from django.http import HttpResponse


def home(request):
    """Home page view."""
    context = {
        'title': 'NCIBB - Home',
        'page_title': 'Welcome to NCIBB',
    }
    return render(request, 'main/home.html', context)


def about(request):
    """About page view."""
    context = {
        'title': 'NCIBB - About',
        'page_title': 'About NCIBB',
    }
    return render(request, 'main/about.html', context)


def contact(request):
    """Contact page view."""
    context = {
        'title': 'NCIBB - Contact',
        'page_title': 'Contact Us',
    }
    return render(request, 'main/contact.html', context)
