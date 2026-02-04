// class Snake extends Vehicle {
//     constructor(x, y, index, color) {
//         super(x, y);
//         this.index = index;
//         this.history = [];
//         this.color = color || color(random(50, 150), random(150, 255), random(50, 150));
//         this.r = 12; // Base radius
//     }

//     show() {
//         push();
//         translate(this.pos.x, this.pos.y);
//         rotate(this.vel.heading());

//         noStroke();
//         fill(this.color);

//         if (this.index === 0) {
//             // --- HEAD ---
//             // Main Head Shape
//             ellipse(0, 0, this.r * 2.5, this.r * 2);

//             // Eyes
//             fill(255); // White
//             ellipse(this.r * 0.5, -this.r * 0.5, this.r * 0.8, this.r * 0.6);
//             ellipse(this.r * 0.5, this.r * 0.5, this.r * 0.8, this.r * 0.6);

//             // Pupils (Slit like a snake)
//             fill(0);
//             ellipse(this.r * 0.6, -this.r * 0.5, this.r * 0.2, this.r * 0.5);
//             ellipse(this.r * 0.6, this.r * 0.5, this.r * 0.2, this.r * 0.5);

//             // Tongue (Slithering animation)
//             if (frameCount % 60 < 30) { // Flicker tongue
//                 stroke(255, 0, 0);
//                 strokeWeight(2);
//                 noFill();
//                 beginShape();
//                 vertex(this.r, 0);
//                 vertex(this.r + 10, 0);
//                 vertex(this.r + 15, -5);
//                 endShape();
//                 beginShape();
//                 vertex(this.r + 10, 0);
//                 vertex(this.r + 15, 5);
//                 endShape();
//             }
//         } else {
//             // --- BODY ---
//             // Taper effect for body or just standard
//             // We don't track total length here easily, so we just draw good segments
//             // Scales to simulate scales/skin

//             // Main body circle
//             ellipse(0, 0, this.r * 2, this.r * 1.8);

//             // Pattern (stripes)
//             stroke(0, 50);
//             strokeWeight(1);
//             line(0, -this.r + 2, 0, this.r - 2);
//         }

//         pop();
//     }
// }







// class Snake extends Vehicle {
//   constructor(x, y, index, color, prevSegment = null) {
//     super(x, y);
//     this.index = index;
//     this.history = [];
//     this.color =
//       color || color(random(50, 150), random(150, 255), random(50, 150));
//     this.r = 12; // Base radius
//     this.prevSegment = prevSegment; // Reference to previous segment
//   }

//   show() {
//     // Draw connection to previous segment first (before transformations)
//     if (this.prevSegment && this.index > 0) {
//       push();
//       // Draw line/rectangle connecting this segment to previous
//       let c = this.color;
//       // Make connection slightly transparent and same color
//       stroke(red(c), green(c), blue(c), 180);
//       strokeWeight(this.r * 1.8); // Slightly smaller than body width
//       strokeCap(ROUND);
//       line(
//         this.prevSegment.pos.x,
//         this.prevSegment.pos.y,
//         this.pos.x,
//         this.pos.y,
//       );
//       pop();
//     }

//     // Now draw the segment itself
//     push();
//     translate(this.pos.x, this.pos.y);
//     rotate(this.vel.heading());

//     noStroke();
//     fill(this.color);

//     if (this.index === 0) {
//       // --- HEAD ---
//       // Main Head Shape
//       ellipse(0, 0, this.r * 2.5, this.r * 2);

//       // Eyes
//       fill(255); // White
//       ellipse(this.r * 0.5, -this.r * 0.5, this.r * 0.8, this.r * 0.6);
//       ellipse(this.r * 0.5, this.r * 0.5, this.r * 0.8, this.r * 0.6);

//       // Pupils (Slit like a snake)
//       fill(0);
//       ellipse(this.r * 0.6, -this.r * 0.5, this.r * 0.2, this.r * 0.5);
//       ellipse(this.r * 0.6, this.r * 0.5, this.r * 0.2, this.r * 0.5);

//       // Tongue (Slithering animation)
//       if (frameCount % 60 < 30) {
//         // Flicker tongue
//         stroke(255, 0, 0);
//         strokeWeight(2);
//         noFill();
//         beginShape();
//         vertex(this.r, 0);
//         vertex(this.r + 10, 0);
//         vertex(this.r + 15, -5);
//         endShape();
//         beginShape();
//         vertex(this.r + 10, 0);
//         vertex(this.r + 15, 5);
//         endShape();
//       }
//     } else {
//       // --- BODY ---
//       // Main body circle
//       ellipse(0, 0, this.r * 2, this.r * 1.8);

//       // Pattern (stripes)
//       stroke(0, 50);
//       strokeWeight(1);
//       line(0, -this.r + 2, 0, this.r - 2);
//     }

//     pop();
//   }
// }

class Snake extends Vehicle {
  constructor(x, y, index, color, prevSegment = null) {
    super(x, y);
    this.index = index;
    this.history = [];
    this.color =
      color || color(random(50, 150), random(150, 255), random(50, 150));
    this.r = 12; // Base radius
    this.prevSegment = prevSegment; // Reference to previous segment
  }

  show() {
    // Draw connection to previous segment first (before transformations)
    if (this.prevSegment && this.index > 0) {
      push();
      // Draw line/rectangle connecting this segment to previous
      let c = this.color;
      // Make connection slightly transparent and same color
      stroke(red(c), green(c), blue(c), 180);
      strokeWeight(this.r * 1.8); // Slightly smaller than body width
      strokeCap(ROUND);
      line(
        this.prevSegment.pos.x,
        this.prevSegment.pos.y,
        this.pos.x,
        this.pos.y,
      );
      pop();
    }

    // Now draw the segment itself
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    noStroke();
    fill(this.color);

    if (this.index === 0) {
      // --- HEAD ---
      // Main Head Shape
      ellipse(0, 0, this.r * 2.5, this.r * 2);

      // Eyes
      fill(255); // White
      ellipse(this.r * 0.5, -this.r * 0.5, this.r * 0.8, this.r * 0.6);
      ellipse(this.r * 0.5, this.r * 0.5, this.r * 0.8, this.r * 0.6);

      // Pupils (Slit like a snake)
      fill(0);
      ellipse(this.r * 0.6, -this.r * 0.5, this.r * 0.2, this.r * 0.5);
      ellipse(this.r * 0.6, this.r * 0.5, this.r * 0.2, this.r * 0.5);

      // Tongue (Slithering animation)
      if (frameCount % 60 < 30) {
        // Flicker tongue
        stroke(255, 0, 0);
        strokeWeight(2);
        noFill();
        beginShape();
        vertex(this.r, 0);
        vertex(this.r + 10, 0);
        vertex(this.r + 15, -5);
        endShape();
        beginShape();
        vertex(this.r + 10, 0);
        vertex(this.r + 15, 5);
        endShape();
      }
    } else {
      // --- BODY ---
      // Main body circle
      ellipse(0, 0, this.r * 2, this.r * 1.8);

      // Pattern (stripes)
      stroke(0, 50);
      strokeWeight(1);
      line(0, -this.r + 2, 0, this.r - 2);
    }

    pop();
  }

  // Override edges to keep snake within bounds instead of wrapping
  edges() {
    // Constrain position to stay within screen bounds
    if (this.pos.x > width - this.r) {
      this.pos.x = width - this.r;
      this.vel.x *= -1; // Bounce off edge
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }

    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -1; // Bounce off edge
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
}