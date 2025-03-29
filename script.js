document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const subscribeModal = document.getElementById('subscribe-modal');
    const playerModal = document.getElementById('player-modal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const contentCards = document.querySelectorAll('.content-card');
    const playerTitle = document.getElementById('player-title');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const notifyBtn = document.getElementById('notify-btn');

    // --- Theme Switching (Feature 7) ---
    function toggleTheme() {
        if (body.classList.contains('theme-light')) {
            body.classList.replace('theme-light', 'theme-dark');
            localStorage.setItem('theme', 'dark'); // Save preference
            console.log("Theme changed to Dark");
        } else {
            body.classList.replace('theme-dark', 'theme-light');
            localStorage.setItem('theme', 'light'); // Save preference
            console.log("Theme changed to Light");
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.replace('theme-light', 'theme-dark');
    }

    themeToggleBtn.addEventListener('click', toggleTheme);

    // --- Modal Handling ---
    function openModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            console.log(`Modal opened: ${modal.id}`);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            console.log(`Modal closed: ${modal.id}`);
        }
    }

    // Open Modals
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    subscribeBtn.addEventListener('click', () => openModal(subscribeModal));

    // Close Modals via Close Button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Find the closest parent modal and close it
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Close Modals by clicking outside the content (on the overlay)
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // --- Placeholder Actions ---

    // Content Card Click (Feature 5 - Placeholder Player)
    contentCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3')?.textContent || 'Selected Content';
            const contentId = card.dataset.contentId || 'unknown';
            console.log(`Content card clicked: ${title} (ID: ${contentId})`);
            playerTitle.textContent = title; // Update player modal title
            openModal(playerModal);
            // In a real app: Fetch content details, check subscription, load actual video URL
            console.log("Placeholder: Would normally check auth and load video stream here.");
        });
    });

    // Authentication Form Submission (Feature 4 - Placeholder)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission
        const email = loginForm.querySelector('input[type="email"]').value;
        console.log(`Login attempt for: ${email}`);
        alert('Login functionality requires a backend. This is just a demo.');
        closeModal(loginModal);
        // In real app: Send credentials to backend, handle response
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission
        const email = signupForm.querySelector('input[type="email"]').value;
        console.log(`Signup attempt for: ${email}`);
        alert('Signup functionality requires a backend. This is just a demo.');
        closeModal(signupModal);
        // In real app: Send details to backend, handle response (e.g., email verification)
    });

    // Subscription Button Click (Feature 6 - Placeholder)
    // Find the button inside the subscription modal to simulate choosing premium
    const choosePremiumBtn = subscribeModal.querySelector('.plan.premium button');
    if(choosePremiumBtn) {
        choosePremiumBtn.addEventListener('click', () => {
             console.log("Choose Premium button clicked.");
             alert('Payment gateway integration required for actual subscriptions.');
             closeModal(subscribeModal);
             // In real app: Redirect to payment gateway or use their JS library
        });
    }

    // Push Notifications (Feature 10 - Placeholder)
    notifyBtn.addEventListener('click', () => {
        console.log("Enable Notifications button clicked.");
        alert('Push notifications require browser permission and backend setup (like Firebase Cloud Messaging).');
        // In real app: Use Notification API (Notification.requestPermission()) and send token to backend
    });

    // Multi-Language (Feature 3 - Placeholder)
    const langSelector = document.getElementById('language-selector');
    langSelector.addEventListener('change', (e) => {
        console.log(`Language changed to: ${e.target.value}`);
        alert('Full multi-language support requires internationalization (i18n) libraries and content translation management.');
        // In real app: Load different language strings/content based on selection
    });


    console.log("OTT Platform Frontend Prototype Initialized.");
});
