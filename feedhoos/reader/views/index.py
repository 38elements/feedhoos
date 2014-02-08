# coding: utf-8
from django.shortcuts import render


def execute(request):
    return render(request, "index.html", {})
