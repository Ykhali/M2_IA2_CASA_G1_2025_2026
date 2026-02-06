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
        this.baseShootCooldown = 15;
        this.boostedShootCooldown = 5;
        this.currentShootCooldown = 15;

        this.isBoosted = false;
        this.boostTimer = 0;

        this.isWeaponBoosted = false;
        this.weaponBoostTimer = 0;
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

        // Handle Boost
        if (this.isBoosted) {
            this.boostTimer--;
            if (this.boostTimer <= 0) {
                this.isBoosted = false;
                this.currentShootCooldown = this.baseShootCooldown;
            }
        }

        // Handle Weapon Boost
        if (this.isWeaponBoosted) {
            this.weaponBoostTimer--;
            if (this.weaponBoostTimer <= 0) {
                this.isWeaponBoosted = false;
            }
        }
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
        rotate(this.heading + PI / 2); // Adjust rotation because image points up

        imageMode(CENTER);
        image(imgPlayer, 0, 0, this.r * 4.0, this.r * 4.0); // Draw ship

        // Engine flame particles
        if (this.vel.mag() > 0.1) {
            // Emit particles from bottom
            let enginePos = createVector(0, this.r);
            // rotate engine pos
            // Actually since we transposed, the bottom is +y
            if (frameCount % 3 === 0 && particles) { // Throttle particle creation
                // Need absolute position for particles
                // Calculate rear position based on ship rotation
                let rear = p5.Vector.fromAngle(this.heading).mult(-this.r);
                let pPos = p5.Vector.add(this.pos, rear);
                particles.addParticle(pPos.x, pPos.y, '#0ff');
            }
        }

        pop();
    }

    shoot(bullets, level = 1) {
        if (this.isDead) return;

        if (frameCount - this.lastShotTime > this.currentShootCooldown) {
            if (mouseIsPressed && mouseButton === LEFT) {
                // Spawn bullet at ship nose
                let nose = p5.Vector.fromAngle(this.heading).mult(this.r);
                let spawnPos = p5.Vector.add(this.pos, nose);

                let effectiveLevel = level;
                if (this.isWeaponBoosted) effectiveLevel += 2; // Boost level by 2

                bullets.push(new Bullet(spawnPos.x, spawnPos.y, this.heading, 'PLAYER', effectiveLevel));
                this.lastShotTime = frameCount;
            }
        }
    }

    activateBoost() {
        this.isBoosted = true;
        this.currentShootCooldown = this.boostedShootCooldown;
        this.boostTimer = 300; // 5 seconds at 60fps
    }

    activateWeaponBoost() {
        this.isWeaponBoosted = true;
        this.weaponBoostTimer = 1800; // 30 seconds at 60fps
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }
}
