class Obstacle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;
        this.lastShotTime = 0;
    }

    show(debug) {
        fill("green");
        stroke(255);
        strokeWeight(2);
        circle(this.pos.x, this.pos.y, this.r * 2);

        if (debug) {
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            text(`Obs\nR:${Math.round(this.r)}`, this.pos.x, this.pos.y);
        }
    }

    update(vehicles, snakes, bullets) {
        if (frameCount - this.lastShotTime < 60) return;

        // Cooldown ~1s based on 60fps
        let range = 250;
        let target = null;
        let minDist = range;

        // Find closest target
        // 1. Vehicles (includes enemies)
        for (let v of vehicles) {
            let d = p5.Vector.dist(this.pos, v.pos);
            if (d < minDist) {
                minDist = d;
                target = v;
            }
        }

        // 2. Snakes (Heads)
        for (let s of snakes) {
            if (s.index === 0) {
                let d = p5.Vector.dist(this.pos, s.pos);
                if (d < minDist) {
                    minDist = d;
                    target = s;
                }
            }
        }

        if (target) {
            // Shoot
            let angle = p5.Vector.sub(target.pos, this.pos).heading();
            let spawnPos = p5.Vector.fromAngle(angle).mult(this.r + 5).add(this.pos);

            bullets.push(new Bullet(spawnPos.x, spawnPos.y, angle));
            this.lastShotTime = frameCount;
        }
    }
}
