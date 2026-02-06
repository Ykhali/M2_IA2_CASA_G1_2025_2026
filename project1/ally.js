class Ally extends Vehicle {
    constructor(x, y) {
        super(x, y);
        this.r = 12;
        this.maxSpeed = 5;
        this.maxForce = 0.3;
        this.health = 50;
        this.color = color(100, 255, 100); // Green

        this.lastShotTime = 0;
        this.shootCooldown = 30; // 2 shots per second
        this.detectRange = 300;
    }

    applyBehaviors(player, enemies, bullets) {
        // 1. Follow Player (Arrive)
        let arriveForce = this.arrive(player.pos);
        // Maintain some distance (don't sit on top of player)
        let d = p5.Vector.dist(this.pos, player.pos);
        if (d < 80) {
            arriveForce.mult(0); // Stop if close enough
            // Maybe gently flee if TOO close
            if (d < 50) {
                let flee = this.seek(player.pos).mult(-1);
                this.applyForce(flee);
            }
        }
        this.applyForce(arriveForce);

        // 2. Find Closest Enemy
        let closest = null;
        let closestDist = Infinity;

        for (let e of enemies) {
            let d = p5.Vector.dist(this.pos, e.pos);
            if (d < closestDist && d < this.detectRange) {
                closestDist = d;
                closest = e;
            }
        }

        // 3. Shoot at Enemy
        if (closest) {
            // Face enemy (optional visual)
            // Shoot
            this.shoot(closest, bullets);
        }

        super.update();
        this.edges(); // Keep in bounds
    }

    shoot(target, bullets) {
        if (frameCount - this.lastShotTime > this.shootCooldown) {
            let dir = p5.Vector.sub(target.pos, this.pos);
            let heading = dir.heading();

            // Add slight inaccuracy
            heading += random(-0.1, 0.1);

            let bulletPos = this.pos.copy().add(p5.Vector.fromAngle(heading).mult(this.r + 5));
            // Ally bullets are 'PLAYER' owner so they hurt enemies
            // Pass level 1 for now (or maybe player level?)
            bullets.push(new Bullet(bulletPos.x, bulletPos.y, heading, 'PLAYER', 1));
            playShootSound(1.5); // Higher pitch for allies

            this.lastShotTime = frameCount;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading() + PI / 2);

        imageMode(CENTER);
        // Green Tint
        tint(0, 255, 0);
        image(imgPlayer, 0, 0, this.r * 4.0, this.r * 4.0); // Same size as player
        noTint(); // Reset tint

        // Engine
        if (this.vel.mag() > 0.1) {
            fill(0, 255, 0);
            ellipse(0, this.r, 5, 5);
        }

        pop();
    }
}
