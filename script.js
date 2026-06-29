document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelopeScreen');
    const confessionScreen = document.getElementById('confessionScreen');
    const celebrationScreen = document.getElementById('celebrationScreen');
    const questionContainer = document.getElementById('questionContainer');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const dateOptions = document.querySelectorAll('.date-option');
    const dateSelect = document.getElementById('dateSelect');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    const cuteBanner = document.getElementById('cuteBanner');

    const questionText = document.getElementById('questionText');
    const proposalGroup = document.getElementById('proposalGroup');

    // Storybook Elements
    const pageIndicator = document.getElementById('pageIndicator');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    // Reason to say No Elements
    const reasonFormContainer = document.getElementById('reasonFormContainer');
    const reasonInput = document.getElementById('reasonInput');
    const submitReasonBtn = document.getElementById('submitReasonBtn');
    const reasonError = document.getElementById('reasonError');

    const customAlert = document.getElementById('customAlert');
    const customAlertText = document.getElementById('customAlertText');
    const closeAlertBtn = document.getElementById('closeAlertBtn');

    // --- AUDIO EFFECTS ---
    const popSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
    popSound.volume = 0.4;
    successSound.volume = 0.5;

    // --- CONFIG & STATE ---
    let isMusicPlaying = false;
    let yesScale = 1.0;
    let dodgeCount = 0;
    let selectedDateType = 'Ice Cream & Cuddles 🍦';
    let crushReason = '';

    // Storybook state
    let currentPage = 1;
    const totalPages = 5;
    let typingTimeout;

    // Set minimum date picker to today
    const today = new Date().toISOString().split('T')[0];
    dateSelect.min = today;
    dateSelect.value = today;

    // Funny runaway texts for the NO button
    const noTexts = [
        "Are you sure? 🥺",
        "Still mad? 😭",
        "Forgive me plllzzz 👉👈",
        "I'll buy you chocolate! 🍫",
        "I'll give you cuddles! 🤗",
        "Wrong button! 😜",
        "You love me, remember? ❤️",
        "Please don't be angry... 🧸",
        "Angry girls grow older faster! 😜",
        "I'm sorry my queen! 👑❤️"
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
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => { });

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

                // Start Storybook flow
                currentPage = 1;
                showPage(1);
            }, 500);
        }, 1200);
    });

    // --- STORY DIARY NAVIGATION ---
    function showPage(pageNumber) {
        clearTimeout(typingTimeout);

        // Hide all pages
        document.querySelectorAll('.story-page').forEach(page => {
            page.classList.add('hidden');
            page.classList.remove('active');
        });

        // Show selected page
        const activePage = document.querySelector(`.story-page[data-page="${pageNumber}"]`);
        activePage.classList.remove('hidden');
        activePage.classList.add('active');

        // Update page number indicator
        pageIndicator.textContent = `Page ${pageNumber} of ${totalPages}`;

        // Handle prev/next buttons visibility
        if (pageNumber === 1) {
            prevPageBtn.classList.add('hidden');
        } else {
            prevPageBtn.classList.remove('hidden');
        }

        if (pageNumber === totalPages) {
            nextPageBtn.classList.add('hidden');
        } else {
            nextPageBtn.classList.remove('hidden');
        }

        // Trigger typewriter on current page text
        const textElement = activePage.querySelector('.story-text');
        if (textElement) {
            const fullText = textElement.getAttribute('data-text') || textElement.textContent;
            textElement.setAttribute('data-text', fullText);
            textElement.textContent = '';
            
            let i = 0;
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            textElement.appendChild(cursor);

            function type() {
                if (i < fullText.length) {
                    cursor.before(fullText.charAt(i));
                    i++;
                    typingTimeout = setTimeout(type, 35); // Typing speed
                } else {
                    cursor.remove();
                }
            }
            type();
        }
    }

    prevPageBtn.addEventListener('click', () => {
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => {});

        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => {});

        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // --- RUNAWAY NO BUTTON (Stage 2) ---
    function runaway() {
        if (dodgeCount >= 3) return; // Prevent any runaway actions if form is already active

        dodgeCount++;

        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => { });

        // Swap illustration to sad bear
        cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif';

        // Check if we should ask for a reason (at 3 dodges)
        if (dodgeCount === 3) {
            proposalGroup.classList.add('hidden');
            reasonFormContainer.classList.remove('hidden');
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

    // Reason Submit Handler
    submitReasonBtn.addEventListener('click', () => {
        const reasonVal = reasonInput.value.trim();
        if (!reasonVal) {
            reasonError.classList.remove('hidden');
            return;
        }
        reasonError.classList.add('hidden');
        crushReason = reasonVal;

        // Hide form and show custom rejection alert
        reasonFormContainer.classList.add('hidden');
        customAlertText.innerHTML = `Hmm... "${crushReason}" is a completely valid reason, and I feel so bad! 🥺 But my love for you is 10000x stronger, and I promise to make it up to you! ❤️ Anger level reduced by 99%. Please forgive me now? 👉👈`;
        customAlert.classList.remove('hidden');
    });

    // Close Custom Alert & Transform No into YES
    closeAlertBtn.addEventListener('click', () => {
        customAlert.classList.add('hidden');
        proposalGroup.classList.remove('hidden');
        
        noBtn.textContent = "Yes, I forgive you! 💖";
        noBtn.className = "btn btn-yes";
        noBtn.style.position = 'static';
        noBtn.style.transform = 'none';
        noBtn.style.opacity = '1';
        noBtn.style.pointerEvents = 'auto';
        noBtn.style.boxShadow = 'none';
        
        document.getElementById('finalHelperText').innerHTML = "Okay, okay! You only have one choice now! 😉💖";
        cuteBanner.src = 'https://media.tenor.com/8Q9Qd2hM06gAAAAi/milk-and-mocha-happy.gif';
    });

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (dodgeCount >= 3) {
            yesBtn.click(); // Trigger celebration if transformed
        } else {
            runaway();
        }
    });

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
        if (dodgeCount < 3) {
            cuteBanner.src = 'https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif';
        }
    });



    // --- YES BUTTON & CELEBRATION ---
    yesBtn.addEventListener('click', () => {
        // Play success sound
        successSound.currentTime = 0;
        successSound.play().catch(e => { });

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
            alert("Please pick a day for our make-up date! 🌸");
            return;
        }

        // Format date to a readable string (e.g. June 27, 2026)
        const dateObj = new Date(dateValue);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        const phoneNumber = "918791416116";
        let messageText = `Hey! I opened your cute website and yes, I forgive you! 🥰 I'd love to go on a make-up date for *${selectedDateType}* with you on *${formattedDate}*. You're paying! 😉❤️`;
        
        if (crushReason) {
            messageText = `Hey! I opened your cute website and yes, I forgive you! 🥰 (I tried to stay mad because: "${crushReason}", but you won me over! 😂) I'd love to go on a make-up date for *${selectedDateType}* on *${formattedDate}*. You're paying! 😉❤️`;
        }

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
