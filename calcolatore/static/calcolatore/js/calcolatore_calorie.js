//PRESSA COMMENTI GENERATI DA GEMINI PERCHÈ IO MI ERO DIMENTICATO A COMMENTARE IL CODICE XD


/**
 * @function trovaAlimentoSelezionato
 * @description recupera l'alimento selezionato dalla lista o dalla barra di ricerca e la quantità inserita.
 * Esegue la validazione dei dati e restituisce l'oggetto alimento e la quantità numerica
 * @return {object|void} un oggetto contenente l'alimento e la quantita oppure termina in caso di errore
*/

function trovaAlimentoSelezionato(){
    //inizializza o resetta il messaggio di errore
    messaggioErrore = '';

    //recupera i valori attuali dai campi di input e dalle variabili globali
    let alimentiSelezionati=selezionaAlimenti.value;
    let quantita=inputQuantita.value;
    let codiceRicerca = '';
    quantitaNumero=parseFloat(quantita) //converte la quantità in numero a virgola mobile

    //determina il codice alimento da ricercare, dando priorità alla selezione del dropdown
    if (alimentiSelezionati){
        codiceRicerca =alimentiSelezionati;
        
    }else if(codiceAlimentoSelezionato){
        codiceRicerca = codiceAlimentoSelezionato; //altrimenti usa il codice salvato dall'autocomplete
       
    }

    //---Validazione: Codice non trovato ---
    if (codiceRicerca == ''){
        messaggioErrore.textContent ='seleziona un alimento dalla lista alimenti oppure cercalo tramite la barra di ricerca'
        return
    }
    //Ricerca l'alimento nel database (DATI_ALIMENTI) usando il codiceRicerca
    let alimentoSelezionato =DATI_ALIMENTI.find((alimento) =>{
        return alimento.codice === codiceRicerca
    })
    //---Validazione: Alimento non presente nel database---
    if (alimentoSelezionato === undefined){
        messaggioErrore.textContent = "alimento non trovato all'interno della tabella seleziona un altro alimento oppure cerca i singoli ingredienti"
        return
    }
    //--- Validazione: quantità non valida---
    if (isNaN(quantitaNumero) || quantitaNumero <= 0){
        messaggioErrore.textContent = 'scrivi una quantita valida per il peso in grammi degli alimenti'
        return
    }
    //---restituisce l'oggetto trovato e la quantità validata
    return {alimentoSelezionato,
            quantitaNumero
    }
}

/**
 * @function aggiungiAlimenti
 * @description Gestisce l'aggiunta di un nuovo alimento alla tabella.
 * Calcola i nutrienti, aggiorna i totali globali e crea la nuova riga nella tabella.
 * @param {Event} event Evento di click (solitamente) che ha scatenato la funzione.
 */

function aggiungiAlimenti(event){

    //Impedisce il comportamento di default del form(es. ricaricare la pagina)
    event.preventDefault()

    //Recupera l'alimento e la quantità validata
    const risultato = trovaAlimentoSelezionato();
    
    //Se TrovaAlimentoSelezionato ha restituito undefined (errore di validazione), esce
    if (risultato === undefined){
        return
    }
    
    const alimento =risultato.alimentoSelezionato;
    const peso = risultato.quantitaNumero
    
    // Calcola i nutrienti per il peso specificato
    let datiCalcolati=calcoloNutrienti(alimento,peso)

    //Aggiorna i totali globali sommando i dati calcolati
    totaleKcal += datiCalcolati.calcoloKcal;
    totaleKj += datiCalcolati.calcoloKj;
    totaleCarboidrati += datiCalcolati.calcoloCarboidrati;
    totaleLipidi += datiCalcolati.calcoloLipidi;
    totaleProteine += datiCalcolati.calcoloProteine;
    //Aggiunge una nuova riga con i dati
    const corpo = tabellaAlimentiAggiunti.querySelector('tbody')
    const nuovaRiga=corpo.insertRow()

    //Popola la nuova riga con i dati
    creaRigaTabella(alimento,peso,datiCalcolati,nuovaRiga)

    //Aggiorna il riepilogo totale (ripartizione calorica e macronutrienti)
    aggiornaRiepiloTotale()

}

/**
 * @function aggiornaRiepiloTotale
 * @description Ricalcola la ripartizione calorica (proteine, carboidrati, lipidi) 
 * basandosi sui totali globali attuali e aggiorna il DOM.
 */
function aggiornaRiepiloTotale(){
   
    //Calcolo delle kcal fornite da ciascun macronutriente (Proteine: 4kcal/g, Carboidrati: 4kcal/g, Lipidi: 9kcal/g)
    const kcalProteine =totaleProteine * 4;
    const kcalCarboidrati = totaleCarboidrati*4;
    const kcalLipidi =totaleLipidi*9;
    const totaleKcal_calcolato = kcalProteine + kcalCarboidrati + kcalLipidi;
    //Calcolo delle percentuali caloriche rispetto al totale kcal
    let percProteine = (kcalProteine/ totaleKcal_calcolato) * 100;
    let percCarboidrati = (kcalCarboidrati/totaleKcal_calcolato)*100;
    let percLipidi = (kcalLipidi/totaleKcal_calcolato)*100;
    
    let feedbackProteine = '';
    let feedbackCarboidrati = '';
    let feedbackLipidi = '';
   
    //gestisce il caso in cui il totaleKcal sia 0 (per evitare divisione per zero e NaN)
    if (totaleKcal_calcolato<= 0){
        percProteine = 0
        percCarboidrati = 0
        percLipidi = 0
        
    }else{
        if(percProteine >= 12 && percProteine <= 20){
        
            feedbackProteine = 'hai assunto la giusta quantità di proteine'
        }else if (percProteine<12){
            
            feedbackProteine= 'assumi più proteine'
        }else{
            feedbackProteine='assumi meno proteine'
        }
        if(percCarboidrati >= 45 && percCarboidrati <= 60){
            feedbackCarboidrati = 'hai assunto la giusta quantità di carboidrati'
        }else if(percCarboidrati<45){
            feedbackCarboidrati= 'assumi più carboidrati'
        }else{
            feedbackCarboidrati='assumi meno carboidrati'
        }
        if(percLipidi>=20 && percLipidi <=25){
            feedbackLipidi = 'hai assunto la giusta quantità di lipidi(grassi)'
        }else if(percLipidi <20){
            feedbackLipidi= 'assumi più lipidi(grassi)'
        }else{
            feedbackLipidi='assumi meno lipidi(grassi)'
        }
    }

    // Aggiorna l'HTML del riepilogo con i totali e le percentuali formattate
    risultatiCalcolo.innerHTML= `
    hai assunto:
    <br>
    kcal: <strong class="valore-principale">${totaleKcal.toFixed(0)} kcal</strong> <br> 
    Carboidrati: <strong>${totaleCarboidrati.toFixed(2)} g (${kcalCarboidrati.toFixed(2)} kcal)</strong> <br>
    lipidi: <strong>${totaleLipidi.toFixed(2)} g (${kcalLipidi.toFixed(2)} kcal)</strong> <br>
    proteine: <strong>${totaleProteine.toFixed(2)} g (${kcalProteine.toFixed(2)} kcal)</strong>
    <br>
    <div id="ripartizione-calorica">
        <strong>Ripartizione Calorica Totale:</strong> <br>
        Carboidrati: <strong>${percCarboidrati.toFixed(1)} %</strong> <br>
        proteine: <strong>${percProteine.toFixed(1)} %</strong> <br>
        lipidi: <strong>${percLipidi.toFixed(1)} %</strong><br>
        <strong>${feedbackCarboidrati}</strong><br>
        <strong>${feedbackProteine}</strong><br>
        <strong>${feedbackLipidi}</strong>
    </div>`
}

/**
 * @function creaRigaTabella
 * @description Crea e popola le celle di una nuova riga nella tabella.
 * Aggiunge i bottoni 'Rimuovi' e 'Modifica' con i rispettivi event listener.
 * @param {Object} alimento L'oggetto alimento selezionato.
 * @param {number} peso La quantità in grammi.
 * @param {Object} datiCalcolati I dati nutrizionali calcolati per quel peso.
 * @param {HTMLTableRowElement} riga L'elemento riga (`<tr>`) appena creato.
 */

function creaRigaTabella(alimento,peso,datiCalcolati,riga){
    //Estrazione dei dati calcolati per chiarezza
    let kcal=datiCalcolati.calcoloKcal
    let kj= datiCalcolati.calcoloKj
    let carboidrati = datiCalcolati.calcoloCarboidrati
    let proteine =datiCalcolati.calcoloProteine
    let lipidi =datiCalcolati.calcoloLipidi

    //--- Creazione e popolamento delle celle---

    //Cella 1: Nome Alimento
    const cellaAlimento=riga.insertCell()
    cellaAlimento.textContent= alimento.nome

    //Cella2: Quantità(Peso)
    const cellaQuantita = riga.insertCell()
    cellaQuantita.textContent=peso

    //Cella 3: Kcal
    const cellaKcal = riga.insertCell()
    cellaKcal.textContent =kcal.toFixed(0);

    //Cella 4: Kj
    const cellaKj=riga.insertCell()
    cellaKj.textContent = kj.toFixed(0)

    //Cella 5: Proteine
    const cellaProteine=riga.insertCell()
    cellaProteine.textContent=proteine.toFixed(2)

    //Cella 6: Carboidrati
    const cellaCarboidrati = riga.insertCell()
    cellaCarboidrati.textContent=carboidrati.toFixed(2)

    //Cella 7: Lipidi
    const cellaLipidi = riga.insertCell()
    cellaLipidi.textContent=lipidi.toFixed(2)

    //cella 8: Azioni(Bottoni)
    const cellaAzioni=riga.insertCell()

    //Bottone Rimuovi
    const bottoneRimuovi = document.createElement('button')
    bottoneRimuovi.textContent='Rimuovi'
    bottoneRimuovi.classList.add('azione-tabella','btn-rimuovi')

    //Aggiunge listener per la rimozione
    bottoneRimuovi.addEventListener('click',() =>{
        rimuoviAlimento(riga,datiCalcolati)
    })

    //Bottone modifica
    const bottoneModificaAlimento = document.createElement('button')
    bottoneModificaAlimento.textContent= 'Modifica'
    bottoneModificaAlimento.classList.add('azione-tabella', 'btn-modifica');

    //aggiunge listener per l'inizio della modifica
    bottoneModificaAlimento.addEventListener('click', () =>{
        const pesoCorrente = parseFloat(riga.cells[1].textContent);
        //Passa la riga, i dati originali (vecchiDati), l'alimento e il peso originale
        modificaAlimento(riga,datiCalcolati,alimento,pesoCorrente)
    })

    //Aggiunge i bottoni alla cella
    cellaAzioni.appendChild(bottoneRimuovi)
    cellaAzioni.appendChild(bottoneModificaAlimento)

}

/**
 * @function rimuoviAlimento
 * @description Gestisce la rimozione di un alimento dalla tabella.
 * Sottrae i dati nutrizionali dal totale globale e rimuove la riga dal DOM.
 * @param {HTMLTableRowElement} riga La riga da rimuovere.
 * @param {Object} dati I dati nutrizionali da sottrarre dai totali.
 */

function rimuoviAlimento(riga,dati){

    //Rimuove la riga del DON
    riga.remove()

    //Sottrae i dati della riga rimossa dei totali globali
    ricalcolaTotali()

}


/**
 * @function modificaAlimento
 * @description Trasforma la cella della quantità (peso) in un campo di input
 * per permettere all'utente di modificare il peso dell'alimento.
 * @param {HTMLTableRowElement} riga La riga da modificare.
 * @param {Object} vecchiDati I dati nutrizionali originali (prima della modifica).
 * @param {Object} alimento L'oggetto alimento.
 * @param {number} vecchioPeso Il peso originale in grammi.
 */

function modificaAlimento(riga,vecchiDati,alimento,vecchioPeso){
    //Seleziona la cella della quantità (indice 1)
    const cellaQuantita = riga.cells[1];

    //Svuota la cella per inserire l'input
    cellaQuantita.innerHTML=''

    //Crea l'elemento input
    const inputPeso = document.createElement('input')
    inputPeso.type = 'number';
    inputPeso.min = '1';
    inputPeso.value=vecchioPeso;
    cellaQuantita.appendChild(inputPeso)

    //Imposta il focus sull'input
    inputPeso.focus()

    //Listener per l'evento tasto 'Invio'
    inputPeso.addEventListener('keydown', (event) =>{
        if (event.key === 'Enter'){
            event.preventDefault()

            const nuovoPesoNumero = parseFloat(inputPeso.value)

            //Validazione del nuovo peso
            if (isNaN(nuovoPesoNumero) || nuovoPesoNumero <= 0){
                cellaQuantita.textContent = vecchioPeso
            }else{
                //Esegue l'aggiornamento se il peso è valido
                eseguiAggiornamentoPeso(riga,vecchiDati,alimento,nuovoPesoNumero)
            }
        }
    })

    //Listener per l'evento 'blur' (quando l'utente esce dal campo)
    inputPeso.addEventListener('blur', () =>{
        //Se l'input è ancora presente nella cella (e non è stato premuto Enter)
        if (cellaQuantita.querySelector('input')){
            cellaQuantita.textContent=vecchioPeso //Ripristina il vecchio peso
        }
    })
}

/**
 * @function eseguiAggiornamentoPeso
 * @description Funzione che esegue l'aggiornamento dei dati della riga dopo la modifica del peso.
 * **(LOGICA CORRETTA PER RISOLVERE IL BUG DEI TOTALI COERENTI)**
 * @param {HTMLTableRowElement} riga La riga da aggiornare.
 * @param {Object} vecchiDati I dati nutrizionali originali (non più usati per la sottrazione, ma mantenuti come argomento).
 * @param {Object} alimento L'oggetto alimento.
 * @param {number} nuovoPeso Il nuovo peso in grammi.
 */
function eseguiAggiornamentoPeso(riga,vecchiDati,alimento,nuovoPeso){
    //1. Calcola i nuovi dati nutrizionali per il nuovo peso
    const nuoviDati=calcoloNutrienti(alimento,nuovoPeso)

    //2. Aggiorna le celle della riga con i nuovi valori
    riga.cells[1].textContent=nuovoPeso;
    riga.cells[2].textContent=nuoviDati.calcoloKcal.toFixed(0);
    riga.cells[3].textContent=nuoviDati.calcoloKj.toFixed(0);
    riga.cells[4].textContent=nuoviDati.calcoloProteine.toFixed(2);
    riga.cells[5].textContent=nuoviDati.calcoloCarboidrati.toFixed(2);
    riga.cells[6].textContent=nuoviDati.calcoloLipidi.toFixed(2);

    //3. Ricalcola tutti i totali leggendo lo stato attuale di TUTTE le righe della tabella
    //Questo garantisce che i totali globali siano sempre coerenti con i dati visibili
    ricalcolaTotali()
   
}

/**
 * @function ricalcolaTotali
 * @description Azzera i totali globali e li ricalcola iterando su ogni riga della tabella.
 * Chiama aggiornaRiepiloTotale() alla fine.
 */
function ricalcolaTotali(){
    // Azzeramento dei totali globali
    totaleKcal=0
    totaleKj=0
    totaleCarboidrati=0
    totaleProteine = 0
    totaleLipidi=0

    // Recupera tutte le righe del corpo tabella
    const corpoTabella =tabellaAlimentiAggiunti.querySelector('tbody')
    const righe=corpoTabella.querySelectorAll('tr')

    // Itera su ogni riga per sommare i valori visibili nelle celle
    righe.forEach(riga => {
        // Kcal (Indice 2)
        const kcalRiga= parseFloat(riga.cells[2].textContent)||0
        totaleKcal += kcalRiga

        // Kj (Indice 3)
        const kjRiga= parseFloat(riga.cells[3].textContent)||0
        totaleKj += kjRiga

        // Proteine (Indice 4)
        const proteineRiga= parseFloat(riga.cells[4].textContent)||0
        totaleProteine += proteineRiga

        // Carboidrati (Indice 5)
        const carboidratiRiga= parseFloat(riga.cells[5].textContent)||0
        totaleCarboidrati += carboidratiRiga

        // Lipidi (Indice 6)
        const lipidiRiga= parseFloat(riga.cells[6].textContent)||0
        totaleLipidi += lipidiRiga

        
    })

    // Aggiorna il riepilogo con i nuovi totali
    aggiornaRiepiloTotale();
    
}
/**
 * @function calcoloNutrienti
 * @description Calcola i dati nutrizionali (Kcal, Kj, macro) per una data quantità,
 * basandosi sui valori per 100g.
 * @param {Object} alimento L'oggetto alimento con i dati per 100g.
 * @param {number} quantita Il peso in grammi da calcolare.
 * @returns {Object} Oggetto con i dati calcolati.
 */

function calcoloNutrienti(alimento,quantita){

    // Parsing dei valori base per 100g
    const kcal= parseInt(alimento.energia_kcal)
    const kj = parseInt(alimento.energia_kj)
    const carboidrati=parseFloat(alimento.carboidrati)
    const lipidi= parseFloat(alimento.lipidi)
    const proteine= parseFloat(alimento.proteine)

    // Calcolo proporzionale per la quantità data: (Valore/100) * Quantità
    let calcoloKcal=(kcal/100)*quantita
    let calcoloKj =(kj/100)*quantita
    let calcoloCarboidrati=(carboidrati/100)*quantita
    let calcoloLipidi=(lipidi/100)*quantita
    let calcoloProteine =(proteine/100)*quantita

    return {calcoloKcal,
        calcoloKj,
        calcoloCarboidrati,
        calcoloLipidi,
        calcoloProteine
    }
}

/**
 * @function filtroAlimenti
 * @description Filtra la lista di alimenti nel dropdown 'selezione_alimento'
 * in base alla categoria selezionata.
 */
function filtroAlimenti(){
    let id_categoria =categoria_alimento.value
    let id_numero = Number(id_categoria)

    // Filtra DATI_ALIMENTI per categoria
    let alimentiFiltrati=DATI_ALIMENTI.filter((alimento) =>{
        return id_numero === Number(alimento.categoria_id)
    })

    // Pulisce il dropdown
    selezionaAlimenti.innerHTML=''

    // Aggiunge l'opzione iniziale
    const opzioneIniziale = document.createElement('option');
    opzioneIniziale.textContent = '--- Seleziona Alimento ---';
    opzioneIniziale.value = '';
    selezionaAlimenti.appendChild(opzioneIniziale);

    // Popola il dropdown con gli alimenti filtrati
    for (alimento of alimentiFiltrati){
        const opzioneAlimento= document.createElement('option')
        opzioneAlimento.textContent = alimento.nome
        opzioneAlimento.value=alimento.codice
        selezionaAlimenti.appendChild(opzioneAlimento)
    }

}

/**
 * @function autocompleteAlimenti
 * @description Gestisce la logica di autocompletamento: filtra i suggerimenti
 * basandosi sul testo nella barra di ricerca e chiama la funzione per mostrarli.
 */
function autocompleteAlimenti(){
    indiceSelezionato = -1; // Reset dell'indice di selezione per tastiera
    codiceAlimentoSelezionato = '' // Reset del codice selezionato

    const testoRicerca = barraRicerca.value.toLowerCase()

    // Se il testo è troppo corto, nasconde i suggerimenti 
    if (testoRicerca.length < 1){
        divSuggerimenti.textContent=''
        mostraSuggerimentiDOM([],'')
        return
    }

    // Filtra gli alimenti che iniziano con il testo digitato
    const suggerimenti=DATI_ALIMENTI.filter(alimento =>{
        const nomeAlimento=alimento.nome.toLowerCase()
        return nomeAlimento.startsWith(testoRicerca)

    }) 
    
    
    // Determina il primo suggerimento per l'autocomplete inline
    let primoSuggerimentoNome = '';

    if (suggerimenti.length > 0){
        primoSuggerimentoNome=suggerimenti[0].nome
    }else{
        primoSuggerimentoNome= '';
    }

    // Mostra i suggerimenti nel DOM
    mostraSuggerimentiDOM(suggerimenti,primoSuggerimentoNome)
    
}

/**
 * @function mostraSuggerimentiDOM
 * @description Aggiorna la lista dei suggerimenti e il suggerimento inline nel DOM.
 * @param {Array<Object>} suggerimenti Array di oggetti alimento da mostrare.
 * @param {string} primoSuggerimento Nome del primo suggerimento per l'autocomplete inline.
 */

function mostraSuggerimentiDOM(suggerimenti,primoSuggerimento){
    // Pulisce il contenitore dei suggerimenti
    divSuggerimenti.innerHTML= '';

    // Se non ci sono suggerimenti, mostra solo il testo digitato
    if (suggerimenti.length === 0){
        testoDigitatoVisibile.textContent=barraRicerca.value
        testoSuggerimento.textContent='';
        return
    }

    // Gestione del suggerimento inline
    if (primoSuggerimento){
        const testoDigitato = barraRicerca.value;
        const testoAggiuntivo = primoSuggerimento.substring(testoDigitato.length);

        testoDigitatoVisibile.textContent=testoDigitato
        testoSuggerimento.textContent=testoAggiuntivo
        
       //Listener per l'autocomplete al click
        suggerimentoInline.onclick = () => {
            const testoCompleto=primoSuggerimento;
            barraRicerca.value = testoCompleto;

            testoSuggerimento.textContent='';
            testoDigitatoVisibile.textContent=testoCompleto;
            
            divSuggerimenti.innerHTML = ''; 
            categoria_alimento.value = '';
            selezionaAlimenti.innerHTML = '';
            
            // Rilancia l'autocomplete per pulire l'interfaccia
            autocompleteAlimenti()
            
        }
    } else {
        // Se non ci sono suggerimenti inline
        suggerimentoInline.textContent = '';
        testoSuggerimento.textContent=''
    }
   
    // Aggiunge gli elementi suggeriti alla lista a discesa
    suggerimenti.forEach(alimento =>{
        const elementoSuggerito= document.createElement('div')
        elementoSuggerito.classList.add('suggerimento-item')
        elementoSuggerito.textContent = alimento.nome;

        // Listener per la selezione di un elemento suggerito al click
        elementoSuggerito.addEventListener('click', () =>{
            const nomeSelezionato= elementoSuggerito.textContent
            barraRicerca.value =nomeSelezionato

            divSuggerimenti.innerHTML=''

            categoria_alimento.value=''
            selezionaAlimenti.innerHTML= ''

            gestisciSelezioneAlimento(nomeSelezionato)

            testoDigitatoVisibile.textContent=nomeSelezionato;
            testoSuggerimento.textContent=''
        })

        divSuggerimenti.appendChild(elementoSuggerito)
    })
    
}

/**
 * @function gestisciSelezioneAlimento
 * @description Finalizza la selezione di un alimento, cercando il codice
 * e pulendo l'interfaccia di autocompletamento e filtro categoria.
 * @param {string} nomeSelezionato Il nome dell'alimento selezionato.
 */

function gestisciSelezioneAlimento(nomeSelezionato){

    barraRicerca.value =nomeSelezionato
    codiceAlimentoSelezionato=''

    // Trova l?alimento per salvare il codice
    const alimentoTrovato=DATI_ALIMENTI.find(alimento => alimento.nome === nomeSelezionato)

    if (alimentoTrovato){
        codiceAlimentoSelezionato=alimentoTrovato.codice
    }

    // Pulizia dell'interfaccia
    divSuggerimenti.innerHTML=''

    categoria_alimento.value=''
    selezionaAlimenti.innerHTML= ''
    
    testoDigitatoVisibile.textContent=nomeSelezionato;
    testoSuggerimento.textContent=''
}


// ---DICHIARAZIONE DELLE VARIABILI GLOBALI ---
// Queste variabili (elementi DOM e totali) sono dichiarate globalmente
//e inizializzate in DOMContentLoaded

let divSuggerimenti;
let messaggioErrore;
let barraRicerca;
let categoria_alimento;
let selezionaAlimenti;
let inputQuantita;
let suggerimentoInline;
let testoDigitatoVisibile;
let testoSuggerimento;
let indiceSelezionato;
let tabellaAlimentiAggiunti;
let risultatiCalcolo;
let bottoneAggiungi;
let totaleKcal;
let totaleKj;
let totaleLipidi;
let totaleCarboidrati;
let totaleProteine;
let codiceAlimentoSelezionato;

/**
 * @event DOMContentLoaded
 * @description Esegue il codice una volta che il DOM è completamente caricato.
 * Inizializza le variabili DOM, i totali e imposta gli event listener.
 */
document.addEventListener('DOMContentLoaded', () =>{

    // --- INIZIALIZZAZIONE VARIABILI DOM ---
    selezionaAlimenti= document.getElementById('selezione_alimento');
    inputQuantita= document.getElementById('inputQuantita');
    categoria_alimento= document.getElementById('categoria_alimento');
    barraRicerca= document.getElementById('barraRicerca');
    messaggioErrore= document.getElementById('messaggioErrore');
    divSuggerimenti= document.getElementById('suggerimentiAutoComplete')
    suggerimentoInline=document.getElementById('suggerimentoInline');
    testoSuggerimento=document.getElementById('testoSuggerimento');
    testoDigitatoVisibile = document.getElementById('testoDigitatoVisibile');
    tabellaAlimentiAggiunti = document.getElementById('tabellaAlimentiAggiunti');
    risultatiCalcolo=document.getElementById('risultatiCalcolo');
    bottoneAggiungi = document.getElementById('bottoneAggiungi');

    // ---INIZIALIZZAZIONE STATO GLOBALE ---
    indiceSelezionato = -1;
    totaleKcal=0;
    totaleKj=0;
    totaleLipidi=0
    totaleCarboidrati =0;
    totaleProteine=0;
    codiceAlimentoSelezionato = '';

    // ---IMPOSTAZIONE EVENTE LISTENER ---

    // Listener per l'input di autocompletamento
    barraRicerca.addEventListener('input',autocompleteAlimenti)

    // Listener per il bottone di aggiunta alimento
    bottoneAggiungi.addEventListener('click', aggiungiAlimenti)

    // Listener per la gestione della tastiera (frecce, invio) nella barra di ricerca
    barraRicerca.addEventListener('keydown',(event) =>{

        const suggerimentiItems = divSuggerimenti.querySelectorAll('.suggerimento-item')
        const numeroSuggerimenti = suggerimentiItems.length;

        //se non ci sono suggerimenti, gestisce solo l'invio per cercare il testo corrente
        if (numeroSuggerimenti === 0){
            if (event.key === 'Enter'){
                gestisciSelezioneAlimento(barraRicerca.value)
                return;
            }
            return;
        }

        //--- GESTIONE FRECCIA GIU ---
        if (event.key === 'ArrowDown'){
            event.preventDefault() // Impedisce lo scroll della pagina

            // Rimuove la selezione precedente
            if (indiceSelezionato > -1){
                suggerimentiItems[indiceSelezionato].classList.remove('suggerimento-selezionato')
            }

            // Calcola il nuovo indice (fa un loop: se siamo all'ultimo andiamo al primo)
            indiceSelezionato = (indiceSelezionato+1) % numeroSuggerimenti;

            // Applica la nuova selezione
            suggerimentiItems[indiceSelezionato].classList.add('suggerimento-selezionato')
        }


        // --- GESTIONE FRECCIA SU  ---

        else if(event.key === 'ArrowUp'){
            event.preventDefault();  // Impedisce lo scroll della pagina

            // Rimuove la selezione precedente
            if(indiceSelezionato > -1){
                suggerimentiItems[indiceSelezionato].classList.remove('suggerimento-selezionato')
            }

            //Calcola il nuovo indice(fa un loop: dal primo all'ultimo)
            if (indiceSelezionato === -1 || indiceSelezionato === 0){
                indiceSelezionato = numeroSuggerimenti -1;
            }else{
                indiceSelezionato--;
            }

            //applica la nuova selezione
            suggerimentiItems[indiceSelezionato].classList.add('suggerimento-selezionato')
        }

        // --- GESTIONE TASTO INVIO (ENTER) ---
        else if (event.key === 'Enter'){
            event.preventDefault() // Impedisce il submit del form

            if(indiceSelezionato > -1){
                // Se un elemento della tendina è evidenziato, lo seleziona
                const nomeSelezionato = suggerimentiItems[indiceSelezionato].textContent
                gestisciSelezioneAlimento(nomeSelezionato)

                // RESET dell'indice dopo la selezione

                indiceSelezionato = -1
            }else{
                // Altrimenti usa la logica del suggerimento inline (se presente) o il testo corrente
                if(testoSuggerimento.textContent){
                    const nomeCompleto=testoDigitatoVisibile.textContent + testoSuggerimento.textContent;
                    gestisciSelezioneAlimento(nomeCompleto)
                }else{
                    const testoCorrente= barraRicerca.value;
                    gestisciSelezioneAlimento(testoCorrente)
                }
            }
        }
    });

    // Inizializza la lista di alimenti al caricamento
    filtroAlimenti()
    aggiornaRiepiloTotale()
})