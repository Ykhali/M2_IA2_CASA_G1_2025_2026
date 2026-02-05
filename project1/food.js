class Food {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.r = 15;
        this.lifespan = 600; // 10 seconds
        this.type = type || 'ENERGY'; // 'ENERGY' or 'BIOMASS'

        if (this.type === 'ENERGY') {
            this.color = color(0, 255, 0); // Green
        } else {
            this.color = color(255, 0, 255); // Purple for Biomass
        }
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
        fill(this.type === 'ENERGY' ? color(0, 255, 0, 150) : color(255, 0, 255, 150));
        stroke(this.color);
        strokeWeight(2);
        rectMode(CENTER);

        if (this.type === 'ENERGY') {
            rect(0, 0, 20, 10, 5); // Capsule shape
            noStroke();
            fill(200, 255, 200);
            rect(0, 0, 10, 4, 2);
        } else {
            // Biomass shape (Circle/Blob)
            ellipse(0, 0, 15, 15);
            noStroke();
            fill(255, 200, 255);
            ellipse(0, 0, 5, 5);
        }

        pop();
    }

    isDead() {
        return this.lifespan < 0;
    }
}
