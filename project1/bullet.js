class Bullet {
    constructor(x, y, heading, owner, level = 1) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.fromAngle(heading);
        this.vel.mult(10); // Speed
        this.owner = owner; // 'PLAYER' or 'ENEMY'
        this.level = level;
        this.r = 4;
        this.damage = 10; // Default damage

        if (this.owner === 'PLAYER') {
            // Level 2+ gets stronger
            if (this.level >= 2) {
                this.damage = 20;
                this.r = 6;
            }
            if (this.level >= 3) {
                this.damage = 30;
                this.r = 8;
            }
        }

        this.lifespan = 100; // Frames to live
        this.toDelete = false;
    }

    update() {
        this.pos.add(this.vel);
        this.lifespan--;

        if (this.lifespan < 0) {
            this.toDelete = true;
        }

        // Screen wrap (optional, or delete on edge)
        // For space shooter, usually delete on edge
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
            this.toDelete = true;
        }
    }

    show() {
        push();
        strokeWeight(this.r);

        if (this.owner === 'PLAYER') {
            if (this.level >= 3) stroke(255, 0, 255); // Purple
            else if (this.level >= 2) stroke(255, 255, 0); // Yellow
            else stroke(0, 255, 255); // Cyan (Default)
        } else {
            stroke(255, 0, 0); // Red for enemy
        }

        point(this.pos.x, this.pos.y);
        pop();
    }

    hits(entity) {
        let d = dist(this.pos.x, this.pos.y, entity.pos.x, entity.pos.y);
        return d < this.r + entity.r;
    }
}
