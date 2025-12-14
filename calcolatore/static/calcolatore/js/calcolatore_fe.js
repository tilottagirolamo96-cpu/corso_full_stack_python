// --- FUNZIONI DI MAPPATURA ETA'---

/**
 * @function mappaEtaMB
 * @description Mappa l'età fornita dall'utente nella categoria di età utilizzata 
 * dalle formule per il calcolo del Metabolismo Basale (MB).
 * @param {number} input_eta - L'età inserita dall'utente.
 * @returns {string|null} La stringa che rappresenta l'intervallo di età per l'MB, o null se non trovata.
 */

function mappaEtaMB(input_eta){

    if (input_eta < 3){
        return '< 3'
    }else if (input_eta >= 3 && input_eta <= 9){
        return '3-9'
    }else if (input_eta >= 10 && input_eta <= 17){
        return '10-17'
    }else if (input_eta >=18 && input_eta <= 29){
        return '18-29'
    }else if (input_eta >= 30 && input_eta <=59){
        return '30-59'
    }else if (input_eta >= 60 && input_eta <= 74){
        return '60-74'
    }else if (input_eta >=75){
        return '> 75'
}
    // Restituisce null se l'età è al di fuori degli intervalli definiti (anche se i range sopra coprono quasi tutto)
    return null
}

/**
 * @function mappaEtaFE
 * @description Mappa l'età fornita dall'utente nella categoria di età utilizzata 
 * per il Fabbisogno Energetico (FE) / Livello di Attività Fisica (LAF).
 * @param {number} input_eta - L'età inserita dall'utente.
 * @returns {string|null} La stringa che rappresenta l'intervallo di età per il FE, o null se non trovata.
 */
function mappaEtaFE(input_eta){
    if (input_eta >= 10 && input_eta <=13){
        return '10-13'
    }else if(input_eta >=14 && input_eta <= 17){
        return '14-17'
    }else if(input_eta >= 18 && input_eta <=59){
        return '18-59'
    }else if(input_eta >= 60 && input_eta <= 74){
        return '60-74'
    }else if (input_eta >=75){
        return '> 75'
    }
    return null
}

// --- FUNZIONI DI ESTRAZIONE E RICERCA DATI ---

/**
 * @function estraeCoefficienti
 * @description Estrae i coefficienti 'a' e 'b' da una stringa contenente la formula dell'MB 
 * nel formato "a + b x peso corporeo".
 * @param {string} formula_str - La stringa della formula recuperata dal database.
 * @returns {Object} Un oggetto con le proprietà 'a' (coefficiente di moltiplicazione) e 'b' (termine fisso).
 */

function estraeCoefficienti(formula_str){
    // Rimuove la parte testuale per isolare i numeri
    let numeriSeperatiStr =formula_str.replace(' x peso corporeo', '').trim()
    // Separa i due numeri basandosi sul simbolo '+'
    let coefficientiArrayStr=numeriSeperatiStr.split('+')

    // Converte le stringhe in numeri floating point
    const a = parseFloat(coefficientiArrayStr[0])
    const b = parseFloat(coefficientiArrayStr[1])
    return {a: a, b:b};
}

/**
 * @function trovaLafCategoriaLavoro
 * @description Cerca nella tabella dei lavori la categoria LAF (Livello di Attività Fisica)
 * corrispondente al lavoro selezionato dall'utente.
 * @param {string} lavoro_selezionato - Il lavoro selezionato nel form.
 * @returns {string} La categoria LAF associata al lavoro, o 'non specificato' se non trovata.
 */
function trovaLafCategoriaLavoro(lavoro_selezionato){
    // Cerca nella TABELLA_LAVORO l'oggetto corrispondente al lavoro selezionato.
    const rigaTrovata= TABELLA_LAVORO.find(lavoroObj =>{
        const lavoro_cercato = lavoro_selezionato.trim()
        return lavoroObj.lavoro.trim() === lavoro_cercato
    });

    if (rigaTrovata){
        return rigaTrovata.categoria_laf;
    }

    // Gestisce il caso in cui il lavoro non sia trovato
    return 'non specificato'

}

/**
 * @function trovaMbRiga
 * @description Cerca nella tabella del Metabolismo Basale (TABELLA_MB) la riga contenente 
 * la formula per l'intervallo di età mappato e il sesso fornito.
 * @param {string} eta_mappata - L'intervallo di età mappato (es. '30-59').
 * @param {string} sesso - Il sesso ('Uomini' o 'Donne').
 * @returns {Object|undefined} L'oggetto riga del database con la formula, o undefined se non trovata.
 */
function trovaMbRiga(eta_mappata,sesso){
    // Usa find() per trovare la prima riga che corrisponde sia all'età che al sesso
    const rigaMB=TABELLA_MB.find(riga =>{
        return riga.eta === eta_mappata && riga.genere === sesso
    })

    return rigaMB;

}

/**
 * @function trovaLafCoefficiente
 * @description Cerca il coefficiente LAF (numerico) nella TABELLA_LAF.
 * * *Attenzione: La logica di ricerca è potenzialmente errata, usa OR (||) al posto di AND (&&) o una logica più complessa.*
 * * @param {string} eta_mappata - L'intervallo di età mappato per il FE.
 * @param {string} sesso - Il sesso.
 * @param {string} categoria_laf - La categoria LAF (es. 'Leggera').
 * @returns {number|undefined} Il coefficiente LAF numerico, o undefined se non trovato.
 */
function trovaLafCoefficiente(eta_mappata,sesso,categoria_laf){
    //cerca la riga e la trova se tutte e tre le condizioni sono vere
    const rigaLaf = TABELLA_LAF.find(riga =>{
         return riga.eta === eta_mappata && riga.genere === sesso && riga.livello_attivita === categoria_laf
        
    })

    // Pulisce la stringa del coefficiente (sostituisce la virgola con il punto) e la converte in numero
    if(rigaLaf){
        const coeff_str_pulita = rigaLaf.coeff_laf.replace(',', '.')
        const coeff= parseFloat(coeff_str_pulita)

        return coeff
    }
}

// --- FUNZIONE PRINCIPALE DI CALCOLO ---

/**
 * @function CalcoloFabisognoEnergetico
 * @description Esegue il calcolo completo del Metabolismo Basale (MB) e del Fabbisogno Energetico (FE)
 * attraverso una serie di passaggi: mappatura età, ricerca formula MB, calcolo MB, 
 * ricerca categoria LAF e calcolo FE.
 * @param {number} eta - Età dell'utente.
 * @param {string} sesso - Sesso dell'utente.
 * @param {number} peso - Peso corporeo dell'utente.
 * @param {string} lavoro - Lavoro/attività selezionata dall'utente.
 * @returns {Object} Un oggetto contenente i risultati arrotondati (mb, fe) o un messaggio di errore.
 */
function CalcoloFabisognoEnergetico(eta,sesso,peso,lavoro){
    // 1. Mappa l'età e trova la formula MB
    const etaMappataMB= mappaEtaMB(eta);
    const rigaMB =trovaMbRiga(etaMappataMB,sesso)

    if (!rigaMB) return {error: 'Dati Metabolismo Basale non trovati. Controllare età/sesso.'};

    // 2. Estrae i coefficienti 'a' e 'b' e calcola l'MB
    const coeff=estraeCoefficienti(rigaMB.kcal_giorno)
    const mbRisultato = (coeff.a * peso) + coeff.b

    // 3. Trova la categoria LAF basata sul lavoro
    const categoriaLAF = trovaLafCategoriaLavoro(lavoro)

    if (categoriaLAF === 'non specificato') return {error: 'Categoria LAF non Trovata per il lavoro selezionato'};

    // 4. Mappa l'età per la ricerca del FE/LAF
    const etaMappataFE =mappaEtaFE(eta)
    if(!etaMappataFE) return{error: 'Età non supportata per il calcolo FE'}

    // 5. Trova il coefficiente LAF numerico
    const coeffLAF=trovaLafCoefficiente(etaMappataFE,sesso,categoriaLAF)

    // 6. Calcolo del FE: FE = MB * LAF
    const feRisultato = mbRisultato * coeffLAF

    if (!coeffLAF) return {error: 'Coefficiente LAF numerico non trovato.'};

    // 7. Restituisce i risultati arrotondati
    return {
        mb: Math.round(mbRisultato),
        fe: Math.round(feRisultato),

    }
}

// --- FUNZIONE DI GESTIONE EVENTI (CONTROLLER) ---

/**
 * @function gestisciCalcoloFE
 * @description Funzione principale chiamata dall'evento click. 
 * Recupera i dati dal form, li valida, chiama la funzione di calcolo
 * e aggiorna l'interfaccia utente con i risultati o con gli errori.
 * @param {Event} e - L'oggetto Event del click.
 */
function gestisciCalcoloFE(e){

    e.preventDefault(); // Impedisce il comportamento di default (es. submit form)

    // Recupera i valori di input e li converte in numeri o stringhe
    const eta =parseFloat(input_eta_fe.value)
    const peso =parseFloat(input_peso_fe.value)
    const sesso=input_sesso_fe.value
    const lavoro=input_lavoro_fe.value

    // Validazione iniziale dei campi numerici
    if (isNaN(eta) || isNaN(peso) || eta< 0 || peso < 0){
        alert('Per Favore inserisci valori validi per Età e Peso.')
        return;
    }

    // Esegue il calcolo
    const risultati =CalcoloFabisognoEnergetico(eta,sesso,peso,lavoro)

    // Gestione degli errori restituiti dalla funzione di calcolo
    if (risultati.error){
        alert(risultati.error);
        risultato_mb.textContent= "N/D";
        risultato_fe.textContent= "N/D";

    }else{
        // Aggiorna i campi di output con i risultati
        risultato_mb.textContent=risultati.mb
        risultato_fe.textContent=risultati.fe
    }
}

// --- DICHIARAZIONE DELLE VARIABILI GLOBALI (Elementi DOM) ---
let input_eta_fe;
let input_peso_fe;
let input_sesso_fe;
let input_lavoro_fe;
let input_LAF_fe;
let risultato_mb;
let risultato_fe;

/**
 * @event DOMContentLoaded
 * @description Inizializza le variabili DOM e imposta il listener per il bottone di calcolo.
 */
document.addEventListener('DOMContentLoaded', () =>{
    // Assegnazione degli elementi DOM alle variabili
    input_eta_fe=document.getElementById('input_eta_fe');
    input_peso_fe=document.getElementById('input_peso_fe');
    input_sesso_fe=document.getElementById('select_sesso_fe');
    input_lavoro_fe=document.getElementById('select_lavoro_fe');
    input_laf_fe=document.getElementById('select_laf_fe');
    risultato_mb=document.getElementById('risultato_MB');
    risultato_fe=document.getElementById('risultato_MB_LAF');

    const btnCalcola = document.getElementById('btn_calcola_fe')

    // Imposta il listener per l'evento click
    if (btnCalcola){
        btnCalcola.addEventListener('click',gestisciCalcoloFE);
    }
})