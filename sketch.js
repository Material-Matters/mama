// Immagine che rimbalza e cambia
// Modificato da: Bouncing ball changing color - The Coding Train / Daniel Shiffman
// Modifiche per mantenere l'aspect ratio e fix per flickering
// Ulteriori modifiche per responsività e disattivazione su mobile

let x, y, xspeed, yspeed;
let p5Canvas; // Rinominato da 'canvas' per evitare conflitti con l'elemento HTML canvas, sebbene p5 gestisca questo. Buona pratica.
let img; // Variabile per l'immagine corrente
let images = []; // Array per contenere tutte le immagini caricate
let currentImageIndex = 0; // Indice dell'immagine corrente

// Dimensioni desiderate massime per il box dell'immagine
let targetBoxWidth = 200;
let targetBoxHeight = 200;

// Dimensioni effettive di visualizzazione dell'immagine (calcolate per mantenere l'aspect ratio)
let displayImgWidth;
let displayImgHeight;

// Elenco dei nomi dei file delle tue immagini
// Assicurati che questi file esistano nella cartella 'images/bouncingimage/'
let imageFiles = ['1.webp', '2.webp', '3.webp','4.webp','5.webp','6.webp','7.webp','8.webp','9.webp','10.webp'];

let isMobile; // Variabile per memorizzare se l'utente è su un dispositivo mobile

function preload() {
  // Controlla se è un dispositivo mobile prima di caricare le immagini
  // Questo è un controllo preliminare, la logica principale di disattivazione è in setup()
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    for (let i = 0; i < imageFiles.length; i++) {
      images[i] = loadImage('images/bouncingimage/' + imageFiles[i]);
    }
  } else {
    console.log("Sketch disabilitato su dispositivo mobile: precaricamento saltato.");
  }
}

function setup() {
  // Ricontrolla isMobile nel caso in cui navigator.userAgent non fosse disponibile in preload in alcuni contesti rari,
  // o se si vuole centralizzare la logica di abilitazione/disabilitazione qui.
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    console.log("Sketch disabilitato su dispositivo mobile.");
    // Opzionale: mostra un messaggio sulla pagina invece di una canvas vuota
    // createP("Questa animazione è disabilitata sui dispositivi mobili.").center();
    noCanvas(); // Non creare la canvas se è mobile
    return; // Interrompe la funzione setup
  }

  // Crea la canvas usando le dimensioni della finestra del browser
  p5Canvas = createCanvas(windowWidth, windowHeight);
  // Applica gli stili CSS per posizionare la canvas come overlay
  p5Canvas.position(0, 0);
  p5Canvas.style('z-index', '1'); // Assicurati che sia sopra altri contenuti se necessario, o -1 se sotto.
  p5Canvas.style('position', 'absolute'); // Posizionamento assoluto rispetto al body o al contenitore relativo più vicino
  p5Canvas.style('top', '0');
  p5Canvas.style('left', '0');
  p5Canvas.style('pointer-events', 'none'); // Permette di cliccare attraverso la canvas

  xspeed = 1;
  yspeed = 3;

  if (images.length > 0) {
    img = images[currentImageIndex];
    updateDisplayDimensions();
  } else {
    console.error("Nessuna immagine caricata! Assicurati che la cartella 'images/bouncingimage' e i file esistano, o che non sei su mobile.");
    // Se non ci sono immagini, usa queste dimensioni per il placeholder
    displayImgWidth = targetBoxWidth / 4;
    displayImgHeight = targetBoxHeight / 4;
  }

  // Inizializza la posizione dell'immagine
  // Assicurati che displayImgWidth e displayImgHeight siano definiti
  if (displayImgWidth && displayImgHeight) {
    x = random(displayImgWidth / 2, width - displayImgWidth / 2);
    y = random(displayImgHeight / 2, height - displayImgHeight / 2);
  } else {
    // Fallback se le dimensioni non sono state calcolate (es. errore caricamento immagini)
    x = random(targetBoxWidth / 2, width - targetBoxWidth / 2);
    y = random(targetBoxHeight / 2, height - targetBoxHeight / 2);
  }
}

function draw() {
  if (isMobile) {
    return; // Non eseguire la logica di disegno se è mobile
  }

  clear(); // Pulisce la canvas ad ogni frame, necessario per l'animazione e la trasparenza

  // Salva le dimensioni di visualizzazione correnti per usarle consistentemente in questo frame
  let FDW = displayImgWidth;  // Frame Display Width
  let FDH = displayImgHeight; // Frame Display Height

  // Mostra l'immagine corrente o un placeholder
  if (img && FDW && FDH) {
    imageMode(CENTER);
    image(img, x, y, FDW, FDH);
  } else if (FDW && FDH) { // Se img non è definita ma le dimensioni sì (placeholder)
    rectMode(CENTER);
    fill(150); // Colore per il placeholder
    noStroke();
    rect(x, y, FDW, FDH);
  }

  // Se FDW o FDH non sono definiti (improbabile dopo setup, ma per sicurezza)
  if (!FDW || !FDH) return;

  let collisionHappened = false;

  // --- Rilevamento Collisioni e Correzione Posizione ---
  // Usa FDW e FDH per la logica di collisione di questo frame

  // Collisione orizzontale
  if (x < FDW / 4) {
    xspeed *= -1;
    x = FDW / 4; // Snap
    collisionHappened = true;
  } else if (x > width - FDW / 4) {
    xspeed *= -1;
    x = width - FDW / 4; // Snap
    collisionHappened = true;
  }

  // Collisione verticale
  if (y < FDH / 4) {
    yspeed *= -1;
    y = FDH / 4; // Snap
    collisionHappened = true;
  } else if (y > height - FDH / 4) {
    yspeed *= -1;
    y = height - FDH / 4; // Snap
    collisionHappened = true;
  }

  // --- Gestione Cambio Immagine ---
  if (collisionHappened) {
    changeImage();
  }

  // --- Aggiorna Posizione per il Prossimo Frame ---
  x += xspeed;
  y += yspeed;
}

function changeImage() {
  if (isMobile || images.length === 0) return; // Non fare nulla se mobile o non ci sono immagini

  let newIndex = currentImageIndex;
  // Assicura che la nuova immagine sia diversa dalla corrente, se ci sono più immagini
  while (newIndex === currentImageIndex && images.length > 1) {
      newIndex = floor(random(images.length));
  }
  currentImageIndex = newIndex;
  img = images[currentImageIndex];
  updateDisplayDimensions(); // Ricalcola le dimensioni per la nuova immagine
}

function updateDisplayDimensions() {
  if (isMobile || !img || img.width === 0 || img.height === 0) {
    // Se l'immagine non è valida o siamo su mobile (anche se non dovrebbe arrivare qui se mobile)
    // Imposta dimensioni di fallback o quelle del placeholder originale
    displayImgWidth = targetBoxWidth / 4; // Coerente con il fallback in setup se le immagini non sono caricate
    displayImgHeight = targetBoxHeight / 4;
    if (!isMobile) { // Logga l'avviso solo se non siamo su mobile (su mobile è atteso)
        console.warn("Immagine non valida o dimensioni mancanti, usando dimensioni fallback per il display.");
    }
    return;
  }

  let originalAspectRatio = img.width / img.height;
  let targetBoxAspectRatio = targetBoxWidth / targetBoxHeight;

  // Calcola le dimensioni di visualizzazione mantenendo l'aspect ratio
  // e adattandole al targetBox
  if (originalAspectRatio > targetBoxAspectRatio) {
    // L'immagine è più larga (o meno alta) del box target
    displayImgWidth = targetBoxWidth;
    displayImgHeight = targetBoxWidth / originalAspectRatio;
  } else {
    // L'immagine è più alta (o meno larga) del box target
    displayImgHeight = targetBoxHeight;
    displayImgWidth = targetBoxHeight * originalAspectRatio;
  }
}

// Funzione chiamata automaticamente da p5.js quando la finestra del browser viene ridimensionata
function windowResized() {
  if (isMobile) {
    // Se è mobile e per qualche motivo la canvas esiste, rimuovila.
    // O semplicemente non fare nulla per il resize.
    if (p5Canvas) {
        remove(); // Rimuove la canvas e ferma il loop di draw
    }
    return;
  }

  // Ridimensiona la canvas per adattarla alla nuova dimensione della finestra
  resizeCanvas(windowWidth, windowHeight);

  // Non è strettamente necessario ricalcolare la posizione x, y qui,
  // perché il movimento e le collisioni si adatteranno naturalmente
  // alle nuove 'width' e 'height' della canvas nel loop di draw.
  // Anche updateDisplayDimensions() non è necessario qui perché
  // targetBoxWidth e targetBoxHeight sono fissi.
  // Se la logica di posizionamento o le dimensioni dell'immagine dipendessero
  // direttamente dalle dimensioni della finestra, andrebbero aggiornate qui.
}