// --- FUNZIONI DI CALCOLO BASE ---

/**
 * @function calcoloImc
 * @description Calcola l'Indice di Massa Corporea (IMC) basandosi sui valori di peso 
 * e altezza forniti dall'utente, gestendo l'unità di misura dell'altezza (cm o metri).
 * Formula: IMC = Peso (kg) / [Altezza (m)]²
 * @returns {number} Il valore IMC calcolato.
 */

function calcoloImc(){
    // Recupera i valori dai campi di input
    const valorePeso =inputPeso.value;
    const valoreAltezza=inputAltezza.value;
    // Converte i valori in numeri
    let peso = Number(valorePeso)
    let altezza = Number(valoreAltezza)
    let altezzaMetri = altezza

    // Conversione da cm a metri se l'unità selezionata è 'cm'
    if (sceltaAltezza.value === 'cm'){
        altezzaMetri= altezza/100
        
    }
    // Esegue il calcolo IMC: Peso / (Altezza in metri al quadrato)
    return peso/altezzaMetri**2
}

/**
 * @function calcolaPesoFormaIdeale
 * @description Calcola l'intervallo di peso ideale basandosi sull'altezza inserita.
 * L'intervallo ideale corrisponde alla classe IMC 'Normopeso' (18.5 - 24.99).
 */
function calcolaPesoFormaIdeale(){
    const valoreAltezza=inputAltezza.value
    let altezza = Number(valoreAltezza)
    let altezzaMetri = altezza

    // Assicura che l'altezza sia in metri
    if (sceltaAltezza.value === 'cm'){
        altezzaMetri = altezza/100
    }

    // Calcolo del peso minimo (IMC 18.5) e peso massimo (IMC 24.99)
    let pesoMin = 18.5*altezzaMetri**2
    let pesoMax = 24.99*altezzaMetri**2

    // Aggiorna gli elementi DOM con i risultati arrotondati
    risultatoPesoMin.innerHTML = pesoMin.toFixed(1)
    risultatoPesoMax.innerHTML = pesoMax.toFixed(1)
}

// --- FUNZIONE DI CLASSIFICAZIONE LOGICA ---

/**
 * @function gestisciClassificazioneIMC
 * @description Determina in quale categoria di classificazione IMC rientra il valore calcolato.
 * Itera su un array globale di regole (regoleDiClassificazione) per trovare l'intervallo corrispondente.
 * @returns {Object|undefined} L'oggetto regola IMC corrispondente, o undefined se non trovata.
 */
function gestisciClassificazioneIMC(){
    // Calcola l'IMC da classificare
    const imc =calcoloImc()
    
    // Itera su tutte le regole di classificazione (es. [18.5-24.9], [< 18.5], [> 40])
    for(const regola of regoleDiClassificazione){
        intervalloStr =regola.intervallo_str;

        // Caso 1: Intervallo numerico (es. "18.5-24.9")
        if (intervalloStr.includes("-")){
            const limitiStr = intervalloStr.trim().split('-')
            const intervalloMin =parseFloat(limitiStr[0])
            const intervalloMax = parseFloat(limitiStr[1])

            // Verifica se l'IMC rientra nell'intervallo [min, max]
            if (imc >= intervalloMin && imc <= intervalloMax){
                return regola
            }
        }
        // Caso 2: Intervallo "minore di" (es. "< 18.5")
        else if (intervalloStr.includes('<')){
            const intervalloMinore =intervalloStr.replace('<','')// Rimuove il simbolo '<'
            const minIMC =parseFloat(intervalloMinore)

            // Verifica se l'IMC è minore del limite
            if (imc < minIMC){
                return regola
            }
        }

        // Caso 3: Intervallo "maggiore di" (es. "> 40")
        else if(intervalloStr.includes('>')){
            const intervalloMaggiore = intervalloStr.replace('>','') // Rimuove il simbolo '>'
            const maxIMC = parseFloat(intervalloMaggiore)

            // Verifica se l'IMC è maggiore o uguale al limite
            if (imc >= maxIMC){
                return regola
            }
        }
    }
    return null
}

// --- FUNZIONE DI GESTIONE EVENTI (CONTROLLER) ---

/**
 * @function gestioneClick
 * @description Funzione principale chiamata al click sul bottone 'Calcola'.
 * Esegue i calcoli IMC e Peso Ideale, gestisce le validazioni e aggiorna l'interfaccia utente.
 */
function gestioneClick(){

    
    const imcCalcolato =calcoloImc();

    // Validazione iniziale per evitare NaN o valori non realistici
    if (isNaN(imcCalcolato)|| imcCalcolato <=0){
        risultatoTesto.innerHTML = "inserisci valori numeri validi (Peso > 0 ,ALtezza > 0"
        return
    }

    // Esegue il calcolo del peso forma ideale
    calcolaPesoFormaIdeale()

    // Esegue la classificazione dopo aver validato l'IMC
    const classificazioneTrovata =gestisciClassificazioneIMC();

    if (classificazioneTrovata){
        // Prepara la stringa di output
        const classe=classificazioneTrovata.classe ||'Nessuna Classe'

        risultatoTesto.innerHTML= `il tuo IMC è: <strong>${imcCalcolato.toFixed(2)}</strong> kg/m²
        sei classificato come: <strong>${classificazioneTrovata.stato}</strong> (classe: <strong>${classe}</strong>)`
    }else{
        // Messaggio di fallback se la classificazione non va a buon fine
        risultatoTesto.innerHTML= 'Classificazione non trovata. controlla i dati inseriti.';
    }
    
}

// --- DICHIARAZIONE VARIABILI GLOBALI e INIZIALIZZAZIONE ---

// Variabili per gli elementi DOM (dichiarate globalmente per l'accesso da tutte le funzioni)

let inputPeso;
let inputAltezza;
let bottoneCalcola;
let risultatoTesto;
let sceltaAltezza;
let risultatoPesoMin;
let risultatoPesoMax;

/**
 * @event DOMContentLoaded
 * @description Esegue il codice una volta che il DOM è completamente caricato. 
 * Inizializza le variabili DOM e imposta il listener per il bottone di calcolo.
 */
document.addEventListener('DOMContentLoaded', () =>{
    // Assegnazione degli elementi DOM
    inputPeso=document.getElementById('input_peso');
    inputAltezza=document.getElementById('input_altezza');
    bottoneCalcola=document.getElementById('bottone_calcola');
    risultatoTesto=document.getElementById('risultato_testo');
    sceltaAltezza = document.getElementById('unita_altezza');
    risultatoPesoMin = document.getElementById('risultato_peso_min');
    risultatoPesoMax = document.getElementById('risultato_peso_max');

    // Imposta l'evento click per avviare la logica principale
    bottoneCalcola.addEventListener('click', gestioneClick);
   
})
    