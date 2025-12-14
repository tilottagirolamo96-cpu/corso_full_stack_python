from django.contrib import admin
from .models import IMC_classificazione,Obesita_viscerale_Rischio,Fabisogno_Energetico,Metabolismo_Basale,Fabisogno_energetico_adolescenti,Tabella_Lavori
# Register your models here.
admin.site.register(IMC_classificazione)
admin.site.register(Obesita_viscerale_Rischio)
admin.site.register(Fabisogno_Energetico)
admin.site.register(Metabolismo_Basale)
admin.site.register(Fabisogno_energetico_adolescenti)
admin.site.register(Tabella_Lavori)
