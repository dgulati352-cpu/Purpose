document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelopeScreen');
    const confessionScreen = document.getElementById('confessionScreen');
    const celebrationScreen = document.getElementById('celebrationScreen');
    const typewriterElement = document.getElementById('typewriter');
    const questionContainer = document.getElementById('questionContainer');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const dateOptions = document.querySelectorAll('.date-option');
    const dateSelect = document.getElementById('dateSelect');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    const cuteBanner = document.getElementById('cuteBanner');

    // --- AUDIO EFFECTS ---
    const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
    popSound.volume = 0.4;
    successSound.volume = 0.5;

    // --- CONFIG & STATE ---
    let isMusicPlaying = false;
    let yesScale = 1.0;
    let dodgeCount = 0;
    let selectedDateType = 'Cozy Coffee Date ☕';

    // Set minimum date picker to today
    const today = new Date().toISOString().split('T')[0];
    dateSelect.min = today;
    dateSelect.value = today;

    // List of sweet messages for the typewriter effect
    const messages = [
        "Hey there... 🌸",
        "I've been keeping a secret in my heart for a while now...",
        "Every time I think of you, my day gets a little brighter.",
        "Your smile, your laughter, and your kind heart mean the world to me.",
        "You're truly the most wonderful person I've ever met.",
        "I couldn't keep this bottled up any longer..."
    ];

    // Funny runaway texts for the NO button
    const noTexts = [
        "Are you sure? 🥺",
        "Think again! 🌸",
        "No way! 🚫",
        "Plllzzzzz? 👉👈",
        "But I love you! ❤️",
        "Wrong button! 😜",
        "Try clicking the other one! 😉",
        "I will be sad... 😭",
        "You can't say no! 💖",
        "Don't break my heart 💔"
    ];

    // --- MUSIC CONTROL ---
    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('i').className = 'fas fa-volume-mute';
            musicToggle.querySelector('.music-tooltip').textContent = 'Play Music 🎵';
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.querySelector('i').className = 'fas fa-music';
                musicToggle.querySelector('.music-tooltip').textContent = 'Mute Music 🔇';
            }).catch(err => {
                console.log("Audio play blocked by browser:", err);
            });
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggle.addEventListener('click', toggleMusic);

    // --- ENVELOPE OPENING ---
    envelope.addEventListener('click', () => {
        // Play music on first interaction if not playing
        if (!isMusicPlaying) {
            toggleMusic();
        }

        envelope.classList.add('open');
        
        // Transition to Confession Screen after letter animation completes
        setTimeout(() => {
            envelopeScreen.style.animation = 'fadeIn 0.5s reverse forwards';
            setTimeout(() => {
                envelopeScreen.classList.remove('screen-active');
                envelopeScreen.classList.add('screen-hidden');
                
                confessionScreen.classList.remove('screen-hidden');
                confessionScreen.classList.add('screen-active');
                
                // Start typewriter effect
                startTypewriter(0);
            }, 500);
        }, 1200);
    });

    // --- TYPEWRITER EFFECT ---
    function startTypewriter(index) {
        if (index < messages.length) {
            typewriterElement.innerHTML = '';
            let text = messages[index];
            let i = 0;
            
            // Add typing indicator
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            typewriterElement.appendChild(cursor);

            function typeChar() {
                if (i < text.length) {
                    cursor.before(text.charAt(i));
                    i++;
                    setTimeout(typeChar, 45); // Speed of typing
                } else {
                    // Finished typing this sentence, wait and move to next
                    setTimeout(() => {
                        // Fade out text
                        typewriterElement.style.transition = 'opacity 0.5s ease';
                        typewriterElement.style.opacity = '0';
                        
                        setTimeout(() => {
                            typewriterElement.style.opacity = '1';
                            startTypewriter(index + 1);
                        }, 500);
                    }, 2000); // How long the text stays visible
                }
            }
            typeChar();
        } else {
            // Typewriter finished, show proposal question
            typewriterElement.innerHTML = "I have a question to ask you...";
            cuteBanner.src = 'https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif'; // Blushing bear
            questionContainer.classList.remove('hidden');
        }
    }

    // --- RUNAWAY NO BUTTON ---
    function runaway() {
        dodgeCount++;
        
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => {});

        // Swap illustration to sad bear
        cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif';

        // Check if self-destruction of NO button is reached
        if (dodgeCount >= 10) {
            noBtn.style.opacity = '0';
            noBtn.style.pointerEvents = 'none';
            typewriterElement.innerHTML = "No is no longer an option! Click YES! 🥰";
            cuteBanner.src = 'https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif';
            return;
        }

        // 1. Change text of NO button
        const randomText = noTexts[Math.min(dodgeCount - 1, noTexts.length - 1)];
        noBtn.textContent = randomText;

        // 2. Make YES button bigger
        yesScale += 0.35; // Grow slightly faster
        yesBtn.style.transform = `scale(${yesScale})`;
        // Increase padding and adjust line height slightly for extreme sizes
        if (yesScale > 2) {
            yesBtn.style.boxShadow = `0 12px 40px rgba(255, 77, 109, ${Math.min(0.35 + (yesScale * 0.05), 0.8)})`;
        }

        // 3. Move NO button to a random position
        const padding = 30;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
        // Calculate bounds in the viewport
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        
        const randomX = Math.max(padding, Math.random() * maxX);
        const randomY = Math.max(padding, Math.random() * maxY);
        
        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
        noBtn.style.zIndex = '999';
    }

    noBtn.addEventListener('mouseover', runaway);
    noBtn.addEventListener('mouseenter', runaway);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents tapping on mobile from clicking
        runaway();
    });

    // Hover reactions on YES button
    yesBtn.addEventListener('mouseenter', () => {
        cuteBanner.src = 'https://media.tenor.com/8Q9Qd2hM06gAAAAi/milk-and-mocha-happy.gif';
    });
    yesBtn.addEventListener('mouseleave', () => {
        if (dodgeCount < 10) {
            cuteBanner.src = 'https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif';
        }
    });

    // --- YES BUTTON & CELEBRATION ---
    yesBtn.addEventListener('click', () => {
        // Play success sound
        successSound.currentTime = 0;
        successSound.play().catch(e => {});

        confessionScreen.classList.remove('screen-active');
        confessionScreen.classList.add('screen-hidden');
        
        celebrationScreen.classList.remove('screen-hidden');
        celebrationScreen.classList.add('screen-active');
        
        // Trigger Canvas Confetti
        triggerConfettiExplosion();
    });

    function triggerConfettiExplosion() {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            // Hearts & stars confetti
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff4d6d', '#ff758f', '#ffccd5', '#ffb703']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff4d6d', '#ff758f', '#ffccd5', '#ffb703']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Major burst from center
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff85a1', '#f72585', '#ffb703', '#ffffff']
        });
    }

    // --- DATE OPTIONS SELECTOR ---
    dateOptions.forEach(option => {
        option.addEventListener('click', () => {
            dateOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedDateType = option.getAttribute('data-value');
        });
    });

    // --- SEND WHATSAPP ANSWER ---
    whatsappBtn.addEventListener('click', () => {
        const dateValue = dateSelect.value;
        if (!dateValue) {
            alert("Please pick a day for our date! 🌸");
            return;
        }

        // Format date to a readable string (e.g. June 27, 2026)
        const dateObj = new Date(dateValue);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        const phoneNumber = "918791416116";
        const messageText = `Hey! I opened your cute website and my answer is YES! 💖 I'd love to go on a *${selectedDateType}* with you on *${formattedDate}*. 🥰`;
        
        const encodedText = encodeURIComponent(messageText);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
    });

    // --- CANVAS FLOATING HEARTS SYSTEM ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const maxParticles = 60;

    class HeartParticle {
        constructor() {
            this.reset();
            // Stagger initial Y coordinates so they don't all rise from bottom at once
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = `rgba(255, ${Math.floor(Math.random() * 80) + 100}, ${Math.floor(Math.random() * 100) + 120}, ${this.opacity})`;
            this.rotSpeed = Math.random() * 0.02 - 0.01;
            this.rotation = Math.random() * Math.PI;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotSpeed;
            
            // Fade out as it goes higher
            if (this.y < canvas.height * 0.3) {
                this.opacity -= 0.005;
            }

            if (this.y < -20 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            
            // Draw heart SVG shape on canvas
            ctx.beginPath();
            const d = this.size;
            ctx.moveTo(0, -d / 4);
            ctx.bezierCurveTo(-d / 2, -d * 0.75, -d, -d / 3, -d, d / 4);
            ctx.bezierCurveTo(-d, d * 0.7, -d / 3, d, 0, d * 1.1);
            ctx.bezierCurveTo(d / 3, d, d, d * 0.7, d, d / 4);
            ctx.bezierCurveTo(d, -d / 3, d / 2, -d * 0.75, 0, -d / 4);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new HeartParticle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
