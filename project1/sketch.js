let player;
let bullets = [];
let enemies = [];
let asteroids = [];

let score = 0;
let gameState = 'MENU'; // MENU, PLAYING, GAMEOVER

let uiScore, uiHealthBar, uiHealthFill, uiStartScreen, uiGameUI, uiGameOverScreen, uiFinalScore;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // UI References
    uiScore = select('#score');
    uiHealthFill = select('#health-fill');
    uiStartScreen = select('#start-screen');
    uiGameUI = select('#game-ui');
    uiGameOverScreen = select('#game-over-screen');
    uiFinalScore = select('#final-score');

    // Buttons
    select('#start-btn').mousePressed(startGame);
    select('#restart-btn').mousePressed(startGame);

    resetGame();
}

function resetGame() {
    player = new Player();
    bullets = [];
    enemies = [];
    asteroids = [];
    score = 0;
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
    background(0);

    if (gameState === 'PLAYING') {
        runGame();
    } else if (gameState === 'MENU') {
        // Background animation for menu
        background(0, 0, 20);
        // Maybe show some floating asteroids
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
    player.shoot(bullets);

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
                    if (enemies[j].takeDamage(10)) {
                        enemies.splice(j, 1);
                        score += 10;
                    }
                    hit = true;
                    break;
                }
            }
            // Player Bullets affecting Asteroids
            if (!hit) {
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    if (b.hits(asteroids[j])) {
                        // Break asteroid? For now just destroy
                        asteroids.splice(j, 1);
                        score += 5;
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

    updateUI();
}

function updateUI() {
    if (gameState === 'PLAYING') {
        uiScore.html('SCORE: ' + score);
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
