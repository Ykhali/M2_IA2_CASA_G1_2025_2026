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
    let msg = new SpeechSynthesisUtterance("Game Over! Total Disaster!");
    msg.rate = 0.6; // Very slow (Dramatic/Funny)
    msg.pitch = 0.1; // Extremely deep (Monster/Strong)
    msg.volume = 1.0;

    // Optional: Try to select a specific voice if available
    let voices = window.speechSynthesis.getVoices();
    // Prefer a "Google US English" or similar if possible, but default is fine

    window.speechSynthesis.speak(msg);
}

function playLevelUpSound() {
    let osc = new p5.Oscillator('sine');
    let env = new p5.Envelope();

    osc.start();
    osc.freq(440);
    osc.amp(env);

    // Rising arpeggio effect
    osc.freq(440);
    osc.freq(554, 0.1); // C#
    osc.freq(659, 0.2); // E
    osc.freq(880, 0.3); // A (High)

    env.setADSR(0.01, 0.1, 0.5, 0.5);
    env.setRange(0.5, 0);
    env.play();

    osc.stop(1.0);
}
