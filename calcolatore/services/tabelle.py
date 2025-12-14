from calcolatore.models import Metabolismo_Basale, Fabisogno_Energetico,Fabisogno_energetico_adolescenti,IMC_classificazione,Obesita_viscerale_Rischio,Tabella_Lavori
from nutritori.models import Alimenti,TipoAlimenti
import django

# Permette di eseguire script Django indipendenti.
django.setup()

# ---FUNZIONE TABELLA_MB---
def tabella_MB():
    """
    Recupera i dati del Metabolismo Basale (MB) dal database e li riorganizza
    in un dizionario per una facile visualizzazione basata sull'età.

    Restituisce:
        dict: Un dizionario contenente:
            - 'righe' (dict): Dati MB organizzati per età e genere ('Uomini', 'Donne').
            - 'tabella_mb' (QuerySet): L'oggetto QuerySet originale.
    """
    tabella_metabolismo=Metabolismo_Basale.objects.all() # Recupera tutti gli oggetti MB
    righe ={} # Dizionario vuoto per riorganizzare i dati: {età: {'Uomini': kcal, 'Donne': kcal}}

    for obj in tabella_metabolismo:
        # 1. verifica se l'età è già una chiave del dizionario righe
        if obj.eta not in righe:
            # 2. Se non esiste, inizializza la chiave età con un dizionario vuoto per i generi
            righe[obj.eta] = {'Uomini': '', 'Donne': ''}
        # 3. Assegna il valore Kcal al genere corretto all'interno della chiave età
        righe[obj.eta][obj.genere] = obj.kcal_giorno

    # Restituisce i dati riorganizzati e il QuerySet originale
    return {
        'righe':righe,
        'tabella_mb':tabella_metabolismo,
    }

# --- FUNZIONE TABELLA_FE---
def tabella_FE():
    """
    Recupera i dati del Fabbisogno Energetico (FE) per adulti e adolescenti da due tabelle separate.
    Riorganizza i dati in due strutture distinte per facilitare la creazione di tabelle HTML.

    Restituisce:
        dict: Un dizionario contenente quattro elementi: 
            - 'righe_fe_adulti' (list): Dati adulti formattati come lista di dizionari per riga.
            - 'righe_fe_adolescenti' (dict): Dati adolescenti organizzati per età e genere.
            - 'tabella_fe_adulti' (QuerySet): QuerySet originale adulti.
            - 'tabella_fe_adolescenti' (QuerySet): QuerySet originale adolescenti.
    """

    tabella_Fabisogno_energetico=Fabisogno_Energetico.objects.all()

    tabella_fabisogno_energetico_adolescenti=Fabisogno_energetico_adolescenti.objects.all()

    righe_fe_adulti=[] # Lista di dizionari (ogni elemento è una riga)

    righe_fe_adolescenti={} # Dizionario annidato: {età: {'Maschi': LAF, 'Femmine': LAF}}

    ultimo_genere_adulti= None # Variabile di controllo per l'intestazione del genere

    # Ciclo per formattare i dati degli ADULTI (per visualizzazione riga per riga)
    for obj in tabella_Fabisogno_energetico:

        riga= {
            'genere': '',
            'eta_livello': f'{obj.classe_eta} - {obj.livello_attivita_fisica}',
            'laf': obj.laf
        }

        # Aggiunge il genere solo sulla prima riga di quel gruppo
        if obj.genere != ultimo_genere_adulti:

            riga['genere']=obj.genere

            ultimo_genere_adulti=obj.genere
    
        righe_fe_adulti.append(riga)

    # Ciclo per riorganizzare i dati degli ADOLESCENTI (per visualizzazione incrociata)
    for o in tabella_fabisogno_energetico_adolescenti:
        # Inizializza la chiave età se non presente
        if o.classe_eta not in righe_fe_adolescenti:

            righe_fe_adolescenti[o.classe_eta]={'Maschi':'', 'Femmine': ''}
       # Inserisce il LAF (Livello di Attività Fisica) nel genere corretto
        righe_fe_adolescenti[o.classe_eta][o.genere] = o.laf


    return {

        'righe_fe_adulti':righe_fe_adulti,

        'righe_fe_adolescenti':righe_fe_adolescenti,
        'tabella_fe_adulti':tabella_Fabisogno_energetico,
        'tabella_fe_adolescenti':tabella_fabisogno_energetico_adolescenti,

    }
# ---FUNZIONE TABELLA_IMC---

def tabella_imc():
    """
    Recupera i dati di classificazione dell'Indice di Massa Corporea (IMC)
    e i dati sul rischio di Obesità Viscerale.

    Restituisce:
        dict: Un dizionario contenente:
            - 'classificazione' (QuerySet): Classificazione IMC.
            - 'rischi' (QuerySet): Rischio di Obesità Viscerale.
    """
    classificazione_imc=IMC_classificazione.objects.all()
    rischi_viscerali= Obesita_viscerale_Rischio.objects.all()
  

    return {'classificazione':classificazione_imc,
        'rischi': rischi_viscerali,
    }

# ---FUNZIONE TABELLA_LAVORI---
def tabella_lavori():
    """
    Recupera l'elenco completo dei lavori/attività.

    Restituisce:
        QuerySet: Tutti gli oggetti della Tabella_Lavori.
    """
    lavoro=Tabella_Lavori.objects.all()
    
    return lavoro

# ---FUNZIONE TABELLA_ALIMENTI---
def tabelle_alimenti():
    """
    Recupera l'elenco completo degli Alimenti e dei Tipi di Alimenti.

    Restituisce:
        dict: Un dizionario contenente:
            - 'alimenti' (QuerySet): Tutti gli oggetti Alimenti.
            - 'tipo_alimenti' (QuerySet): Tutti gli oggetti TipoAlimenti.
    """
    tabella_alimenti=Alimenti.objects.all()
    tabella_tipo_alimenti=TipoAlimenti.objects.all()
    
    return {'alimenti':tabella_alimenti,
            'tipo_alimenti':tabella_tipo_alimenti}
