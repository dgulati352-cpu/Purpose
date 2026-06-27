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

    // Forgiveness Stage Elements
    const questionText = document.getElementById('questionText');
    const forgiveGroup = document.getElementById('forgiveGroup');
    const proposalGroup = document.getElementById('proposalGroup');
    const forgiveBtn = document.getElementById('forgiveBtn');
    const angryBtn = document.getElementById('angryBtn');

    // --- AUDIO EFFECTS ---
    const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
    popSound.volume = 0.4;
    successSound.volume = 0.5;

    // --- CONFIG & STATE ---
    let isMusicPlaying = false;
    let yesScale = 1.0;
    let forgiveScale = 1.0;
    let dodgeCount = 0;
    let forgiveDodgeCount = 0;
    let selectedDateType = 'Late Night talks 🌙';

    // Set minimum date picker to today
    const today = new Date().toISOString().split('T')[0];
    dateSelect.min = today;
    dateSelect.value = today;

    // List of sweet messages for the typewriter effect (apology sequence)
    const messages = [
        "Hey... 🌸",
        "I know you are really mad at me right now... 🥺",
        "And I am so, so sorry for upsetting you. 👉👈",
        "I promise to do better, and I hate seeing you angry or sad.",
        "You mean the absolute world to me... 💖",
        "Can we please make up? 🧸"
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

    // Pleading runaway texts for the STILL ANGRY button
    const angryTexts = [
        "Please forgive me? 🥺",
        "I'll buy you infinite chocolates! 🍫",
        "Double ice cream promise? 🍦",
        "I will make you smile! 🌸",
        "Pretty please? 👉👈",
        "I'm sorry! 😭",
        "No more angry face! 😊",
        "Forgive me, my cutie! 🧸"
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
            // Typewriter finished, show apology question
            typewriterElement.innerHTML = "Please don't be mad at me... 🥺";
            cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif'; // Sad/crying bear
            questionText.innerHTML = "Please forgive me? 🥺👉👈";
            questionContainer.classList.remove('hidden');
        }
    }

    // --- RUNAWAY NO BUTTON (Stage 2) ---
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
        yesScale += 0.35;
        yesBtn.style.transform = `scale(${yesScale})`;
        if (yesScale > 2) {
            yesBtn.style.boxShadow = `0 12px 40px rgba(255, 77, 109, ${Math.min(0.35 + (yesScale * 0.05), 0.8)})`;
        }

        // 3. Move NO button to a random position
        const padding = 30;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;
        
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
        e.preventDefault();
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

    // --- RUNAWAY ANGRY BUTTON (Stage 1) ---
    function runawayAngry() {
        forgiveDodgeCount++;
        
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => {});

        // Swap illustration to crying bear
        cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif';

        // Check if self-destruction of ANGRY button is reached
        if (forgiveDodgeCount >= 8) {
            angryBtn.style.opacity = '0';
            angryBtn.style.pointerEvents = 'none';
            typewriterElement.innerHTML = "Please click 'I Forgive You!' now... 🥰";
            cuteBanner.src = 'https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif';
            return;
        }

        // 1. Change text of ANGRY button
        const randomText = angryTexts[Math.min(forgiveDodgeCount - 1, angryTexts.length - 1)];
        angryBtn.textContent = randomText;

        // 2. Make FORGIVE button bigger
        forgiveScale += 0.35;
        forgiveBtn.style.transform = `scale(${forgiveScale})`;
        if (forgiveScale > 2) {
            forgiveBtn.style.boxShadow = `0 12px 40px rgba(255, 77, 109, ${Math.min(0.35 + (forgiveScale * 0.05), 0.8)})`;
        }

        // 3. Move ANGRY button to a random position
        const padding = 30;
        const btnWidth = angryBtn.offsetWidth;
        const btnHeight = angryBtn.offsetHeight;
        
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;
        
        const randomX = Math.max(padding, Math.random() * maxX);
        const randomY = Math.max(padding, Math.random() * maxY);
        
        angryBtn.style.position = 'fixed';
        angryBtn.style.left = `${randomX}px`;
        angryBtn.style.top = `${randomY}px`;
        angryBtn.style.zIndex = '999';
    }

    angryBtn.addEventListener('mouseover', runawayAngry);
    angryBtn.addEventListener('mouseenter', runawayAngry);
    angryBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        runawayAngry();
    });

    // Hover reactions on FORGIVE button
    forgiveBtn.addEventListener('mouseenter', () => {
        cuteBanner.src = 'https://media.tenor.com/8Q9Qd2hM06gAAAAi/milk-and-mocha-happy.gif';
    });
    forgiveBtn.addEventListener('mouseleave', () => {
        if (forgiveDodgeCount < 8) {
            cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif';
        }
    });

    // Action when FORGIVE is clicked
    forgiveBtn.addEventListener('click', () => {
        successSound.currentTime = 0;
        successSound.play().catch(e => {});

        // Reset positions of the buttons if they were moved
        angryBtn.style.position = 'relative';
        angryBtn.style.left = 'auto';
        angryBtn.style.top = 'auto';
        
        // Mini confetti burst to celebrate forgiveness!
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
        });

        // Hide forgiveness stage
        forgiveGroup.classList.add('hidden');
        
        // Transition text
        typewriterElement.innerHTML = "Yay! You're the best! 🥰 Now, I have something very special to ask you...";
        questionText.innerHTML = "Will you make me the happiest person and be mine? 🥺👉👈";
        
        // Show proposal button group
        proposalGroup.classList.remove('hidden');
        cuteBanner.src = 'https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif'; // Blushing bear
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
            // 70% hearts, 30% sparkles
            this.type = Math.random() > 0.3 ? 'heart' : 'sparkle';
            this.size = this.type === 'heart' ? (Math.random() * 15 + 8) : (Math.random() * 8 + 4);
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.opacity = Math.random() * 0.5 + 0.3;
            
            if (this.type === 'heart') {
                this.color = `rgba(255, ${Math.floor(Math.random() * 80) + 100}, ${Math.floor(Math.random() * 100) + 120}, ${this.opacity})`;
            } else {
                // Sparkles color: pastel gold / pale yellow
                this.color = `rgba(255, 223, 100, ${this.opacity})`;
            }
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
            
            ctx.beginPath();
            if (this.type === 'heart') {
                const d = this.size;
                ctx.moveTo(0, -d / 4);
                ctx.bezierCurveTo(-d / 2, -d * 0.75, -d, -d / 3, -d, d / 4);
                ctx.bezierCurveTo(-d, d * 0.7, -d / 3, d, 0, d * 1.1);
                ctx.bezierCurveTo(d / 3, d, d, d * 0.7, d, d / 4);
                ctx.bezierCurveTo(d, -d / 3, d / 2, -d * 0.75, 0, -d / 4);
                ctx.fill();
            } else {
                // Draw 4-point sparkle star shape
                const s = this.size;
                ctx.moveTo(0, -s);
                ctx.quadraticCurveTo(0, 0, s, 0);
                ctx.quadraticCurveTo(0, 0, 0, s);
                ctx.quadraticCurveTo(0, 0, -s, 0);
                ctx.quadraticCurveTo(0, 0, 0, -s);
                ctx.fill();
            }
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
