// --- SCROLL REVEAL LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // --- AUDIO PLAYER LOGIC ---
    const playBtn = document.getElementById('play-btn');
    const audio = document.getElementById('secret-audio');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
        if (!audio.src || audio.src.endsWith("voice.mp3") && !audio.readyState) {
            alert("Please replace 'voice.mp3' in the folder to hear the audio!");
            return;
        }

        if (isPlaying) {
            audio.pause();
            playBtn.innerText = "▶ Play with headphones";
        } else {
            audio.play();
            playBtn.innerText = "⏸ Pause Message";
        }
        isPlaying = !isPlaying;
    });

    audio.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.innerText = "▶ Play with headphones";
    });

    // --- BACKGROUND PARTICLES LOGIC ---
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(255, 42, 133, 0.4)' : 'rgba(183, 33, 255, 0.4)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numParticles = window.innerWidth < 768 ? 50 : 100;
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // --- CONFETTI LOGIC (Final Section) ---
    const confettiCanvas = document.getElementById("confetti-canvas");
    const confettiCtx = confettiCanvas.getContext("2d");
    let confettis = [];
    let confettiActive = false;

    // Only run confetti when final section is in view to save resources
    const finalSection = document.getElementById('final');
    const confettiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                confettiCanvas.width = finalSection.offsetWidth;
                confettiCanvas.height = finalSection.offsetHeight;
                if(!confettiActive) {
                    confettiActive = true;
                    initConfetti();
                    renderConfetti();
                }
            } else {
                confettiActive = false;
            }
        });
    }, { threshold: 0.1 });
    
    confettiObserver.observe(finalSection);

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            // Reset to top if it falls off bottom
            if (this.y > confettiCanvas.height) {
                this.y = -10;
                this.x = Math.random() * confettiCanvas.width;
            }
        }
        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = this.color;
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    function initConfetti() {
        confettis = [];
        for (let i = 0; i < 150; i++) {
            confettis.push(new ConfettiPiece());
        }
    }

    function renderConfetti() {
        if(!confettiActive) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettis.forEach(c => {
            c.update();
            c.draw();
        });
        requestAnimationFrame(renderConfetti);
    }
});