from django.db import models

# Create your models here.

# --- MODELLO 1: Classificazione dell'Indice di Massa Corporea (IMC) ---

class IMC_classificazione(models.Model):

    """
    Modello per memorizzare le categorie di classificazione dell'Indice di Massa Corporea (IMC)
    secondo gli standard internazionali (es. WHO), con i relativi intervalli di valori.
    """
    stato_nutrizione=models.CharField(
        max_length=50,
        unique=True, # Garantisce che ogni stato (es. "Normopeso") sia univoco
        verbose_name='stato di nutrizione'
    )

    classe_obesita=models.CharField(
        max_length=5,
        blank=True, # Il campo può essere vuoto
        null=True,  # Permette valori NULL nel database (utile per stati non classificati come obesità)
        verbose_name='Classe di Obesità'
    )

    intervallo_imc=models.CharField(
        max_length=20,
        verbose_name="IMC(kg/m)" # Stringa che descrive l'intervallo (es. "< 18.5" o "18.5-24.9")
    )

    class Meta:
        verbose_name="Classificazione IMC"
        verbose_name_plural="Classificazione IMC"

    def __str__(self):
        # Rappresentazione leggibile dell'oggetto (utile nell'Admin di Django)
        return f"{self.stato_nutrizione}({self.intervallo_imc})"

# --- MODELLO 2: Rischio di Obesità Viscerale (Circonferenza Addominale) ---

class Obesita_viscerale_Rischio(models.Model):
    
    """
    Modello che definisce le soglie di circonferenza addominale (rischio viscerale)
    differenziate per genere.
    """
    genere = models.CharField(
        max_length=10,
        unique=True, # Ogni genere (Uomini/Donne) avrà una sola riga di soglia
        choices=[('Uomini', 'Uomini'),('Donne','Donne')], # Limita le scelte a questi valori
        verbose_name="Genere"
        )

    circonferenza_addominale_soglia=models.PositiveSmallIntegerField(
        verbose_name="Circonferenza Addominale soglia(cm)" # Valore numerico intero positivo
    )

    condizione_rischio=models.CharField(
        max_length=20,
        verbose_name="Condizione di Rischio" # Descrive la condizione di rischio (es. "Rischio Alto")
    )

    class Meta:
        verbose_name="Rischio Obesità Viscerale"
        verbose_name_plural="Rischio Obesità Viscerale"

    def __str__(self):
        return f"{self.genere}: Rischio Alto con {self.condizione_rischio}"
    
# --- MODELLO 3: Fabbisogno Energetico (LAF) per Adulti e Anziani ---

class Fabisogno_Energetico(models.Model):

    """
    Modello per memorizzare i valori del Livello di Attività Fisica (LAF)
    utilizzati per calcolare il Fabbisogno Energetico negli adulti e negli anziani.
    """
    genere=models.CharField(
        max_length=10,
        unique=False,
        choices=[('Uomini', 'Uomini'),('Donne','Donne')],
        verbose_name='Genere'
    )
    classe_eta=models.CharField(
        null=True,
        blank=True,
        max_length=10,
        verbose_name="classe di età",
    )
    livello_attivita_fisica=models.CharField(
        max_length=20,
        verbose_name='livello_attivita_fisica',
        null=True,
        blank=True
    )

    laf=models.FloatField(
        max_length=10, # Campo numerico decimale per il coefficiente LAF
        verbose_name='LAF',
    )

    class Meta:
        verbose_name='LAF giornalieri per adulti e anziani'
        verbose_name_plural='LAF giornalieri per adulti e anzioni'
    def __str__(self):
        return f'genere: {self.genere} età: {self.classe_eta} livello attività fisica: {self.livello_attivita_fisica} LAF:{self.laf}'
    

# --- MODELLO 4: Fabbisogno Energetico (LAF) per Adolescenti ---

class Fabisogno_energetico_adolescenti(models.Model):

    """
    Modello specifico per i valori del LAF degli adolescenti, che spesso usano
    una classificazione semplificata o diversa rispetto agli adulti.
    """
    classe_eta=models.CharField(
        max_length=10,
        verbose_name="classe di età",
    )
    
    genere=models.CharField(
        max_length=10,
        unique=False,
        choices=[('Maschi', 'Maschi'),('Femmine','Femmine')], # Scelte specifiche per adolescenti
        verbose_name='Genere'
    )

    laf=models.FloatField(
        max_length=10, # Coefficiente LAF numerico decimale
        verbose_name='LAF',
    )

    class Meta:
        verbose_name='LAF giornalieri per Adolescenti'
        verbose_name_plural='LAF giornalieri per Adolescenti'
    def __str__(self):
        return f'genere: {self.genere} età: {self.classe_eta} LAF:{self.laf}'
    
# --- MODELLO 5: Formule per il Metabolismo Basale (MB) ---

class Metabolismo_Basale(models.Model):

    """
    Modello per memorizzare le formule matematiche (come stringhe) utilizzate 
    per calcolare il Metabolismo Basale (MB) in base all'età e al genere.
    """
    eta =models.CharField(
        max_length=10, # Intervallo di età (es. "30-59")
        verbose_name='eta',
    )

    genere=models.CharField(
        max_length=10,
        unique=False,
        choices=[('Uomini', 'Uomini'),('Donne','Donne')],
        verbose_name='Genere',
    )
    kcal_giorno=models.CharField(
        max_length=50, # La formula viene salvata come stringa (es. "11.6 x peso corporeo + 879")
        verbose_name='kcal/giorno',
    )

    
    class Meta:
        verbose_name='metabolismo basale',
        verbose_name_plural='metabolismo basale',
    def __str__(self):
        return f'genere: {self.genere} età: {self.eta} calcolo calorie: {self.kcal_giorno}'
    
# --- MODELLO 6: Associazione Lavoro e Categoria LAF ---

class Tabella_Lavori(models.Model):

    """
    Modello per associare un'attività lavorativa specifica a una categoria di LAF
    (Livello di Attività Fisica) generica (Leggero, Moderato, Pesante).
    """
    lavoro=models.CharField(max_length=100, unique=True) # Nome del lavoro (es. "Impiegato d'ufficio")

    categoria_laf=models.CharField(max_length=20, choices=[
        ('leggero', 'Leggero'),
        ('moderato','Moderato'),
        ('pesante','Pesante'),
    ]) # Categoria LAF associata
    

    def __str__(self):
        return self.lavoro