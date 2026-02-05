class Asteroid {
    constructor(x, y, r) {
        if (x) {
            this.pos = createVector(x, y);
        } else {
            // Random spawn on edge
            if (random() < 0.5) {
                // Top/Bottom
                this.pos = createVector(random(width), random() < 0.5 ? -100 : height + 100);
            } else {
                // Left/Right
                this.pos = createVector(random() < 0.5 ? -100 : width + 100, random(height));
            }
        }

        this.r = r || random(30, 80);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(1, 3));
        this.total = floor(random(5, 15));
        this.offset = [];
        for (let i = 0; i < this.total; i++) {
            this.offset[i] = random(-10, 10);
        }
    }

    update() {
        this.pos.add(this.vel);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        // Add some rotation
        rotate(frameCount * 0.01 + this.r);

        imageMode(CENTER);
        image(imgAsteroid, 0, 0, this.r * 2.2, this.r * 2.2);

        pop();
    }

    edges() {
        // Remove if too far off screen
        // But need to allow them to enter screen first
        // So checking large margin
        return (this.pos.x < -200 || this.pos.x > width + 200 || this.pos.y < -200 || this.pos.y > height + 200);
    }
}
