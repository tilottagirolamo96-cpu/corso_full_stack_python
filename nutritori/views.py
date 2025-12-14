from django.shortcuts import render
from nutritori.services.tabelle_alimenti import tabelle_alimenti
# Create your views here.
def tabelle_alimenti_view(request):
    info_tabella_nutrienti=tabelle_alimenti()
        
    return render(request,'nutritori/tabelle_alimenti.html',{
        'info_alimenti':info_tabella_nutrienti
    })