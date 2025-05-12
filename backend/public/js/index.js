// form.js

// Definim un JSON de mòduls per cicle i curs
const moduls = {
    DAM: {
        1: ["Programació",
            "Bases de Dades",
            "Sistemes Informàtics",
            "Entorns de Desenvolupament",
            "Llenguatges de Marques i Sistemes de Gestió de la Informació",
            "Projecte Intermodular I",
            "Anglès Professional I",
            "Itinerari Personal per a l'Ocupabilitat I"],
        2: ["Accés a Dades", 
            "Desenvolupament d'Interfícies", 
            "Programació Multimèdia i Dispositius mòbils",
            "Programació de Serveis i Processos",
            "Sistemes de Gestió Emprssarial",
            "Projecte Intermodular II",
            "Itinerari Personal per a l'Ocupabilitat II"]
    },
    DAW: {
        1: ["Programació",
            "Bases de Dades",
            "Sistemes Informàtics",
            "Entorns de Desenvolupament",
            "Llenguatges de Marques i Sistemes de Gestió de la Informació",
            "Projecte Intermodular I",
            "Anglès Professional I",
            "Itinerari Personal per a l'Ocupabilitat I"],
        2: ["Desenvolupament Web en entorn client",
            "Desenvolupament web en entorn servidor", 
            "Desplegament d'aplicacions web",
            "Disseny d'interfícies web",
            "Projecte Intermodular II",
            "Itinerari Personal per a l'Ocupabilitat II"]
    }
};

// Referències als elements del formulari
const cicleSelect = document.getElementById('cicle');
const cursRadios = document.getElementsByName('curs');
const modulsFieldset = document.getElementById('modulsFieldset');
const form = document.getElementById('matriculaForm');

// Funció per actualitzar els mòduls
function actualitzarModuls() {
    // 
    const cicle = cicleSelect.value;

    // cursRadios és un NodeList (hem fet un getElementsByName), i no un vector
    // Amb l'operador ... (conegut com spread), convertim aquest nodelist en un vector
    // Amb el vector ja podem fer ús del mètode find.
    // 
    // Amb el find(radio=>radio.checked) el que fem és buscar quin dels radios està checked
    // Amb l'opció seleccionada (checked), ens quedem amb el se value (i per tant, ja tenim el curs)
    const curs = [...cursRadios].find(radio => radio.checked)?.value;

    // Si falta informació no fem res
    if (!cicle || !curs) return;


    // Netegem els mòduls anteriors
    modulsFieldset.innerHTML = '<legend>Mòduls</legend>';
    var llistaModulsDiv=document.createElement('div');
    llistaModulsDiv.classList.add("llistaModuls");
    modulsFieldset.appendChild(llistaModulsDiv);

    // Afegir els moduls al formulari
    const nomCurs = curs === "Primer" ? 1 : 2;
    for (const nomModul of moduls[cicle][nomCurs]) {
        // Creem el label
        const label = document.createElement('label');
        label.innerHTML = `<label><input type="checkbox" name="moduls" value="${nomModul}"> ${nomModul}</input></label>`;
        llistaModulsDiv.appendChild(label);
    }
}

// Escoltem canvis en la selecció de cicle/curs
cicleSelect.addEventListener('change', actualitzarModuls);
cursRadios.forEach(radio => radio.addEventListener('change', actualitzarModuls));


// Enviar el formulari
form.addEventListener('submit', async (e) => {
    // Inhibim l'enviament automàtic del formulari
    e.preventDefault();


    // Agafem les dades del formulari en formData, com a parells clau/valir
    const formData = new FormData(form);

    const dadesMatricula = {
        nom: formData.get('nom'),
        cognoms: formData.get('cognoms'),
        Email: formData.get('Email'),
        adreca: formData.get('adreca'),
        telefon: formData.get('telefon'),
        cicle: formData.get('cicle'),
        curs: formData.get('curs'),
        moduls: formData.getAll('moduls')
    };

    // Mostrem les dades per la consola
    console.log("nom: "+ formData.get('nom'));

    const resposta = await fetch('/enviar-matricula', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especifica que enviem JSON
        },
        body: JSON.stringify({dadesMatricula})
    });
    console.log(JSON.stringify({dadesMatricula}))
    if (!resposta.ok) {
        throw new Error('Error en la resposta del servidor');
    }

    // Esperem una resposta tipus blob (PDF, etc.)
        const blob = await resposta.blob();

    // Creem una URL temporal per al blob
        const url = URL.createObjectURL(blob);

    // Creem un enllaç <a> ocult per forçar la descàrrega
        const a = document.createElement('a');
        a.href = url;
        a.download = 'matricula.pdf'; // o el nom que vulguis
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

});
