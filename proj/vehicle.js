// class Vehicle {
//     constructor(x, y) {
//         this.pos = createVector(x, y);
//         this.vel = createVector(random(-1, 1), random(-1, 1));
//         this.acc = createVector(0, 0);
//         this.maxSpeed = 4;
//         this.maxForce = 0.2;
//         this.r = 16;

//         // Behavior State
//         this.behavior = "Wander"; // Default

//         // Pour Wander
//         this.wanderTheta = PI / 2;

//         // Attack Cooldown
//         this.lastShotTime = 0;

//         // Debug info
//         this.debug = false;
//     }

//     applyForce(force) {
//         this.acc.add(force);
//     }

//     update() {
//         this.vel.add(this.acc);
//         this.vel.limit(this.maxSpeed);
//         this.pos.add(this.vel);
//         this.acc.set(0, 0);
//     }

//     show() {
//         push();
//         translate(this.pos.x, this.pos.y);
//         rotate(this.vel.heading());

//         stroke(255);
//         strokeWeight(1);

//         // Color based on behavior
//         if (this.behavior === "Seek") fill(100, 255, 100);
//         else if (this.behavior === "Flee") fill(255, 100, 100);
//         else if (this.behavior === "Wander") fill(100, 100, 255);
//         else if (this.behavior === "Boid (Flocking)") fill(200, 200, 50);
//         else if (this.behavior === "Enemy") {
//             // Cool Enemy Design: Dark Red Spiked Ship
//             fill(150, 0, 0);
//             stroke(255, 0, 0);
//             strokeWeight(2);
//             beginShape();
//             vertex(this.r * 2, 0); // Nose
//             vertex(-this.r, -this.r); // Back Left
//             vertex(-this.r / 2, 0); // Inner back
//             vertex(-this.r, this.r); // Back Right
//             endShape(CLOSE);

//             // Engines
//             fill(255, 150, 0);
//             noStroke();
//             circle(-this.r, -this.r / 2, 5);
//             circle(-this.r, this.r / 2, 5);
//         }
//         else {
//             fill(127);
//             stroke(255);
//             strokeWeight(2);
//             triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
//         }

//         // Default triangle for non-enemies if not handled above
//         if (this.behavior !== "Enemy") {
//             triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
//         }

//         if (this.debug) {
//             noFill();
//             stroke(255, 50);
//             circle(0, 0, this.r * 2);
//         }

//         pop();
//     }

//     edges() {
//         if (this.pos.x > width + this.r) this.pos.x = -this.r;
//         else if (this.pos.x < -this.r) this.pos.x = width + this.r;
//         if (this.pos.y > height + this.r) this.pos.y = -this.r;
//         else if (this.pos.y < -this.r) this.pos.y = height + this.r;
//     }

//     // ... Copier coller les méthodes seek, arrive, flee, wander, avoid, flock, follow ...
//     // Pour éviter de réécrire tout le fichier, je demande au modèle d'utiliser replace_file_content pour insérer les méthodes si elles manquent, 
//     // MAIS comme c'est write_to_file, je dois tout mettre.

//     seek(target) {
//         let desired = p5.Vector.sub(target, this.pos);
//         desired.setMag(this.maxSpeed);
//         let steer = p5.Vector.sub(desired, this.vel);
//         steer.limit(this.maxForce);
//         return steer;
//     }

//     flee(target) {
//         return this.seek(target).mult(-1);
//     }

//     arrive(target, stoppingDist = 0) {
//         let desired = p5.Vector.sub(target, this.pos);
//         let d = desired.mag();
//         let speed = this.maxSpeed;

//         let slowdownRadius = 100;

//         if (d < slowdownRadius) {
//             speed = map(d, stoppingDist, slowdownRadius, 0, this.maxSpeed);
//         }

//         desired.setMag(speed);
//         let steer = p5.Vector.sub(desired, this.vel);
//         steer.limit(this.maxForce);
//         return steer;
//     }

//     pursue(vehicle) {
//         let target = vehicle.pos.copy();
//         let prediction = vehicle.vel.copy();
//         prediction.mult(10);
//         target.add(prediction);
//         return this.seek(target);
//     }

//     evade(vehicle) {
//         let pursuit = this.pursue(vehicle);
//         return pursuit.mult(-1);
//     }

//     wander() {
//         let wanderPoint = this.vel.copy();
//         wanderPoint.setMag(100);
//         wanderPoint.add(this.pos);
//         let wanderRadius = 50;
//         let theta = this.wanderTheta + this.vel.heading();
//         let x = wanderRadius * cos(theta);
//         let y = wanderRadius * sin(theta);
//         wanderPoint.add(x, y);
//         let steer = wanderPoint.sub(this.pos);
//         steer.setMag(this.maxForce);
//         this.applyForce(steer);
//         let displaceRange = 0.3;
//         this.wanderTheta += random(-displaceRange, displaceRange);
//     }

//     avoid(obstacles) {
//         let ahead = this.vel.copy();
//         ahead.mult(50); // Lookahead static or dynamic 

//         let ahead2 = ahead.copy().mult(0.5);

//         if (this.debug) {
//             push();
//             stroke(0, 255, 0);
//             line(this.pos.x, this.pos.y, this.pos.x + ahead.x, this.pos.y + ahead.y);
//             pop();
//         }

//         let mostThreatening = null;
//         let closestBoxPos = null;
//         let closestDist = 10000;

//         for (let obstacle of obstacles) {
//             // Line Circle Intersection Check
//             let collision = this.lineIntersectsCircle(ahead, ahead2, obstacle);

//             if (collision && (mostThreatening == null || p5.Vector.dist(this.pos, obstacle.pos) < p5.Vector.dist(this.pos, mostThreatening.pos))) {
//                 mostThreatening = obstacle;
//             }
//         }

//         let avoidance = createVector(0, 0);

//         if (mostThreatening != null) {
//             avoidance.x = ahead.x - mostThreatening.pos.x;
//             avoidance.y = ahead.y - mostThreatening.pos.y;
//             avoidance.normalize();
//             avoidance.mult(this.maxForce); // Should be maxAvoidForce maybe
//             // Reynolds uses maxSpeed for steering usually, or maxForce directly
//             avoidance.setMag(this.maxSpeed);
//             avoidance.sub(this.vel);
//             avoidance.limit(this.maxForce);
//         }
//         return avoidance;
//     }

//     lineIntersectsCircle(ahead, ahead2, obstacle) {
//         // Check if circle is close to line ending at ahead
//         // Simple version: check distance of ahead tip and ahead2 tip to center

//         let p1 = p5.Vector.add(this.pos, ahead);
//         let p2 = p5.Vector.add(this.pos, ahead2);

//         let d1 = p5.Vector.dist(obstacle.pos, p1);
//         let d2 = p5.Vector.dist(obstacle.pos, p2);

//         return d1 <= obstacle.r || d2 <= obstacle.r || p5.Vector.dist(obstacle.pos, this.pos) <= obstacle.r;
//     }

//     follow(path) {
//         // Basic implementation for redundancy
//         let predict = this.vel.copy();
//         predict.setMag(25);
//         let predictPos = p5.Vector.add(this.pos, predict);
//         let normal = null;
//         let target = null;
//         let worldRecord = 1000000;
//         for (let i = 0; i < path.points.length - 1; i++) {
//             let a = path.points[i];
//             let b = path.points[i + 1];
//             let normalPoint = this.getNormalPoint(predictPos, a, b);
//             if (normalPoint.x < min(a.x, b.x) || normalPoint.x > max(a.x, b.x) ||
//                 normalPoint.y < min(a.y, b.y) || normalPoint.y > max(a.y, b.y)) {
//                 normalPoint = b.copy();
//             }
//             let distance = p5.Vector.dist(predictPos, normalPoint);
//             if (distance < worldRecord) {
//                 worldRecord = distance;
//                 normal = normalPoint;
//                 let dir = p5.Vector.sub(b, a);
//                 dir.setMag(25);
//                 target = p5.Vector.add(normal, dir);
//             }
//         }
//         if (worldRecord > path.radius && target !== null) {
//             return this.seek(target);
//         }
//         return createVector(0, 0);
//     }

//     getNormalPoint(p, a, b) {
//         let ap = p5.Vector.sub(p, a);
//         let ab = p5.Vector.sub(b, a);
//         ab.normalize();
//         ab.mult(ap.dot(ab));
//         return p5.Vector.add(a, ab);
//     }

//     align(vehicles) {
//         let neighborhoodsdist = 50;
//         let sum = createVector(0, 0);
//         let count = 0;
//         for (let other of vehicles) {
//             let d = p5.Vector.dist(this.pos, other.pos);
//             if ((d > 0) && (d < neighborhoodsdist)) {
//                 sum.add(other.vel);
//                 count++;
//             }
//         }
//         if (count > 0) {
//             sum.div(count);
//             sum.normalize();
//             sum.mult(this.maxSpeed);
//             let steer = p5.Vector.sub(sum, this.vel);
//             steer.limit(this.maxForce);
//             return steer;
//         } else {
//             return createVector(0, 0);
//         }
//     }

//     cohesion(vehicles) {
//         let neighborhoodsdist = 50;
//         let sum = createVector(0, 0);
//         let count = 0;
//         for (let other of vehicles) {
//             let d = p5.Vector.dist(this.pos, other.pos);
//             if ((d > 0) && (d < neighborhoodsdist)) {
//                 sum.add(other.pos);
//                 count++;
//             }
//         }
//         if (count > 0) {
//             sum.div(count);
//             return this.seek(sum);
//         } else {
//             return createVector(0, 0);
//         }
//     }

//     separate(vehicles) {
//         let desiredseparation = 25.0;
//         let steer = createVector(0, 0);
//         let count = 0;
//         for (let other of vehicles) {
//             let d = p5.Vector.dist(this.pos, other.pos);
//             if ((d > 0) && (d < desiredseparation)) {
//                 let diff = p5.Vector.sub(this.pos, other.pos);
//                 diff.normalize();
//                 diff.div(d);
//                 steer.add(diff);
//                 count++;
//             }
//         }
//         if (count > 0) {
//             steer.div(count);
//         }
//         if (steer.mag() > 0) {
//             steer.setMag(this.maxSpeed);
//             steer.sub(this.vel);
//             steer.limit(this.maxForce);
//         }
//         return steer;
//     }

//     flock(vehicles) {
//         let sep = this.separate(vehicles);
//         let ali = this.align(vehicles);
//         let coh = this.cohesion(vehicles);
//         sep.mult(1.5);
//         ali.mult(1.0);
//         coh.mult(1.0);
//         this.applyForce(sep);
//         this.applyForce(ali);
//         this.applyForce(coh);
//     }
// }


class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 16;

    // Behavior State
    this.behavior = "Wander"; // Default

    // Pour Wander
    this.wanderTheta = PI / 2;

    // Attack Cooldown
    this.lastShotTime = 0;

    // Debug info
    this.debug = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    stroke(255);
    strokeWeight(1);

    // Color based on behavior
    if (this.behavior === "Seek") fill(100, 255, 100);
    else if (this.behavior === "Flee") fill(255, 100, 100);
    else if (this.behavior === "Wander") fill(100, 100, 255);
    else if (this.behavior === "Boid (Flocking)") fill(200, 200, 50);
    else if (this.behavior === "Enemy") {
      // Modern Realistic Enemy Fighter Design
      noStroke();

      // Main body - dark metallic hull
      fill(40, 45, 50);
      beginShape();
      vertex(this.r * 1.8, 0); // Sharp nose
      vertex(this.r * 0.3, -this.r * 0.4);
      vertex(-this.r * 0.8, -this.r * 0.5);
      vertex(-this.r, -this.r * 0.3);
      vertex(-this.r, this.r * 0.3);
      vertex(-this.r * 0.8, this.r * 0.5);
      vertex(this.r * 0.3, this.r * 0.4);
      endShape(CLOSE);

      // Cockpit window (glowing red)
      fill(180, 20, 20, 200);
      beginShape();
      vertex(this.r * 1.2, 0);
      vertex(this.r * 0.5, -this.r * 0.25);
      vertex(this.r * 0.5, this.r * 0.25);
      endShape(CLOSE);

      // Armor panels (lighter gray)
      fill(60, 65, 70);
      triangle(
        this.r * 0.8,
        0,
        this.r * 0.2,
        -this.r * 0.3,
        this.r * 0.2,
        this.r * 0.3,
      );

      // Wings with red accents
      fill(50, 15, 15);
      ellipse(this.r * 0.1, -this.r * 0.6, this.r * 0.4, this.r * 0.3);
      ellipse(this.r * 0.1, this.r * 0.6, this.r * 0.4, this.r * 0.3);

      // Wing highlights
      fill(80, 25, 25);
      ellipse(this.r * 0.15, -this.r * 0.6, this.r * 0.2, this.r * 0.15);
      ellipse(this.r * 0.15, this.r * 0.6, this.r * 0.2, this.r * 0.15);

      // Engine exhausts (glowing)
      fill(255, 80, 0);
      ellipse(-this.r * 0.9, -this.r * 0.3, 6, 8);
      ellipse(-this.r * 0.9, this.r * 0.3, 6, 8);

      // Engine glow
      fill(255, 150, 0, 150);
      ellipse(-this.r * 0.95, -this.r * 0.3, 4, 6);
      ellipse(-this.r * 0.95, this.r * 0.3, 4, 6);

      // Engine trails (particles effect)
      fill(255, 100, 0, 100);
      ellipse(-this.r * 1.2, -this.r * 0.3, 8, 4);
      ellipse(-this.r * 1.2, this.r * 0.3, 8, 4);

      // Weapon hardpoints (small details)
      fill(30, 30, 35);
      rect(this.r * 0.4, -this.r * 0.45, this.r * 0.15, this.r * 0.08);
      rect(this.r * 0.4, this.r * 0.37, this.r * 0.15, this.r * 0.08);

      // Red warning lights (pulsing)
      fill(255, 0, 0, sin(frameCount * 0.1) * 127 + 128);
      circle(this.r * 0.3, -this.r * 0.5, 3);
      circle(this.r * 0.3, this.r * 0.5, 3);

      // Edge highlights for 3D effect
      stroke(80, 85, 90);
      strokeWeight(1);
      noFill();
      beginShape();
      vertex(this.r * 1.8, 0);
      vertex(this.r * 0.3, -this.r * 0.4);
      vertex(-this.r * 0.8, -this.r * 0.5);
      endShape();
    } else {
      fill(127);
      stroke(255);
      strokeWeight(2);
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    }

    // Default triangle for non-enemies if not handled above
    if (this.behavior !== "Enemy") {
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    }

    if (this.debug) {
      noFill();
      stroke(255, 50);
      circle(0, 0, this.r * 2);
    }

    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    else if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
    else if (this.pos.y < -this.r) this.pos.y = height + this.r;
  }

  // ... Copier coller les méthodes seek, arrive, flee, wander, avoid, flock, follow ...
  // Pour éviter de réécrire tout le fichier, je demande au modèle d'utiliser replace_file_content pour insérer les méthodes si elles manquent,
  // MAIS comme c'est write_to_file, je dois tout mettre.

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  arrive(target, stoppingDist = 0) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;

    let slowdownRadius = 100;

    if (d < slowdownRadius) {
      speed = map(d, stoppingDist, slowdownRadius, 0, this.maxSpeed);
    }

    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    return this.seek(target);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    return pursuit.mult(-1);
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(100);
    wanderPoint.add(this.pos);
    let wanderRadius = 50;
    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta);
    let y = wanderRadius * sin(theta);
    wanderPoint.add(x, y);
    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);
    let displaceRange = 0.3;
    this.wanderTheta += random(-displaceRange, displaceRange);
  }

  avoid(obstacles) {
    let ahead = this.vel.copy();
    ahead.mult(50); // Lookahead static or dynamic

    let ahead2 = ahead.copy().mult(0.5);

    if (this.debug) {
      push();
      stroke(0, 255, 0);
      line(this.pos.x, this.pos.y, this.pos.x + ahead.x, this.pos.y + ahead.y);
      pop();
    }

    let mostThreatening = null;
    let closestBoxPos = null;
    let closestDist = 10000;

    for (let obstacle of obstacles) {
      // Line Circle Intersection Check
      let collision = this.lineIntersectsCircle(ahead, ahead2, obstacle);

      if (
        collision &&
        (mostThreatening == null ||
          p5.Vector.dist(this.pos, obstacle.pos) <
            p5.Vector.dist(this.pos, mostThreatening.pos))
      ) {
        mostThreatening = obstacle;
      }
    }

    let avoidance = createVector(0, 0);

    if (mostThreatening != null) {
      avoidance.x = ahead.x - mostThreatening.pos.x;
      avoidance.y = ahead.y - mostThreatening.pos.y;
      avoidance.normalize();
      avoidance.mult(this.maxForce); // Should be maxAvoidForce maybe
      // Reynolds uses maxSpeed for steering usually, or maxForce directly
      avoidance.setMag(this.maxSpeed);
      avoidance.sub(this.vel);
      avoidance.limit(this.maxForce);
    }
    return avoidance;
  }

  lineIntersectsCircle(ahead, ahead2, obstacle) {
    // Check if circle is close to line ending at ahead
    // Simple version: check distance of ahead tip and ahead2 tip to center

    let p1 = p5.Vector.add(this.pos, ahead);
    let p2 = p5.Vector.add(this.pos, ahead2);

    let d1 = p5.Vector.dist(obstacle.pos, p1);
    let d2 = p5.Vector.dist(obstacle.pos, p2);

    return (
      d1 <= obstacle.r ||
      d2 <= obstacle.r ||
      p5.Vector.dist(obstacle.pos, this.pos) <= obstacle.r
    );
  }

  follow(path) {
    // Basic implementation for redundancy
    let predict = this.vel.copy();
    predict.setMag(25);
    let predictPos = p5.Vector.add(this.pos, predict);
    let normal = null;
    let target = null;
    let worldRecord = 1000000;
    for (let i = 0; i < path.points.length - 1; i++) {
      let a = path.points[i];
      let b = path.points[i + 1];
      let normalPoint = this.getNormalPoint(predictPos, a, b);
      if (
        normalPoint.x < min(a.x, b.x) ||
        normalPoint.x > max(a.x, b.x) ||
        normalPoint.y < min(a.y, b.y) ||
        normalPoint.y > max(a.y, b.y)
      ) {
        normalPoint = b.copy();
      }
      let distance = p5.Vector.dist(predictPos, normalPoint);
      if (distance < worldRecord) {
        worldRecord = distance;
        normal = normalPoint;
        let dir = p5.Vector.sub(b, a);
        dir.setMag(25);
        target = p5.Vector.add(normal, dir);
      }
    }
    if (worldRecord > path.radius && target !== null) {
      return this.seek(target);
    }
    return createVector(0, 0);
  }

  getNormalPoint(p, a, b) {
    let ap = p5.Vector.sub(p, a);
    let ab = p5.Vector.sub(b, a);
    ab.normalize();
    ab.mult(ap.dot(ab));
    return p5.Vector.add(a, ab);
  }

  align(vehicles) {
    let neighborhoodsdist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborhoodsdist) {
        sum.add(other.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(vehicles) {
    let neighborhoodsdist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborhoodsdist) {
        sum.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  }

  separate(vehicles) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredseparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
    }
    if (steer.mag() > 0) {
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  flock(vehicles) {
    let sep = this.separate(vehicles);
    let ali = this.align(vehicles);
    let coh = this.cohesion(vehicles);
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }
}