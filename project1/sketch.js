let player;
let bullets = [];
let enemies = [];
let asteroids = [];
let mines = [];
let debris = [];
let allies = []; // Helper bots
let foods = []; // Power-ups
let snakes = []; // Neutral/Hostile entities
let particles; // Particle System

let score = 0;
let level = 1; // Current Level
let gameState = 'MENU'; // MENU, PLAYING, GAMEOVER

let uiScore, uiLevel, uiHealthBar, uiHealthFill, uiStartScreen, uiGameUI, uiGameOverScreen, uiFinalScore;

// Assets
let imgPlayer, imgEnemySeeker, imgEnemyShooter, imgAsteroid, imgBg;

function preload() {
    imgPlayer = loadImage('assets/player.png');
    imgEnemySeeker = loadImage('assets/enemy_seeker.png');
    imgEnemyShooter = loadImage('assets/enemy_shooter.png');
    imgAsteroid = loadImage('assets/asteroid.png');
    imgBg = loadImage('assets/bg.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // UI References
    uiScore = select('#score');
    uiLevel = select('#level'); // Level Display
    uiHealthFill = select('#health-fill');
    uiStartScreen = select('#start-screen');
    uiGameUI = select('#game-ui');
    uiGameOverScreen = select('#game-over-screen');
    uiFinalScore = select('#final-score');

    // Buttons
    select('#start-btn').mousePressed(startGame);
    select('#restart-btn').mousePressed(startGame);

    // UI for spawning snakes (Dynamically created for now)
    let btn = createButton('Add Snake');
    btn.position(10, 70);
    btn.mousePressed(() => {
        let r = random(50, 255);
        let g = random(50, 255);
        let b = random(50, 255);
        snakes.push(new Snake(random(width), random(height), color(r, g, b)));
    });

    resetGame();
}

function resetGame() {
    player = new Player();
    bullets = [];
    enemies = [];
    asteroids = [];
    mines = [];
    debris = [];
    allies = [];
    foods = [];
    snakes = [];
    particles = new ParticleSystem(); // Init Particles
    score = 0;
    level = 1; // Reset Level
    updateUI();
}

function startGame() {
    gameState = 'PLAYING';
    resetGame();

    uiStartScreen.addClass('hidden');
    uiGameOverScreen.addClass('hidden');
    uiGameUI.removeClass('hidden');

    // Spawn initial asteroids
    for (let i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
}

function draw() {
    // Draw Background
    image(imgBg, 0, 0, width, height); // Stretch background

    // Run Particle System
    if (particles) particles.run();

    if (gameState === 'PLAYING') {
        runGame();
    } else if (gameState === 'MENU') {
        // Maybe show some floating asteroids
        // Just keeping generic background for now
    } else if (gameState === 'GAMEOVER') {
        // Maybe show static last frame or just black
    }
}

function runGame() {
    // Spawning Logic
    if (frameCount % 60 === 0) { // Every second-ish
        if (random() < 0.3 + (score * 0.001)) { // Increase difficulty
            let type = random() < 0.7 ? 'SEEKER' : 'SHOOTER';
            // Spawn on edge
            let x, y;
            if (random() < 0.5) {
                x = random() < 0.5 ? -50 : width + 50;
                y = random(height);
            } else {
                x = random(width);
                y = random() < 0.5 ? -50 : height + 50;
            }
            enemies.push(new Enemy(x, y, type));
        }
    }

    if (frameCount % 180 === 0) {
        asteroids.push(new Asteroid());
    }

    // Player
    player.update();
    player.show();
    player.shoot(bullets, level);

    // Allies
    for (let i = allies.length - 1; i >= 0; i--) {
        let ally = allies[i];
        ally.updateBehavior(player, enemies, bullets);
        ally.show();
        // Maybe ally health/death logic here later
    }

    // Check Player Death
    if (player.isDead) {
        gameOver();
    }

    // Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.update();
        b.show();

        let hit = false;

        // Player Bullets affecting Enemies
        if (b.owner === 'PLAYER') {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (b.hits(enemies[j])) {
                    if (enemies[j].takeDamage(b.damage)) { // Use bullet damage
                        // Explosion
                        particles.createExplosion(enemies[j].pos.x, enemies[j].pos.y, enemies[j].color, 20);
                        enemies.splice(j, 1);
                        score += 10;
                    }
                    particles.createExplosion(b.pos.x, b.pos.y, '#0ff', 5); // Hit effect
                    hit = true;
                    break;
                }
            }
            // Player Bullets affecting Asteroids
            if (!hit) {
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    if (b.hits(asteroids[j])) {
                        // Break asteroid
                        particles.createExplosion(asteroids[j].pos.x, asteroids[j].pos.y, '#888', 15);
                        asteroids.splice(j, 1);
                        score += 5;
                        hit = true;
                        break;
                    }
                }
            }
            // Player Bullets affecting Mines
            if (!hit) {
                for (let j = mines.length - 1; j >= 0; j--) {
                    if (b.hits(mines[j])) {
                        particles.createExplosion(mines[j].pos.x, mines[j].pos.y, '#f00', 30);
                        // Explosion damage nearby enemies?
                        for (let k = enemies.length - 1; k >= 0; k--) {
                            if (p5.Vector.dist(mines[j].pos, enemies[k].pos) < 100) {
                                enemies[k].takeDamage(50);
                            }
                        }
                        mines.splice(j, 1);
                        score += 20;
                        hit = true;
                        break;
                    }
                }
            }
            // Bullets affecting Debris
            if (!hit) {
                for (let j = debris.length - 1; j >= 0; j--) {
                    if (b.hits(debris[j])) {
                        particles.createExplosion(debris[j].pos.x, debris[j].pos.y, '#888', 5);
                        debris.splice(j, 1);
                        score += 2;
                        hit = true;
                        break;
                    }
                }
            }
        }
        // Enemy Bullets affecting Player
        else if (b.owner === 'ENEMY') {
            if (b.hits(player)) {
                player.takeDamage(10);
                particles.createExplosion(player.pos.x, player.pos.y, '#f00', 10);
                hit = true;
            }
        }

        if (b.toDelete || hit) {
            bullets.splice(i, 1);
        }
    }

    // Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.update(player, bullets);
        e.show();

        // Collision with Player
        if (p5.Vector.dist(e.pos, player.pos) < e.r + player.r) {
            player.takeDamage(20);
            enemies.splice(i, 1); // Kamikaze
        }
    }

    // Asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let a = asteroids[i];
        a.update();
        a.show();

        if (a.edges()) {
            asteroids.splice(i, 1);
        } else if (p5.Vector.dist(a.pos, player.pos) < a.r + player.r) {
            player.takeDamage(10); // Collision damage
            // Bounce player?
        }
    }

    // Mines (Level 3+)
    if (level >= 3 && frameCount % 600 === 0) { // Every 10s
        mines.push(new Mine());
    }

    for (let i = mines.length - 1; i >= 0; i--) {
        let m = mines[i];
        m.update();
        m.show();

        // Collision Player
        if (p5.Vector.dist(m.pos, player.pos) < m.r + player.r + 5) {
            m.explode(player);
            particles.createExplosion(m.pos.x, m.pos.y, '#f00', 30);
            mines.splice(i, 1);
        }
    }

    // Debris (Level 2+)
    if (level >= 2 && frameCount % 60 === 0) { // Every 1s
        debris.push(new Debris());
    }

    for (let i = debris.length - 1; i >= 0; i--) {
        let d = debris[i];
        d.update();
        d.show();

        if (d.edges()) {
            debris.splice(i, 1);
        } else if (p5.Vector.dist(d.pos, player.pos) < d.r + player.r) {
            player.takeDamage(5); // Low Damage
            debris.splice(i, 1);
        }
    }

    // Bullet Collisions with Mines/Debris
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        let hit = false;

        // ... (Existing enemy/asteroid logic would be here, but easier to insert checks if possible)
        // Since we are iterating bullets here in runGame for collision, we need to add checks
        // However, the main bullet loop is above. Let's merge logic or add dedicated loop.
        // For simplicity, let's look at the bullet loop in runGame and add it there.
    }

    // Food / Powerups
    // Spawn random food
    if (frameCount % 600 === 0) { // Every 10 seconds (Energy)
        foods.push(new Food(random(50, width - 50), random(50, height - 50), 'ENERGY'));
    }
    if (frameCount % 300 === 0) { // Every 5 seconds (Snake Food)
        foods.push(new Food(random(50, width - 50), random(50, height - 50), 'BIOMASS'));
    }
    // Weapon Powerup (Rare, every 20 seconds)
    if (frameCount % 1200 === 0) {
        foods.push(new Food(random(50, width - 50), random(50, height - 50), 'WEAPON'));
    }

    for (let i = foods.length - 1; i >= 0; i--) {
        let f = foods[i];
        f.update();
        f.show();

        let eaten = false;

        // Player Collect
        if (p5.Vector.dist(player.pos, f.pos) < player.r + f.r) {
            if (f.type === 'ENERGY') {
                player.activateBoost();
                particles.createExplosion(player.pos.x, player.pos.y, '#0f0', 10);
                score += 50;
                eaten = true;
            } else if (f.type === 'WEAPON') {
                player.activateWeaponBoost();
                particles.createExplosion(player.pos.x, player.pos.y, '#ffa500', 15);
                score += 100;
                eaten = true;
            } else if (f.type === 'BIOMASS') {
                score += 10; // Small bonus for stealing snake food
                eaten = true;
            }
        }

        if (eaten || f.isDead()) {
            foods.splice(i, 1);
        }
    }

    // Snakes Logic
    for (let i = snakes.length - 1; i >= 0; i--) {
        let s = snakes[i];

        // Find closest Biomass
        let closestFood = null;
        let minDist = Infinity;
        for (let f of foods) {
            if (f.type === 'BIOMASS') {
                let d = p5.Vector.dist(s.pos, f.pos);
                if (d < minDist) {
                    minDist = d;
                    closestFood = f;
                }
            }
        }

        s.updateSnake(closestFood);
        s.show();

        // Eating Logic
        for (let j = foods.length - 1; j >= 0; j--) {
            let f = foods[j];
            if (f.type === 'BIOMASS' && p5.Vector.dist(s.pos, f.pos) < s.r + f.r) {
                s.grow();
                // particles.createExplosion(s.pos.x, s.pos.y, '#f0f', 5);
                foods.splice(j, 1);
            }
        }

        // Damage Logic (Bullets)
        for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            if (b.hits(s)) {
                s.shrink();
                particles.createExplosion(s.pos.x, s.pos.y, '#a0f', 10);
                bullets.splice(j, 1);
                // If snake is too small, maybe kill it? For now just shrink minimum
                if (s.length <= 2) {
                    snakes.splice(i, 1);
                    score += 100;
                    break; // Snake died
                }
            }
        }
    }

    updateUI();
}

function updateUI() {
    if (gameState === 'PLAYING') {
        // Level Up Logic
        let nextLevelScore = level * 300;
        if (score >= nextLevelScore) {
            level++;
            // Visual feedback?
            // Increase difficulty (maybe in spawn logic)
        }

        uiScore.html('SCORE: ' + score);
        uiLevel.html('LEVEL: ' + level);
        let hpPercent = (player.health / player.maxHealth) * 100;
        uiHealthFill.style('width', hpPercent + '%');
    }
}

function gameOver() {
    gameState = 'GAMEOVER';
    uiGameUI.addClass('hidden');
    uiGameOverScreen.removeClass('hidden');
    uiFinalScore.html('Final Score: ' + score);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        let r = random(50, 255);
        let g = random(50, 255);
        let b = random(50, 255);
        snakes.push(new Snake(random(width), random(height), color(r, g, b)));
    }

    // Spawn Ally
    if (key === 'p') {
        allies.push(new Ally(player.pos.x + random(-50, 50), player.pos.y + random(-50, 50)));
    }
}
