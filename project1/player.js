class Player {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.r = 20; // Radius
        this.heading = 0;
        this.maxSpeed = 6;
        this.maxForce = 0.2;
        this.friction = 0.98; // Space friction

        this.health = 100;
        this.maxHealth = 100;
        this.isDead = false;

        this.lastShotTime = 0;
        this.shootCooldown = 15; // Frames
    }

    update() {
        if (this.isDead) return;

        // Rotate towards mouse
        let mousePos = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mousePos, this.pos);
        this.heading = dir.heading();

        // Movement Control (WASD / Arrows)
        let force = createVector(0, 0);
        if (keyIsDown(81) || keyIsDown(LEFT_ARROW)) { // Q / Left
            force.x -= 1;
        }
        if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D / Right
            force.x += 1;
        }
        if (keyIsDown(90) || keyIsDown(UP_ARROW)) { // Z / Up
            force.y -= 1;
        }
        if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) { // S / Down
            force.y += 1;
        }

        // Normalize and apply force
        if (force.mag() > 0) {
            force.setMag(0.5); // Acceleration strength
            this.acc.add(force);
        }

        // Physics update
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.vel.mult(this.friction); // Drag
        this.pos.add(this.vel);
        this.acc.mult(0); // Reset acceleration

        this.edges();
    }

    edges() {
        // Wrap around screen
        if (this.pos.x > width + this.r) this.pos.x = -this.r;
        else if (this.pos.x < -this.r) this.pos.x = width + this.r;
        if (this.pos.y > height + this.r) this.pos.y = -this.r;
        else if (this.pos.y < -this.r) this.pos.y = height + this.r;
    }

    show() {
        if (this.isDead) return;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading);

        // Draw Triangle Ship
        fill(0);
        stroke(0, 255, 255); // Cyan
        strokeWeight(2);
        triangle(this.r, 0, -this.r, -this.r / 1.5, -this.r, this.r / 1.5);

        // Engine flame if moving
        if (this.vel.mag() > 0.1) {
            noStroke();
            fill(255, 100, 0, map(Math.random(), 0, 1, 100, 255));
            triangle(-this.r - 5, 0, -this.r, -5, -this.r, 5);
        }

        pop();
    }

    shoot(bullets) {
        if (this.isDead) return;

        if (frameCount - this.lastShotTime > this.shootCooldown) {
            if (mouseIsPressed && mouseButton === LEFT) {
                // Spawn bullet at ship nose
                let nose = p5.Vector.fromAngle(this.heading).mult(this.r);
                let spawnPos = p5.Vector.add(this.pos, nose);
                bullets.push(new Bullet(spawnPos.x, spawnPos.y, this.heading, 'PLAYER'));
                this.lastShotTime = frameCount;
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }
}
