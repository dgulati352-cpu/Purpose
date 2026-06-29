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

    // convincing stages for the NO button game
    const convinceStages = [
        {
            question: "Will you please forgive me? 🥺👉👈",
            noText: "No, still mad! 😡",
            gif: "https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif",
            helper: ""
        },
        {
            question: "Are you really, really still mad? 🥺💔",
            noText: "Yes, still mad! 😤",
            gif: "https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif",
            helper: "Anger level: 99%"
        },
        {
            question: "What if I buy you your favorite chocolates and boba? 🍫🧋",
            noText: "Not enough! 🙅‍♀️",
            gif: "https://media.tenor.com/KzEZwo49H1sAAAAi/milk-and-mocha.gif",
            helper: "Chocolates package added."
        },
        {
            question: "What if I give you unlimited warm cuddles and forehead kisses? 🤗💖",
            noText: "Still no! 🙄",
            gif: "https://media.tenor.com/0z_2w9D0k6MAAAAi/milk-and-mocha.gif",
            helper: "Cuddles package added."
        },
        {
            question: "Please? My heart is breaking into a million tiny pieces... 💔😭",
            noText: "Fine, I'll tell you why! 😡",
            gif: "https://media.tenor.com/jM86mN5c488AAAAi/milk-and-mocha-sad.gif",
            helper: "Critical heartbreak level reached."
        }
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

        // Reset the convincing game state if she navigates away from page 5
        if (pageNumber !== totalPages && typeof convinceStages !== 'undefined') {
            dodgeCount = 0;
            yesScale = 1.0;
            crushReason = '';
            
            // Restore buttons to default state
            noBtn.classList.remove('hidden');
            noBtn.textContent = convinceStages[0].noText;
            noBtn.className = "btn btn-no";
            noBtn.style.position = 'relative';
            noBtn.style.transform = 'none';
            noBtn.style.opacity = '1';
            
            yesBtn.style.transform = 'none';
            yesBtn.style.width = '';
            yesBtn.style.maxWidth = '';
            
            questionText.textContent = convinceStages[0].question;
            document.getElementById('finalHelperText').textContent = '';
            cuteBanner.src = convinceStages[0].gif;
            
            reasonFormContainer.classList.add('hidden');
            customAlert.classList.add('hidden');
            proposalGroup.classList.remove('hidden');
        }

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

    // --- CONVINCING GAME NO BUTTON (Stage 2) ---
    function handleNoBtnInteraction() {
        // Play pop sound
        popSound.currentTime = 0;
        popSound.play().catch(e => {});

        // Add shake/jiggle animation to signify resistance
        noBtn.classList.remove('jiggle');
        void noBtn.offsetWidth; // Trigger reflow to restart CSS animation
        noBtn.classList.add('jiggle');

        // Check if we should trigger the grievance form (at final stage)
        const finalStageIndex = convinceStages.length - 1;
        if (dodgeCount >= finalStageIndex) {
            proposalGroup.classList.add('hidden');
            reasonFormContainer.classList.remove('hidden');
            return;
        }

        // Increment current stage
        dodgeCount++;

        // Get stage configuration details
        const stage = convinceStages[dodgeCount];

        // 1. Update text of NO button
        noBtn.textContent = stage.noText;

        // 2. Update question text
        questionText.textContent = stage.question;

        // 3. Update GIF source
        cuteBanner.src = stage.gif;

        // 4. Update helper text
        document.getElementById('finalHelperText').textContent = stage.helper;

        // 5. Make YES button bigger to encourage clicking it
        yesScale += 0.35;
        yesBtn.style.transform = `scale(${yesScale})`;
        if (yesScale > 2) {
            yesBtn.style.boxShadow = `0 12px 40px rgba(255, 77, 109, ${Math.min(0.35 + (yesScale * 0.05), 0.8)})`;
        }
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
        
        // Hide the No button entirely so she can only say Yes
        noBtn.classList.add('hidden');
        
        // Make the Yes button centered and full-width on card
        yesBtn.textContent = "Yes, I forgive you! 💖";
        yesBtn.style.transform = 'scale(1.15)';
        yesBtn.style.width = '100%';
        yesBtn.style.maxWidth = '300px';
        yesBtn.style.boxShadow = '0 6px 20px rgba(255, 77, 109, 0.35)';
        
        document.getElementById('finalHelperText').innerHTML = "Okay, okay! You only have one choice now! 😉💖";
        cuteBanner.src = 'https://media.tenor.com/8Q9Qd2hM06gAAAAi/milk-and-mocha-happy.gif';
    });

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleNoBtnInteraction();
    });

    // Playful jiggle on hover/touch
    noBtn.addEventListener('mouseenter', () => {
        noBtn.classList.remove('jiggle');
        void noBtn.offsetWidth;
        noBtn.classList.add('jiggle');
    });

    noBtn.addEventListener('touchstart', () => {
        noBtn.classList.remove('jiggle');
        void noBtn.offsetWidth;
        noBtn.classList.add('jiggle');
    });

    // Hover reactions on YES button
    yesBtn.addEventListener('mouseenter', () => {
        cuteBanner.src = 'https://media.tenor.com/8Q9Qd2hM06gAAAAi/milk-and-mocha-happy.gif';
    });
    yesBtn.addEventListener('mouseleave', () => {
        const currentStageIndex = Math.min(dodgeCount, convinceStages.length - 1);
        cuteBanner.src = convinceStages[currentStageIndex].gif;
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
