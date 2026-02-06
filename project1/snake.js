class Snake extends Vehicle {
    constructor(x, y, color) {
        super(x, y);
        this.color = color || '#0f0';
        this.segments = []; // Array of Vectors
        this.length = 5;
        this.maxSpeed = 3;
        this.wanderTheta = 0;

        // Initialize segments
        for (let i = 0; i < this.length; i++) {
            this.segments.push(this.pos.copy());
        }
    }

    updateSnake(targetFood) {
        // Behavior: Seek food if exists, otherwise wander
        if (targetFood) {
            let seekForce = this.seek(targetFood.pos);
            this.applyForce(seekForce);
        } else {
            let wanderForce = this.wander();
            this.applyForce(wanderForce);
        }

        this.update(); // Update physics (head)
        this.edges();

        // Update body segments (Snake trail)
        this.segments.unshift(this.pos.copy()); // Add new head position

        // Trim to length
        if (this.segments.length > this.length) {
            this.segments.pop();
        }
    }

    grow() {
        this.length += 2; // Adds roughly "one ball" of length
    }

    shrink() {
        this.length -= 2;
        if (this.length < 2) this.length = 2; // Minimum length

        // Immediate visual feedback: remove segment
        while (this.segments.length > this.length) {
            this.segments.pop();
        }
    }

    show() {
        // Draw body first so head is on top
        push();
        noFill();
        stroke(this.color);
        strokeWeight(this.r * 1.5);
        strokeJoin(ROUND);

        beginShape();
        for (let i = 0; i < this.segments.length; i++) {
            let pos = this.segments[i];
            vertex(pos.x, pos.y);
        }
        endShape();
        pop();

        // Draw Head
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        // Tongue (Animated)
        if (frameCount % 60 < 30) {
            stroke(255, 0, 0);
            strokeWeight(2);
            noFill();
            line(this.r / 2, 0, this.r + 5, 0); // Main tongue
            line(this.r + 5, 0, this.r + 10, -3); // Fork
            line(this.r + 5, 0, this.r + 10, 3); // Fork
        }

        noStroke();
        fill(this.color);
        ellipse(0, 0, this.r * 1.5, this.r * 1.3); // Head shape

        // Eyes
        fill(255);
        ellipse(5, -5, 6, 6);
        ellipse(5, 5, 6, 6);

        // Pupils
        fill(0);
        ellipse(6, -5, 2, 2);
        ellipse(6, 5, 2, 2);

        pop();
    }
}
