class Vehicle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 4;
        this.maxForce = 0.2;
        this.r = 16;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    arrive(target) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let speed = this.maxSpeed;
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxSpeed);
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    wander() {
        // Simple wander implementation
        let wanderPoint = this.vel.copy();
        wanderPoint.setMag(100);
        wanderPoint.add(this.pos);

        let wanderRadius = 50;
        let theta = this.wanderTheta + this.vel.heading();

        let x = wanderRadius * cos(theta);
        let y = wanderRadius * sin(theta);

        wanderPoint.add(x, y);
        let steer = this.seek(wanderPoint);

        // Randomly change wander theta
        let displaceRange = 0.3;
        this.wanderTheta += random(-displaceRange, displaceRange);

        return steer;
    }

    edges() {
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        else if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
        else if (this.pos.y < -this.r) this.pos.y = height + this.r;
    }
}
