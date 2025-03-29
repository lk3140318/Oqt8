document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const header = document.getElementById('main-header');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const movieGrid = document.getElementById('movie-grid');
    const movieCards = movieGrid ? movieGrid.querySelectorAll('.movie-card') : []; // Get cards inside grid
    const noResultsMessage = document.getElementById('no-results-message');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const copyrightYear = document.getElementById('copyright-year');
    const movieGridTitle = document.getElementById('movie-grid-title');


    // --- Theme Toggle ---
    const sunIcon = darkModeToggle.querySelector('.fa-sun');
    const moonIcon = darkModeToggle.querySelector('.fa-moon');

    const applyTheme = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        body.classList.toggle('light-mode', !isDark);
        if (sunIcon && moonIcon) {
            moonIcon.style.display = isDark ? 'none' : 'inline-block';
            sunIcon.style.display = isDark ? 'inline-block' : 'none';
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    let isDarkMode = !(savedTheme === 'light'); // Default to dark unless explicitly light
    applyTheme(isDarkMode);

    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !body.classList.contains('dark-mode');
        applyTheme(isDarkMode);
    });

    // --- Mobile Menu ---
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        // Simple icon toggle (can be enhanced)
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        // Optional: Prevent body scroll when menu is open
        body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                 const icon = mobileMenuToggle.querySelector('i');
                 icon.classList.remove('fa-times');
                 icon.classList.add('fa-bars');
                 body.style.overflow = ''; // Restore scroll
            }
        });
    });
     // Close menu if clicking outside of it (optional)
    document.addEventListener('click', (event) => {
        if (mainNav.classList.contains('active') &&
            !mainNav.contains(event.target) &&
            !mobileMenuToggle.contains(event.target)) {
             mainNav.classList.remove('active');
             const icon = mobileMenuToggle.querySelector('i');
             icon.classList.remove('fa-times');
             icon.classList.add('fa-bars');
             body.style.overflow = ''; // Restore scroll
        }
    });


    // --- Search Functionality ---
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        if (!movieCards.length) return; // Exit if no cards found

        movieCards.forEach(card => {
            const titleElement = card.querySelector('.movie-title');
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            // Optional: Search genres too
            const genres = card.dataset.genres ? card.dataset.genres.toLowerCase() : '';

            const isVisible = searchTerm === '' || title.includes(searchTerm) || genres.includes(searchTerm);

            card.classList.toggle('hidden', !isVisible);
            if (isVisible) {
                visibleCount++;
            }
        });

        // Show/hide no results message
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleCount === 0 && searchTerm !== '' ? 'block' : 'none';
        }

         // Update grid title based on search/filter
        if(movieGridTitle) {
            if(searchTerm !== '') {
                movieGridTitle.textContent = `Search Results for "${searchInput.value}"`;
            } else {
                // Reset to active filter title or default
                const activeFilter = document.querySelector('.filter-btn.active');
                movieGridTitle.textContent = activeFilter ? `${activeFilter.textContent} Movies` : 'Trending Movies';
            }
        }
    };

    // Trigger search on button click and pressing Enter in input
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent potential form submission
            performSearch();
        }
    });
    // Optional: Search as user types (can be resource-intensive)
    // searchInput.addEventListener('input', performSearch);


    // --- Genre Filter ---
    if (filterButtons.length > 0 && movieCards.length > 0) {
        filterButtons.forEach(button => {
             // Skip non-filter buttons like "Join Telegram"
            if (!button.hasAttribute('data-genre')) return;

            button.addEventListener('click', () => {
                // Update active button state only for actual filter buttons
                filterButtons.forEach(btn => {
                    if (btn.hasAttribute('data-genre')) {
                         btn.classList.remove('active');
                    }
                 });
                button.classList.add('active');

                const selectedGenre = button.dataset.genre;
                 let visibleCount = 0;

                 // Clear search input when changing filters
                 searchInput.value = '';

                 movieCards.forEach(card => {
                    const cardGenres = card.dataset.genres ? card.dataset.genres.split(' ') : [];
                    const isVisible = selectedGenre === 'all' || cardGenres.includes(selectedGenre);

                    card.classList.toggle('hidden', !isVisible);
                     if (isVisible) {
                        visibleCount++;
                    }
                });

                 // Update grid title
                if(movieGridTitle) {
                     movieGridTitle.textContent = `${button.textContent} Movies`;
                }

                 // Hide 'no results' message when filtering (unless filter genuinely has 0 items)
                 if (noResultsMessage) {
                     noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
                 }
            });
        });
    }


    // --- Pagination (Placeholder Interaction) ---
    paginationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.classList.contains('disabled') || link.classList.contains('ellipsis') || link.classList.contains('active')) {
                return;
            }
            console.log(`Pagination clicked: ${link.textContent.trim()}`);
            // TODO: Implement actual page loading logic here
            // This usually involves fetching new data or showing/hiding different sets of movie cards
            // For now, just visually update the active state as an example:
            // paginationLinks.forEach(p => p.classList.remove('active', 'aria-current'));
            // link.classList.add('active');
            // link.setAttribute('aria-current', 'page');
             // You would also update prev/next button disabled states here
        });
    });


    // --- Footer Copyright Year ---
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
