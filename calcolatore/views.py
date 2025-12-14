from django.shortcuts import render

# Importa le funzioni di servizio che recuperano e riorganizzano i dati dal database.
# Queste funzioni sono state definite nel file 'calcolatore/services/tabelle.py' (o simile).
from calcolatore.services.tabelle import tabella_FE,tabella_MB,tabella_imc,tabella_lavori,tabelle_alimenti

# Create your views here.

# --- VISTA 1: Calcolo IMC (Indice di Massa Corporea) ---
def imc(request):

    """
    Gestisce la visualizzazione della pagina per il calcolo dell'IMC.
    Recupera i dati necessari per la classificazione IMC dal database.

    Args:
        request: L'oggetto HttpRequest.

    Returns:
        HttpResponse: La risposta che renderizza il template 'calcolatore/imc.html'.
    """
    # Chiama la funzione di servizio per ottenere la classificazione IMC e il rischio viscerale.
    info_tabella_imc=tabella_imc()
    
    # Renderizza il template passando i dati recuperati nel contesto.
    return render(request, 'calcolatore/imc.html',{'info_imc':info_tabella_imc,})
   
# --- VISTA 2: Calcolo Nutrizionale Alimenti ---

def calcolo_alimenti(request):

    """
    Gestisce la visualizzazione della pagina per la consultazione e il calcolo dei macronutrienti 
    degli alimenti. Recupera l'elenco degli alimenti e le loro categorie.

    Args:
        request: L'oggetto HttpRequest.

    Returns:
        HttpResponse: La risposta che renderizza il template 'calcolatore/calcolo_alimenti.html'.
    """
    # Chiama la funzione di servizio per recuperare l'elenco degli alimenti e i tipi di alimenti.
    info_tabella_alimenti=tabelle_alimenti()

    # Renderizza il template passando i dati al frontend.
    return render(request, 'calcolatore/calcolo_alimenti.html',{
        'info_alimenti':info_tabella_alimenti
    })

# --- VISTA 3: Visualizzazione Tabelle e Calcolo Fabbisogno Energetico (FE) ---

def tabella_view(request):

    """
    Gestisce la visualizzazione della pagina contenente le tabelle di riferimento 
    per il calcolo del Fabbisogno Energetico (FE) e del Metabolismo Basale (MB).
    Recupera tutti i dati necessari per i calcoli.

    Args:
        request: L'oggetto HttpRequest.

    Returns:
        HttpResponse: La risposta che renderizza il template 'calcolatore/fe.html'.
    """
    # Recupera i dati complessi del Fabbisogno Energetico (LAF per adulti e adolescenti)
    info_tabella_fe=tabella_FE()

    # Recupera i dati e le formule del Metabolismo Basale (MB)
    info_tabella_mb=tabella_MB()

    # Recupera la lista dei lavori e le loro categorie LAF associate
    info_tabella_lavori=tabella_lavori()
    
    # Renderizza il template 'fe.html' passando tutti i dati recuperati nel contesto.
    return render(request,'calcolatore/fe.html',{
        'info_fe':info_tabella_fe,
        'info_mb':info_tabella_mb,
        'info_lavori':info_tabella_lavori
    })
