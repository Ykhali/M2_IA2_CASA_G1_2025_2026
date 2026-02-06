class Mine {
    constructor(x, y) {
        if (x) {
            this.pos = createVector(x, y);
        } else {
            this.pos = createVector(random(width), random(height));
        }
        this.r = 20;
        this.active = true;
        this.color = color(255, 0, 0);
        this.pulse = 0;
    }

    update() {
        // Pulse effect
        this.pulse = sin(frameCount * 0.1) * 5;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();

        // Inner Core
        fill(255, 0, 0);
        ellipse(0, 0, this.r, this.r);

        // Pulsing Aura
        fill(255, 0, 0, 100);
        ellipse(0, 0, this.r * 1.5 + this.pulse, this.r * 1.5 + this.pulse);

        // Spikes
        stroke(255, 0, 0);
        strokeWeight(2);
        for (let i = 0; i < 8; i++) {
            let angle = TWO_PI / 8 * i + (frameCount * 0.02);
            let v = p5.Vector.fromAngle(angle).mult(this.r * 1.2);
            line(0, 0, v.x, v.y);
        }

        pop();
    }

    explode(target) {
        // High Damage
        if (target) target.takeDamage(50);
        this.active = false;
        // Visuals handled in sketch
    }
}

class Debris {
    constructor(x, y) {
        // Random spawn on edge like Asteroids
        if (random() < 0.5) {
            this.pos = createVector(random(width), random() < 0.5 ? -50 : height + 50);
        } else {
            this.pos = createVector(random() < 0.5 ? -50 : width + 50, random(height));
        }

        this.r = random(5, 10);
        this.vel = p5.Vector.random2D().mult(random(4, 8)); // FAST
        this.active = true;
        this.vertices = [];
        let total = 5;
        for (let i = 0; i < total; i++) {
            let angle = map(i, 0, total, 0, TWO_PI);
            let r = this.r + random(-2, 2);
            this.vertices.push(createVector(r * cos(angle), r * sin(angle)));
        }
    }

    update() {
        this.pos.add(this.vel);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(frameCount * 0.2);

        fill(150);
        stroke(100);
        strokeWeight(1);

        beginShape();
        for (let v of this.vertices) {
            vertex(v.x, v.y);
        }
        endShape(CLOSE);
        pop();
    }

    edges() {
        return (this.pos.x < -100 || this.pos.x > width + 100 || this.pos.y < -100 || this.pos.y > height + 100);
    }
}
