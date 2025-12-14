from django.db import models

# Create your models here.

# --- MODELLO 1: Tipi di Alimenti (Categorie) ---

class TipoAlimenti(models.Model):

    """
    Modello per memorizzare le categorie o i gruppi di alimenti (es. Cereali, Frutta, Carne).
    Questo modello è usato come chiave esterna per categorizzare gli alimenti nel modello 'Alimenti'.
    """
    categoria_alimenti = models.CharField(max_length = 100)# Nome della categoria (es. "Latte e Derivati")

    def __str__(self):
        # Rappresentazione leggibile dell'oggetto
        return self.categoria_alimenti

# --- MODELLO 2: Dettaglio Alimenti e Composizione Nutrizionale ---
class Alimenti(models.Model):

    """
    Modello completo che memorizza i dati nutrizionali dettagliati per un singolo alimento.
    Ogni riga rappresenta un alimento specifico con la sua composizione chimica.
    """
    tipo_alimento=models.ForeignKey(
    TipoAlimenti,
    on_delete=models.CASCADE, # Se la categoria TipoAlimenti viene eliminata, elimina tutti gli alimenti associati.
    null=True,# Permette all'alimento di non avere una categoria definita
    blank=True,
    )# Chiave esterna che collega l'alimento alla sua categoria (TipoAlimenti)

    Numero_Codice = models.CharField(max_length = 100, null = True, blank = True) # Codice identificativo univoco dell'alimento (es. codice tabella INRAN)
    alimento = models.CharField(max_length = 200, null = True, blank = True) # Nome dell'alimento (es. "Mela, cruda")

    # --- COMPOSIZIONE GENERALE ---
    parte_edibile =models.IntegerField(null = True, blank = True) # Percentuale di parte commestibile
    acqua= models.FloatField(null = True, blank = True)
    proteine=models.FloatField(null = True, blank = True)
    lipidi=models.FloatField(null = True, blank = True)
    carboidrati=models.FloatField(null = True, blank = True)

    # --- DETTAGLIO CARBOIDRATI E FIBRA ---
    amido=models.FloatField(null = True, blank = True)
    zuccheri_solubili = models.FloatField(null= True, blank = True)
    fibra_alimentare = models.FloatField(null = True, blank= True)

    # --- ENERGIA ---
    energia_kcal=models.IntegerField(null = True, blank= True) # Energia in Kilocalorie
    energia_kj= models.IntegerField(null = True, blank= True) # Energia in Kilojoule

    # --- MINERALI ---
    sodio = models.FloatField(null = True, blank=True)
    potassio = models.FloatField(null = True, blank=True)
    ferro = models.FloatField(null = True, blank=True)
    calcio=models.FloatField(null = True,blank= True)
    fosforo = models.FloatField(null = True,blank= True)

    # --- VITAMINE ---
    tiamina = models.FloatField(null = True, blank=True)
    riboflavina = models.FloatField(null = True,blank = True)
    niacina = models.FloatField(null = True, blank=True)
    vit_a_ret_eg =models.FloatField(null = True, blank=True)
    vitamina_c = models.FloatField(null = True, blank= True)
    vitamina_e = models.FloatField(null = True,blank=True)

    # --- GRASSI SPECIFICI ---
    colesterolo =models.FloatField(null = True, blank = True)



    def __str__(self):
        # Rappresentazione leggibile per l'admin o debug
        return f' categoria: {self.tipo_alimento} Numero codice: {self.Numero_Codice} alimento: {self.alimento}'