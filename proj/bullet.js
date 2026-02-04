class Bullet {
    constructor(x, y, heading) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.fromAngle(heading);
        this.vel.mult(10); // Speed of bullet
        this.r = 4;
        this.lifespan = 255;
    }

    update() {
        this.pos.add(this.vel);
        this.lifespan -= 5;
    }

    show() {
        push();
        stroke(255, 0, 0, this.lifespan);
        strokeWeight(this.r);
        point(this.pos.x, this.pos.y);
        pop();
    }

    hits(vehicle) {
        let d = p5.Vector.dist(this.pos, vehicle.pos);
        return d < this.r + vehicle.r;
    }

    isDead() {
        return this.lifespan < 0;
    }

    edges() {
        return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
    }
}
