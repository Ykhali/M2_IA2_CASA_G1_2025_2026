let target, vehicle;
let vehicules = [];
let nbVehicules = 10;
let sliderMaxSpeed, sliderMaxForce;

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(windowWidth, windowHeight);

  // On crée un véhicule à la position (100, 100)
  //vehicle = new Vehicle(100, 100);

  
  // ajouter nb vehicules au tableau dans une boucle
  for (let i = 0; i < nbVehicules; i++) {
    // avec une position random dans le canvas
    vehicules.push(new Vehicle(random(width), random(height)));
  }

  target = createVector(random(width), random(height));

  // On crée un véhicule à une position aléatoire
  //vehicle = new Vehicle(random(width), random(height));

  // Sliders pour régler la vitesse max et la force max
  // On crée le slider et on le positionne
  // Les parametres sont : valeur min, valeur max,
  // valeur initiale, pas
  sliderMaxSpeed = createSlider(1, 20, 4, 1);
  sliderMaxSpeed.position(920, 10);
  sliderMaxSpeed.size(80);

  sliderMaxForce = createSlider(0.01, 2, 0.1, 0.01);
  sliderMaxForce.position(810, 10);
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  background("black");
  target.x = mouseX;
  target.y = mouseY;

  fill("red");
  noStroke();
  circle(target.x, target.y, 32);

  for (let v of vehicules) {
    // On met à jour les limites physiques via les sliders
    v.maxSpeed = sliderMaxSpeed.value();
    v.maxForce = sliderMaxForce.value();

    // je déplace et dessine le véhicule
    v.applyBehaviors(target);
    v.update();
    v.edges();
    v.show();
  }
}
