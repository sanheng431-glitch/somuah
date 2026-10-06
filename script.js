const message = "Hour is Gay";
let timer;
let audioCtx = null;

// Sound synthesizer using Web Audio API
function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio autoplay might be prevented silently
    }
}

function playOpenFanfare() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 'triangle', 0.25, 0.12), idx * 80);
    });
}

function playPopSound() {
    playTone(600 + Math.random() * 400, 'sine', 0.08, 0.08);
}

// Generate background twinkle stars
function createStars() {
    const count = 25;
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "floating-star";
        const size = Math.random() * 4 + 2;
        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.setProperty('--duration', (3 + Math.random() * 4) + 's');
        star.style.animationDelay = (Math.random() * 5) + 's';
        document.body.appendChild(star);
    }
}
createStars();

// 3D Card Tilt Effect on Mouse Move
const card = document.getElementById("card");
document.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * -20;
    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

document.addEventListener("mouseleave", () => {
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

function openMsg() {
    const intro = document.getElementById("intro");
    const out = document.getElementById("msg");
    const back = document.getElementById("back");
    const cursor = document.getElementById("cursor");

    intro.classList.add("hide");
    setTimeout(() => intro.classList.add("gone"), 350);
    card.classList.add("opened");

    out.textContent = "";
    cursor.classList.remove("hidden");
    back.style.display = "none";

    playOpenFanfare();
    createConfettiBlast();
    createEmojiBurst();

    setTimeout(() => {
        let i = 0;
        timer = setInterval(() => {
            out.textContent += message[i++];
            playPopSound();
            if (i >= message.length) {
                clearInterval(timer);
                cursor.classList.add("hidden");
                back.style.display = "inline-block";
            }
        }, 100);
    }, 400);
}

function closeMsg() {
    clearInterval(timer);
    const intro = document.getElementById("intro");
    const out = document.getElementById("msg");
    const back = document.getElementById("back");
    const cursor = document.getElementById("cursor");

    out.textContent = "";
    cursor.classList.add("hidden");
    back.style.display = "none";
    card.classList.remove("opened");

    intro.classList.remove("gone");
    requestAnimationFrame(() => intro.classList.remove("hide"));
    playTone(350, 'sine', 0.15, 0.1);
}

function createConfettiBlast() {
    const colors = ["#ff0844", "#ffb199", "#00f2fe", "#4facfe", "#f9d423", "#f093fb", "#43e97b", "#ffffff"];
    const shapes = ['50%', '3px', '0%'];

    for (let i = 0; i < 90; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "vw";
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
        c.style.width = (Math.random() * 8 + 6) + "px";
        c.style.height = (Math.random() * 12 + 8) + "px";
        c.style.animationDuration = (2.2 + Math.random() * 2) + "s";
        c.style.animationDelay = (Math.random() * 0.4) + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4500);
    }
}

function createEmojiBurst() {
    const emojis = ["💖", "✨", "🎉", "🌈", "🔥", "🦄", "⭐"];
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
        const el = document.createElement("div");
        el.className = "float-emoji";
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = (centerX + (Math.random() * 80 - 40)) + "px";
        el.style.top = (centerY + (Math.random() * 60 - 30)) + "px";
        el.style.setProperty('--tx-start', (Math.random() * 100 - 50) + 'px');
        el.style.setProperty('--tx-end', (Math.random() * 200 - 100) + 'px');
        el.style.setProperty('--rot', (Math.random() * 40 - 20) + 'deg');
        el.style.setProperty('--rot-end', (Math.random() * 90 - 45) + 'deg');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2900);
    }
}
