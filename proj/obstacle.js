class Obstacle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;
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
}
