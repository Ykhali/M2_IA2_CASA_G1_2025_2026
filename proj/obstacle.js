// class Obstacle {
//     constructor(x, y, r) {
//         this.pos = createVector(x, y);
//         this.r = r;
//         this.lastShotTime = 0;
//     }

//     show(debug) {
//         fill("green");
//         stroke(255);
//         strokeWeight(2);
//         circle(this.pos.x, this.pos.y, this.r * 2);

//         if (debug) {
//             fill(255);
//             noStroke();
//             textAlign(CENTER, CENTER);
//             text(`Obs\nR:${Math.round(this.r)}`, this.pos.x, this.pos.y);
//         }
//     }

//     update(vehicles, snakes, bullets) {
//         if (frameCount - this.lastShotTime < 60) return;

//         // Cooldown ~1s based on 60fps
//         let range = 250;
//         let target = null;
//         let minDist = range;

//         // Find closest target
//         // 1. Vehicles (includes enemies)
//         for (let v of vehicles) {
//             let d = p5.Vector.dist(this.pos, v.pos);
//             if (d < minDist) {
//                 minDist = d;
//                 target = v;
//             }
//         }

//         // 2. Snakes (Heads)
//         for (let s of snakes) {
//             if (s.index === 0) {
//                 let d = p5.Vector.dist(this.pos, s.pos);
//                 if (d < minDist) {
//                     minDist = d;
//                     target = s;
//                 }
//             }
//         }

//         if (target) {
//             // Shoot
//             let angle = p5.Vector.sub(target.pos, this.pos).heading();
//             let spawnPos = p5.Vector.fromAngle(angle).mult(this.r + 5).add(this.pos);

//             bullets.push(new Bullet(spawnPos.x, spawnPos.y, angle));
//             this.lastShotTime = frameCount;
//         }
//     }
// }









// class Obstacle {
//   constructor(x, y, r) {
//     this.pos = createVector(x, y);
//     this.r = r;
//     this.lastShotTime = 0;
//     this.angle = 0; // Angle for turret rotation

//     // Create the obstacle image if it doesn't exist yet
//     if (!Obstacle.obstacleImg) {
//       Obstacle.createObstacleImage();
//     }
//   }

//   // Static method to create the obstacle image once
//   static createObstacleImage() {
//     let size = 120;
//     Obstacle.obstacleImg = createGraphics(size, size);
//     let g = Obstacle.obstacleImg;

//     g.clear();
//     g.translate(size / 2, size / 2);

//     // Base platform (stone/metal base)
//     g.noStroke();
//     g.fill(80, 80, 90);
//     g.ellipse(0, 0, size * 0.9, size * 0.9);

//     // Shadow/depth
//     g.fill(50, 50, 60);
//     g.arc(0, 0, size * 0.9, size * 0.9, 0, PI);

//     // Metal bands
//     g.stroke(100, 100, 110);
//     g.strokeWeight(3);
//     g.noFill();
//     g.ellipse(0, 0, size * 0.75, size * 0.75);
//     g.ellipse(0, 0, size * 0.6, size * 0.6);

//     // Central turret body
//     g.noStroke();
//     g.fill(60, 80, 60);
//     g.ellipse(0, 0, size * 0.5, size * 0.5);

//     // Turret highlights
//     g.fill(80, 100, 80);
//     g.arc(0, 0, size * 0.5, size * 0.5, PI, TWO_PI);

//     // Center core (darker)
//     g.fill(40, 60, 40);
//     g.ellipse(0, 0, size * 0.3, size * 0.3);

//     // Cannon barrel base (this will be rotated separately)
//     // We'll draw this in the show method so it can rotate
//   }

//   // Static method to create cannon barrel graphic
//   static createCannonGraphic() {
//     if (!Obstacle.cannonImg) {
//       let w = 60;
//       let h = 20;
//       Obstacle.cannonImg = createGraphics(w, h);
//       let g = Obstacle.cannonImg;

//       g.clear();

//       // Cannon barrel
//       g.fill(70, 70, 80);
//       g.noStroke();
//       g.rect(0, h / 2 - 6, w * 0.7, 12, 2);

//       // Cannon tip (darker)
//       g.fill(50, 50, 60);
//       g.rect(w * 0.7 - 5, h / 2 - 7, w * 0.3, 14, 3);

//       // Barrel highlight
//       g.fill(90, 90, 100, 150);
//       g.rect(2, h / 2 - 4, w * 0.65, 4);

//       // Muzzle
//       g.fill(30, 30, 40);
//       g.ellipse(w - 2, h / 2, 8, 12);
//     }
//   }

//   show(debug) {
//     push();

//     // Draw the base obstacle image
//     imageMode(CENTER);
//     image(Obstacle.obstacleImg, this.pos.x, this.pos.y, this.r * 2, this.r * 2);

//     // Draw rotating cannon
//     if (!Obstacle.cannonImg) {
//       Obstacle.createCannonGraphic();
//     }

//     translate(this.pos.x, this.pos.y);
//     rotate(this.angle);

//     // Draw cannon barrel
//     image(Obstacle.cannonImg, 0, -10, this.r * 1.2, this.r * 0.4);

//     pop();

//     // Warning range indicator (when debug is on)
//     if (debug) {
//       push();
//       noFill();
//       stroke(255, 100, 100, 100);
//       strokeWeight(2);
//       circle(this.pos.x, this.pos.y, 500); // 250 radius range

//       // Label
//       fill(255);
//       noStroke();
//       textAlign(CENTER, CENTER);
//       textSize(12);
//       text(
//         `Turret\nR:${Math.round(this.r)}`,
//         this.pos.x,
//         this.pos.y + this.r + 15,
//       );
//       pop();
//     }
//   }

//   update(vehicles, snakes, bullets) {
//     if (frameCount - this.lastShotTime < 60) return;

//     // Cooldown ~1s based on 60fps
//     let range = 250;
//     let target = null;
//     let minDist = range;

//     // Find closest target
//     // 1. Vehicles (includes enemies)
//     for (let v of vehicles) {
//       let d = p5.Vector.dist(this.pos, v.pos);
//       if (d < minDist) {
//         minDist = d;
//         target = v;
//       }
//     }

//     // 2. Snakes (Heads)
//     for (let s of snakes) {
//       if (s.index === 0) {
//         let d = p5.Vector.dist(this.pos, s.pos);
//         if (d < minDist) {
//           minDist = d;
//           target = s;
//         }
//       }
//     }

//     if (target) {
//       // Rotate turret to face target
//       this.angle = p5.Vector.sub(target.pos, this.pos).heading();

//       // Shoot
//       let angle = this.angle;
//       let spawnPos = p5.Vector.fromAngle(angle)
//         .mult(this.r + 5)
//         .add(this.pos);

//       bullets.push(new Bullet(spawnPos.x, spawnPos.y, angle));
//       this.lastShotTime = frameCount;
//     } else {
//       // Slowly rotate when idle (looks more alive)
//       this.angle += 0.01;
//     }
//   }
// }










// class Obstacle {
//   constructor(x, y, r) {
//     this.pos = createVector(x, y);
//     this.r = r;

//     // Create the obstacle image if it doesn't exist yet
//     if (!Obstacle.obstacleImg) {
//       Obstacle.createObstacleImage();
//     }
//   }

//   // Static method to create the obstacle image once
//   static createObstacleImage() {
//     let size = 120;
//     Obstacle.obstacleImg = createGraphics(size, size);
//     let g = Obstacle.obstacleImg;

//     g.clear();
//     g.translate(size / 2, size / 2);

//     // Base platform (stone/metal base)
//     g.noStroke();
//     g.fill(80, 80, 90);
//     g.ellipse(0, 0, size * 0.9, size * 0.9);

//     // Shadow/depth
//     g.fill(50, 50, 60);
//     g.arc(0, 0, size * 0.9, size * 0.9, 0, PI);

//     // Metal bands
//     g.stroke(100, 100, 110);
//     g.strokeWeight(3);
//     g.noFill();
//     g.ellipse(0, 0, size * 0.75, size * 0.75);
//     g.ellipse(0, 0, size * 0.6, size * 0.6);

//     // Central turret body
//     g.noStroke();
//     g.fill(60, 80, 60);
//     g.ellipse(0, 0, size * 0.5, size * 0.5);

//     // Turret highlights
//     g.fill(80, 100, 80);
//     g.arc(0, 0, size * 0.5, size * 0.5, PI, TWO_PI);

//     // Center core (darker)
//     g.fill(40, 60, 40);
//     g.ellipse(0, 0, size * 0.3, size * 0.3);
//   }

//   show(debug) {
//     push();

//     // Debug mode: Draw yellow circle around obstacle (like in the image)
//     if (debug) {
//       // Yellow debug circle
//       noFill();
//       stroke(255, 255, 0); // Yellow
//       strokeWeight(2);
//       circle(this.pos.x, this.pos.y, this.r * 2);
//     }

//     // Draw the obstacle image (green circle in the center)
//     imageMode(CENTER);
//     image(Obstacle.obstacleImg, this.pos.x, this.pos.y, this.r * 2, this.r * 2);

//     pop();

//     // Debug label
//     if (debug) {
//       push();
//       fill(255, 255, 0);
//       noStroke();
//       textAlign(CENTER, CENTER);
//       textSize(10);
//       text(
//         `Obstacle\nR:${Math.round(this.r)}`,
//         this.pos.x,
//         this.pos.y + this.r + 15,
//       );
//       pop();
//     }
//   }

//   // No update method needed since obstacles don't shoot anymore
//   update(vehicles, snakes, bullets) {
//     // Obstacles are now passive - they don't shoot
//     // This method is kept for compatibility but does nothing
//   }
// }



class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.angle = 0; // Angle pointing toward target

    // Create the obstacle image if it doesn't exist yet
    if (!Obstacle.obstacleImg) {
      Obstacle.createObstacleImage();
    }
  }

  // Static method to create the obstacle image once
  static createObstacleImage() {
    let size = 120;
    Obstacle.obstacleImg = createGraphics(size, size);
    let g = Obstacle.obstacleImg;

    g.clear();
    g.translate(size / 2, size / 2);

    // Base platform (stone/metal base)
    g.noStroke();
    g.fill(80, 80, 90);
    g.ellipse(0, 0, size * 0.9, size * 0.9);

    // Shadow/depth
    g.fill(50, 50, 60);
    g.arc(0, 0, size * 0.9, size * 0.9, 0, PI);

    // Metal bands
    g.stroke(100, 100, 110);
    g.strokeWeight(3);
    g.noFill();
    g.ellipse(0, 0, size * 0.75, size * 0.75);
    g.ellipse(0, 0, size * 0.6, size * 0.6);

    // Central turret body
    g.noStroke();
    g.fill(60, 80, 60);
    g.ellipse(0, 0, size * 0.5, size * 0.5);

    // Turret highlights
    g.fill(80, 100, 80);
    g.arc(0, 0, size * 0.5, size * 0.5, PI, TWO_PI);

    // Center core (darker)
    g.fill(40, 60, 40);
    g.ellipse(0, 0, size * 0.3, size * 0.3);
  }

  show(debug) {
    push();

    // Debug mode: Draw yellow circle around obstacle
    if (debug) {
      // Yellow debug circle
      noFill();
      stroke(255, 255, 0); // Yellow
      strokeWeight(2);
      circle(this.pos.x, this.pos.y, this.r * 2);
    }

    // Draw the obstacle image
    imageMode(CENTER);
    image(Obstacle.obstacleImg, this.pos.x, this.pos.y, this.r * 2, this.r * 2);

    // Draw yellow tracking line/pointer ONLY in debug mode
    if (debug) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);

      // Yellow line pointing toward target
      stroke(255, 255, 0); // Yellow
      strokeWeight(3);
      line(0, 0, this.r * 0.8, 0); // Line from center to edge

      // Red/orange tip at the end
      fill(255, 100, 0);
      noStroke();
      circle(this.r * 0.8, 0, 8);

      pop();
    }

    pop();

    // Debug label
    if (debug) {
      push();
      fill(255, 255, 0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(10);
      text(
        `Obstacle\nR:${Math.round(this.r)}`,
        this.pos.x,
        this.pos.y + this.r + 15,
      );
      pop();
    }
  }

  update(vehicles, snakes, bullets) {
    // Find closest target to track with the pointer
    let target = null;
    let minDist = Infinity;

    // 1. Check vehicles
    for (let v of vehicles) {
      let d = p5.Vector.dist(this.pos, v.pos);
      if (d < minDist) {
        minDist = d;
        target = v;
      }
    }

    // 2. Check snake heads
    for (let s of snakes) {
      if (s.index === 0) {
        // Head only
        let d = p5.Vector.dist(this.pos, s.pos);
        if (d < minDist) {
          minDist = d;
          target = s;
        }
      }
    }

    // Update angle to point toward closest target
    if (target) {
      this.angle = p5.Vector.sub(target.pos, this.pos).heading();
    }
  }
}