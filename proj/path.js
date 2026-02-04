class Path {
    constructor() {
        this.radius = 20;
        this.points = [];
    }

    addPoint(x, y) {
        this.points.push(createVector(x, y));
    }

    // Crée un chemin aléatoire
    createRandomPath() {
        this.points = [];
        let x = 0;
        let y = height / 2;
        this.addPoint(x, y);
        for (let i = 0; i < 10; i++) {
            x += width / 5;
            y += random(-200, 200);
            this.addPoint(x, y);
        }
    }

    show() {
        stroke(255, 50);
        strokeWeight(this.radius * 2);
        noFill();
        beginShape();
        for (let v of this.points) {
            vertex(v.x, v.y);
        }
        endShape();

        stroke(255);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let v of this.points) {
            vertex(v.x, v.y);
        }
        endShape();
    }
}
