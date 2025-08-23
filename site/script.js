let lastScrollTop = 0;

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('language', newLang);
    performSearch();
}

function toggleSearch(event) {
    event.preventDefault();
    const searchInputs = document.querySelectorAll('.search-form input');
    const searchButton = document.querySelector('.search-form button');
    console.log('Toggling search - Inputs:', searchInputs, 'Button:', searchButton, 'Event:', event);
    if (searchInputs.length > 0 && searchButton) {
        searchInputs.forEach(input => {
            input.classList.toggle('active');
            if (input.classList.contains('active')) {
                input.focus();
                console.log('Input focused, value:', input.value, 'Input:', input);
            } else {
                input.value = '';
                const resultsDiv = document.getElementById('search-results');
                if (resultsDiv) {
                    resultsDiv.style.display = 'none';
                    resultsDiv.classList.remove('active');
                }
                console.log('Input cleared');
            }
        });
    } else {
        console.error('Search input or button not found. Ensure .search-form contains at least one <input> and <button>.');
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-form input.active');
    if (searchInput) {
        const query = searchInput.value.toLowerCase();
        const resultsDiv = document.getElementById('search-results');
        console.log('Performing search with query:', query, 'ResultsDiv:', resultsDiv);
        if (resultsDiv) {
            resultsDiv.innerHTML = '';
            if (!query) {
                resultsDiv.style.display = 'none';
                resultsDiv.classList.remove('active');
                return;
            }
            const container = document.querySelector('.container');
            if (container) {
                const texts = container.querySelectorAll('p, li, h2, h3, td');
                let results = [];
                texts.forEach(text => {
                    const content = text.textContent.toLowerCase();
                    if (content.includes(query)) {
                        const result = document.createElement('div');
                        result.className = 'result';
                        const highlightedText = text.innerHTML.replace(
                            new RegExp(query, 'gi'),
                            match => `<span class="highlight">${match}</span>`
                        );
                        result.innerHTML = highlightedText;
                        results.push(result);
                    }
                });
                if (results.length > 0) {
                    results.forEach(result => resultsDiv.appendChild(result));
                    resultsDiv.style.display = 'block';
                    resultsDiv.classList.add('active');
                } else {
                    resultsDiv.innerHTML = `<div class="result">${
                        document.documentElement.getAttribute('data-lang') === 'ru'
                            ? 'Ничего не найдено'
                            : 'No results found'
                    }</div>`;
                    resultsDiv.style.display = 'block';
                    resultsDiv.classList.add('active');
                }
            } else {
                console.error('Container not found for search');
            }
        } else {
            console.error('Search results div not found');
        }
    } else {
        console.error('No active search input found');
    }
}

function handleOrderSubmit(event) {
    event.preventDefault();
    const lang = document.documentElement.getAttribute('data-lang');
    alert(lang === 'ru' ? 'Заявка успешно отправлена!' : 'Request successfully submitted!');
    event.target.reset();
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            if (hamburger) hamburger.classList.add('hidden');
        } else {
            if (hamburger) hamburger.classList.remove('hidden');
        }
    } else {
        console.error('Sidebar not found');
    }
}

function closeSidebar(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (sidebar && hamburger && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('open');
        hamburger.classList.remove('hidden');
    }
}

function handleScroll() {
    const header = document.querySelector('header');
    if (!header) {
        console.error('Header element not found');
        return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = 10;
    const isScrolled = header.classList.contains('scrolled');

    if (Math.abs(currentScrollTop - lastScrollTop) <= delta) return;

    if (currentScrollTop > 20 && !isScrolled) {
        header.classList.add('scrolled');
        console.log('Added scrolled class:', currentScrollTop);
    } else if (currentScrollTop <= 20 && isScrolled) {
        header.classList.remove('scrolled');
        console.log('Removed scrolled class:', currentScrollTop);
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

function handleNavigation(event) {
    const link = event.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        console.log('Navigating to:', href, 'Event target:', event.target, 'Current URL:', window.location.href, 'Base URL:', window.location.pathname);
        if (href === '#order-form') {
            event.preventDefault();
            const orderForm = document.querySelector('#order-form');
            if (orderForm) {
                orderForm.scrollIntoView({ behavior: 'smooth' }); // Плавная прокрутка к форме
                const sidebar = document.querySelector('.sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    const hamburger = document.querySelector('.hamburger');
                    if (hamburger) hamburger.classList.remove('hidden');
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    document.documentElement.setAttribute('data-lang', savedLang);

    const searchInputs = document.querySelectorAll('.search-form input');
    const searchButton = document.querySelector('.search-form button');
    if (searchInputs.length > 0 && searchButton) {
        searchButton.addEventListener('click', toggleSearch);
        searchInputs.forEach(input => {
            input.addEventListener('input', performSearch); // Trigger search on input
            input.addEventListener('change', performSearch); // Trigger on change
            input.addEventListener('touchend', performSearch); // Trigger on touch
        });
        console.log('Search initialized - Inputs:', searchInputs, 'Button:', searchButton);
    } else {
        console.error('Search input or button not found. Ensure .search-form contains at least one <input> and <button>.');
    }

    const orderForms = document.querySelectorAll('#order-form');
    orderForms.forEach(form => {
        form.addEventListener('submit', handleOrderSubmit);
    });

    const hamburger = document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.close-btn');
    if (hamburger && closeBtn) {
        hamburger.addEventListener('click', toggleSidebar);
        closeBtn.addEventListener('click', toggleSidebar);
        document.addEventListener('click', closeSidebar);
    } else {
        console.error('Hamburger or close button not found');
    }

    // Обработчик навигации
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Initial scroll check
    handleScroll();

    let ticking = false;
    const scrollHandler = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
    window.addEventListener('scroll', scrollHandler, { passive: false });
    window.addEventListener('touchmove', scrollHandler, { passive: false });
});