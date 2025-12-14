from django.shortcuts import render

# Create your views here.
def alimentazione_sana(request):
    return render(request, 'informazioni/alimentazione_sana.html')

def diete(request):
    return render(request, 'informazioni/diete.html')