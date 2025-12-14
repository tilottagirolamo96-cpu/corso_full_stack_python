from nutritori.models import TipoAlimenti

def tabelle_alimenti():

    """
    Recupera tutti i tipi di alimenti (categorie) e,
    contemporaneamente, recupera in modo ottimizzato tutti gli alimenti 
    correlati per ciascuna categoria.

    Questo precaricamento previene il problema delle "N+1 query" 
    quando si itera sulle categorie nel template per mostrare gli alimenti di ognuna.

    Returns:
        dict: Un dizionario contenente la chiave 'tipo_alimenti' con il QuerySet ottimizzato.
    """
    
    # 1. Recupera tutti gli oggetti TipoAlimenti (le categorie)
    # 2. Utilizza prefetch_related('alimenti_set'): 
    #    Questo indica a Django di eseguire una query separata per recuperare tutti 
    #    gli oggetti 'Alimenti' (chiamato 'alimenti_set' per convenzione Django) 
    #    collegati tramite ForeignKey e di unirli in memoria.
    tabella_tipo_alimenti=TipoAlimenti.objects.all().prefetch_related('alimenti_set')
    
    # Restituisce il QuerySet ottimizzato all'interno di un dizionario.
    return {'tipo_alimenti':tabella_tipo_alimenti}