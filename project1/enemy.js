class Enemy {
    constructor(x, y, type) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.type = type; // 'SEEKER' or 'SHOOTER'

        if (this.type === 'SEEKER') {
            this.maxSpeed = 4;
            this.maxForce = 0.2;
            this.r = 15;
            this.health = 20;
            this.color = color(255, 100, 100);
        } else { // SHOOTER
            this.maxSpeed = 2;
            this.maxForce = 0.1;
            this.r = 25;
            this.health = 50;
            this.color = color(200, 50, 255);
            this.lastShotTime = 0;
            this.shootCooldown = 120; // Slower fire rate
        }
    }

    update(player, bullets) {
        // Physics
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Behavior
        if (player && !player.isDead) {
            if (this.type === 'SEEKER') {
                let seekForce = this.seek(player.pos);
                this.applyForce(seekForce);
            } else if (this.type === 'SHOOTER') {
                // Arrive at distance 200
                let dist = p5.Vector.dist(this.pos, player.pos);
                if (dist > 250) {
                    let arriveForce = this.arrive(player.pos);
                    this.applyForce(arriveForce);
                } else if (dist < 150) {
                    // Too close, flee
                    let fleeForce = this.seek(player.pos).mult(-1);
                    this.applyForce(fleeForce);
                }

                // Shoot
                this.shoot(player, bullets);
            }
        }
    }

    applyForce(force) {
        this.acc.add(force);
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

    shoot(player, bullets) {
        if (frameCount - this.lastShotTime > this.shootCooldown) {
            // Aim at player
            let dir = p5.Vector.sub(player.pos, this.pos);
            let heading = dir.heading();

            // Add some inaccuracy
            heading += random(-0.2, 0.2);

            let bulletPos = this.pos.copy().add(p5.Vector.fromAngle(heading).mult(this.r + 5));
            bullets.push(new Bullet(bulletPos.x, bulletPos.y, heading, 'ENEMY'));
            playShootSound(0.5); // Lower pitch for enemies
            this.lastShotTime = frameCount;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading() + PI / 2); // Adjust for up-facing sprites

        imageMode(CENTER);

        if (this.type === 'SEEKER') {
            image(imgEnemySeeker, 0, 0, this.r * 4.0, this.r * 4.0);
        } else {
            image(imgEnemyShooter, 0, 0, this.r * 2.5, this.r * 2.5);
        }

        pop();
    }

    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
}
