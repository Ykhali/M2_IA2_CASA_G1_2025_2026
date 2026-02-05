class Particle {
    constructor(x, y, color) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(0.5, 2));
        this.acc = createVector(0, 0);
        this.lifespan = 255;
        this.startLifespan = 255;
        this.color = color;
        this.size = random(2, 6);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan -= 5;
    }

    show() {
        noStroke();
        // Extract RGB from color to set alpha
        let c = color(this.color);
        c.setAlpha(this.lifespan);
        fill(c);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    isDead() {
        return this.lifespan < 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    addParticle(x, y, color) {
        this.particles.push(new Particle(x, y, color));
    }

    createExplosion(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.addParticle(x, y, color);
        }
    }

    run() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            p.show();
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
}
