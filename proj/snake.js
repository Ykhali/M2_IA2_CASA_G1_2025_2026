class Snake extends Vehicle {
    constructor(x, y, index, color) {
        super(x, y);
        this.index = index;
        // Liste des positions précédentes pour l'effet de traînée (optionnel, ou juste suivre le précédent)
        this.history = [];
        this.color = color || color(random(255), random(255), random(255));
    }

    // Surcharge de show pour une apparence différente
    show() {
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.r * 2);

        // Si on a un index > 0, on peut dessiner une ligne vers le précédent dans la liste globale
        // Mais cela nécessite l'accès à la liste globale. 
        // On le fera dans sketch.js ou on passera la référence.
    }

    // Le comportement spécifique du serpent (suivre le précédent) est souvent géré dans le sketch
    // par la logique "Arrive" sur la position du précédent.
}
