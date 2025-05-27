// Immagine che rimbalza e cambia
// Modificato da: Bouncing ball changing color - The Coding Train / Daniel Shiffman
// Modifiche per mantenere l'aspect ratio e fix per flickering

let x, y, xspeed, yspeed;
let canvas
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
// Assicurati che questi file esistano nella cartella 'bouncingimage'
let imageFiles = ['1.webp', '2.webp', '3.webp','4.webp','5.webp','6.webp','7.webp','8.webp','9.webp','10.webp'];

function preload() {
  for (let i = 0; i < imageFiles.length; i++) {
    images[i] = loadImage('images/bouncingimage/' + imageFiles[i]);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'absolute');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('pointer-events', 'none');

  xspeed = 2;
  yspeed = 7;

  if (images.length > 0) {
    img = images[currentImageIndex];
    updateDisplayDimensions();
  } else {
    console.error("Nessuna immagine caricata! Assicurati che la cartella 'bouncingimage' e i file esistano.");
    fill(255, 0, 0);
    // Se non ci sono immagini, usa queste dimensioni per il placeholder
    // L'utente aveva / 4, lo manteniamo se era intenzionale per un placeholder più piccolo
    displayImgWidth = targetBoxWidth / 4;
    displayImgHeight = targetBoxHeight / 4;
  }

  if (displayImgWidth && displayImgHeight) {
    x = random(displayImgWidth / 2, width - displayImgWidth / 2); // Usa /2 per il posizionamento iniziale standard
    y = random(displayImgHeight / 2, height - displayImgHeight / 2);
  } else {
    x = random(targetBoxWidth / 2, width - targetBoxWidth / 2);
    y = random(targetBoxHeight / 2, height - targetBoxHeight / 2);
  }
}

function draw() {
  background(256,256,256,);

  // Salva le dimensioni di visualizzazione correnti per usarle consistentemente in questo frame
  let FDW = displayImgWidth;  // Frame Display Width
  let FDH = displayImgHeight; // Frame Display Height

  // Mostra l'immagine corrente
  if (img && FDW && FDH) {
    imageMode(CENTER);
    image(img, x, y, FDW, FDH);
  } else {
    rectMode(CENTER); // Assicura che anche il rettangolo di fallback sia centrato
    rect(x, y, FDW, FDH); // Usa FDW/FDH anche per il placeholder se disponibili
                          // o targetBoxWidth, targetBoxHeight se FDW/FDH non sono validi
  }

  let collisionHappened = false;

  // --- Rilevamento Collisioni e Correzione Posizione ---
  // Usa FDW e FDH per la logica di collisione di questo frame

  // Collisione orizzontale
  if (x < FDW / 4) { // La tua logica di collisione usa /4
    xspeed *= -1;
    x = FDW / 4; // Snap: porta il centro dell'immagine esattamente sulla linea di collisione
    collisionHappened = true;
  } else if (x > width - FDW / 4) {
    xspeed *= -1;
    x = width - FDW / 4; // Snap
    collisionHappened = true;
  }

  // Collisione verticale
  if (y < FDH / 4) { // La tua logica di collisione usa /4
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
    changeImage(); // Questa funzione aggiorna img e chiama updateDisplayDimensions(),
                   // quindi displayImgWidth e displayImgHeight saranno nuovi per il prossimo frame.
  }

  // --- Aggiorna Posizione per il Prossimo Frame ---
  x += xspeed;
  y += yspeed;
}

function changeImage() {
  if (images.length > 0) {
    let newIndex = currentImageIndex;
    while (newIndex === currentImageIndex && images.length > 1) {
        newIndex = floor(random(images.length));
    }
    currentImageIndex = newIndex;
    img = images[currentImageIndex];
    updateDisplayDimensions(); // Ricalcola le dimensioni per la nuova immagine
  }
}

function updateDisplayDimensions() {
  if (!img || img.width === 0 || img.height === 0) {
    displayImgWidth = targetBoxWidth; // Fallback se l'immagine non è valida
    displayImgHeight = targetBoxHeight;
    // Se l'utente aveva /4 nel setup per il placeholder e lo vuole anche qui in caso di errore:
    // displayImgWidth = targetBoxWidth / 4;
    // displayImgHeight = targetBoxHeight / 4;
    console.warn("Immagine non valida o dimensioni mancanti, usando dimensioni fallback per il display.");
    return;
  }

  let originalAspectRatio = img.width / img.height;
  let targetBoxAspectRatio = targetBoxWidth / targetBoxHeight;

  if (originalAspectRatio > targetBoxAspectRatio) {
    displayImgWidth = targetBoxWidth;
    displayImgHeight = targetBoxWidth / originalAspectRatio;
  } else {
    displayImgHeight = targetBoxHeight;
    displayImgWidth = targetBoxHeight * originalAspectRatio;
  }


}