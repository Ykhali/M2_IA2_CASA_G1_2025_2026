class Obstacle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;
    }

    show() {
        fill(255, 100); // gris semi-transparent
        stroke(255);
        strokeWeight(2);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}
