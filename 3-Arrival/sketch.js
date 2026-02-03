let nbVehicules = 1;
let target;
let vehicle;
let vehicles = [];

// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont("./assets/inconsolata.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // On crée un véhicule à la position (100, 100)
  vehicle = new Vehicle(100, 100);
  // TODO : à la place de la ligne précédente
  // on crée un tableau de véhicules, au début avec 2 véhicules
  // pour tester le snake
  vehicles.push(vehicle);

  // La cible, ce sera la position de la souris
  target = createVector(random(width), random(height));
}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible à la position de la souris
  push();
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);
  pop();

  // si on a affaire au premier véhicule
  // alors il suit la souris (target)
  let steeringForce;
  // le  véhicule suit la souris avec arrivée
  steeringForce = vehicle.arrive(target);

  // TODO: remplacer le code précédent par une boucle qui fait que:
  // le premier véhicule suit la souris (target)
  // le deuxième véhicule suit le premier véhicule
  // le troisième véhicule suit le deuxième véhicule
  // etc.
  // pour faire ça, on peut utiliser la variable index de la boucle forEach
  // et faire que le véhicule d'index i suive le véhicule d'index i-1
  // avec un comportement d'arrivée : vehicles.forEach((vehicle, index) => {...});

  vehicle.applyForce(steeringForce);
  vehicle.update();
  vehicle.show();
}

function keyPressed() {
  if (key === "d") {
    Vehicle.debug = !Vehicle.debug;
  }
  // todo : touche "s" fait le snake, "v" ajoute un véhicule,
  // "t" passe en mode="texte" etc.
}
