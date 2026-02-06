function playShootSound(pitch = 1.0) {
    let osc = new p5.Oscillator('triangle');
    osc.start();
    osc.amp(0);

    // Frequency Sweep (Pew Effect)
    osc.freq(800 * pitch);
    osc.freq(100, 0.15); // Drop frequency over 0.15s

    // Amplitude Envelope
    osc.amp(0.3, 0.01); // Attack
    osc.amp(0, 0.15, 0.1); // Decay (wait 0.1s then fade)

    // Stop after duration
    setTimeout(() => {
        osc.stop();
        // osc.dispose(); // p5.sound usually manages this, but explicit dispose might be safer for memory
    }, 200);
}

function playExplosionSound(size = 1.0) {
    let noise = new p5.Noise('white');
    noise.start();
    noise.amp(0);

    // Amplitude Envelope
    let duration = 0.3 * size;
    noise.amp(0.5, 0.01); // Attack
    noise.amp(0, duration, 0.05); // Decay

    setTimeout(() => {
        noise.stop();
    }, duration * 1000 + 100);
}

// User interaction required to start AudioContext usually
function startAudio() {
    userStartAudio();
}

function playGameOverSound() {
    // 1. Explosion (Background rumble)
    playExplosionSound(1.5);

    // 2. Text to Speech "Game Over"
    let msg = new SpeechSynthesisUtterance("Game Over");
    msg.rate = 0.8; // Slower, more dramatic
    msg.pitch = 0.5; // Deep voice
    msg.volume = 1.0;

    // Optional: Try to select a specific voice if available
    let voices = window.speechSynthesis.getVoices();
    // Prefer a "Google US English" or similar if possible, but default is fine

    window.speechSynthesis.speak(msg);
}
