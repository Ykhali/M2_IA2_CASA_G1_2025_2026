class Food {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.r = 15;
        this.lifespan = 600; // 10 seconds
        this.color = color(0, 255, 0);
    }

    update() {
        this.lifespan--;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);

        // Pulsating effect
        let pulse = map(sin(frameCount * 0.1), -1, 1, 0.8, 1.2);
        scale(pulse);

        // Draw Energy Capsule (Procedural for now)
        fill(0, 255, 0, 150);
        stroke(0, 255, 0);
        strokeWeight(2);
        rectMode(CENTER);
        rect(0, 0, 20, 10, 5); // Capsule shape

        // Inner Glow
        noStroke();
        fill(200, 255, 200);
        rect(0, 0, 10, 4, 2);

        pop();
    }

    isDead() {
        return this.lifespan < 0;
    }
}
