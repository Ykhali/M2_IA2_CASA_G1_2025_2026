let vehicles = [];
let obstacles = [];
let snakes = [];
let paths = []; // Support multiple paths
let target;

// Tool selection
let currentTool = "Vehicle"; // Default
let currentBehavior = "Seek"; // Default behavior for new vehicles

// UI Elements
let sliderMaxSpeed, sliderMaxForce;
let selectTool, selectBehavior;
let debugCheckbox;

function setup() {
    createCanvas(windowWidth, windowHeight);
    createUI();

    target = createVector(width / 2, height / 2);
}

function createUI() {
    let controls = select('#controls');
    if (!controls) {
        controls = createDiv('');
        controls.id('controls');
    }
    controls.html(''); // Clear existing

    // Tool Selector
    let divTool = createDiv('Outil: ');
    divTool.parent(controls);
    selectTool = createSelect();
    selectTool.parent(divTool);
    selectTool.option('Véhicule (Simple)');
    selectTool.option('Snake (Serpent)');
    selectTool.option('Obstacle');
    selectTool.option('Path (Chemin)');
    selectTool.changed(() => {
        currentTool = selectTool.value();
        updateUIState();
    });

    // Behavior Selector (only visible if Tool = Vehicle)
    let divBehavior = createDiv('Comportement: ');
    divBehavior.parent(controls);
    divBehavior.id('divBehavior');
    selectBehavior = createSelect();
    selectBehavior.parent(divBehavior);
    selectBehavior.option('Seek');
    selectBehavior.option('Flee');
    selectBehavior.option('Arrive');
    selectBehavior.option('Wander');
    selectBehavior.option('Boid (Flocking)');
    selectBehavior.changed(() => currentBehavior = selectBehavior.value());

    // Sliders
    let divSpeed = createDiv('Vitesse Max: ');
    divSpeed.parent(controls);
    sliderMaxSpeed = createSlider(1, 20, 6, 0.1);
    sliderMaxSpeed.parent(divSpeed);

    let divForce = createDiv('Force Max: ');
    divForce.parent(controls);
    sliderMaxForce = createSlider(0.05, 1, 0.2, 0.01);
    sliderMaxForce.parent(divForce);

    // Debug Toggle
    let divDebug = createDiv('');
    divDebug.parent(controls);
    debugCheckbox = createCheckbox('Debug Info', false);
    debugCheckbox.parent(divDebug);

    // Clear Button
    let btnClear = createButton('Tout Effacer');
    btnClear.parent(controls);
    btnClear.mousePressed(() => {
        vehicles = [];
        obstacles = [];
        snakes = [];
        paths = [];
    });

    updateUIState();
}

function updateUIState() {
    let divBehavior = select('#divBehavior');
    if (currentTool.includes('Véhicule')) {
        divBehavior.style('display', 'block');
    } else {
        divBehavior.style('display', 'none');
    }
}

function mousePressed() {
    // Prevent spawning when clicking on controls
    if (mouseY < 100 && mouseX < 300) return;

    if (currentTool.includes('Véhicule')) {
        let v = new Vehicle(mouseX, mouseY);
        v.behavior = currentBehavior; // Assign behavior

        // Si c'est un pur "Seek" ou "Arrive", il va suivre la souris par défaut
        // Si "Wander", il ignore la target.
        vehicles.push(v);

    } else if (currentTool.includes('Snake')) {
        // Create a new snake
        let head = new Snake(mouseX, mouseY, 0, color(random(100, 255), random(100, 255), 0));
        snakes.push(head);
        // Body
        for (let i = 1; i < 10; i++) {
            snakes.push(new Snake(mouseX + i * 10, mouseY, i, head.color));
        }

    } else if (currentTool.includes('Obstacle')) {
        obstacles.push(new Obstacle(mouseX, mouseY, random(30, 80)));

    } else if (currentTool.includes('Path')) {
        // Ajoute un point au dernier chemin ou crée un nouveau chemin
        if (paths.length === 0 || keyIsDown(SHIFT)) {
            let p = new Path();
            p.addPoint(0, height / 2); // Start off screen
            p.addPoint(mouseX, mouseY);
            paths.push(p);
        } else {
            paths[paths.length - 1].addPoint(mouseX, mouseY);
        }
    }
}

function draw() {
    background(0);

    // Global parameters
    let maxS = sliderMaxSpeed.value();
    let maxF = sliderMaxForce.value();
    let debug = debugCheckbox.checked();

    // Mouse Target
    target.set(mouseX, mouseY);
    if (debug) {
        fill(255, 0, 0);
        noStroke();
        circle(target.x, target.y, 10);
    }

    // Display Obstacles
    for (let o of obstacles) o.show(debug);

    // Display Paths
    for (let p of paths) p.show();

    // Handle Vehicles
    for (let v of vehicles) {
        v.maxSpeed = maxS;
        v.maxForce = maxF;
        v.debug = debug;

        // 1. Generic Force: Avoid Obstacles (Always efficient to have)
        let avoidForce = v.avoid(obstacles);
        avoidForce.mult(3.0); // High priority
        v.applyForce(avoidForce);

        // 2. Specific Behavioral Forces
        if (v.behavior === 'Seek') {
            v.applyForce(v.seek(target));
        } else if (v.behavior === 'Flee') {
            v.applyForce(v.flee(target));
        } else if (v.behavior === 'Arrive') {
            v.applyForce(v.arrive(target));
        } else if (v.behavior === 'Wander') {
            v.wander();
        } else if (v.behavior === 'Boid (Flocking)') {
            v.flock(vehicles);
            // Also wander a bit or seek to stay on screen?
            v.edges(); // Boids need edges logic
        }

        // 3. Path Following (Global check: if paths exist, follow closest?)
        // Pour simplifier : si un chemin existe et que le mode n'est pas "Wander" pur
        if (paths.length > 0 && v.behavior !== 'Wander') {
            // For simplicity, follow first path
            let followForce = v.follow(paths[0]);
            v.applyForce(followForce);
        }

        v.update();
        v.edges();
        v.show();
    }

    // Handle Snakes
    // Logic: Head seeks mouse (Arrive), body parts arrive at previous part

    // Group snakes by "clusters" is tricky with flat array. 
    // Ideally we should have Snake object containing segments.
    // But sticking to flat array as per previous implementation logic:

    // Better logic: iterate snakes, if index 0 -> head logic. If index > 0 -> follow prev.
    // WARNING: "prev" assumes order in array.

    let prev = null;
    for (let s of snakes) {
        s.maxSpeed = maxS;
        s.maxForce = maxF;

        if (s.index === 0) {
            // Head
            s.applyForce(s.arrive(target));
            prev = s;
        } else {
            // Body segment
            // Must find its predecessor. In the flat array, it's usually the one before it 
            // IF we push them in order.
            // A clearer way is to link them in object, but let's assume index-1 is prev
            // Warning: This breaks if we delete snakes. 
            // Correction: Rely on the simple loop order since we push head then body.
            if (prev) {
                let arriveForce = s.arrive(prev.pos);
                arriveForce.mult(5); // Strong cohesion
                s.applyForce(arriveForce);

                // Keep distance
                let d = p5.Vector.dist(s.pos, prev.pos);
                if (d < 20) {
                    s.vel.mult(0.5); // Brake
                }
                prev = s;
            }
        }

        // Snakes also avoid obstacles
        let avoid = s.avoid(obstacles);
        avoid.mult(4);
        s.applyForce(avoid);

        s.update();
        s.show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
