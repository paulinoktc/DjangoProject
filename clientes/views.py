#from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.
def hello(request):
    return  HttpResponse("hello world");

def about(request):
    return HttpResponse("este es el about");

def clientes(request):
    return render(request,'clientes.html')

def cliente_details(request,id):
    return render(request,'clientDetails.html', {'id': id})