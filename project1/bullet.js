class Bullet {
    constructor(x, y, heading, owner) {
        this.pos = createVector(x, y);
        this.vel = p5.Vector.fromAngle(heading);
        this.vel.mult(10); // Speed
        this.owner = owner; // 'PLAYER' or 'ENEMY'
        this.r = 4;
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
        stroke(this.owner === 'PLAYER' ? '#0ff' : '#f00'); // Cyan for player, Red for enemy
        strokeWeight(this.r);
        point(this.pos.x, this.pos.y);
        pop();
    }

    hits(entity) {
        let d = dist(this.pos.x, this.pos.y, entity.pos.x, entity.pos.y);
        return d < this.r + entity.r;
    }
}
