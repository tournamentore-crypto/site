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
    const searchInput = document.querySelector('.search-form input.desktop-only');
    const searchButton = document.querySelector('.search-form button');
    console.log('Toggling search - Input:', searchInput, 'Button:', searchButton, 'Event:', event);
    if (searchInput && searchButton) {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
            console.log('Input focused, value:', searchInput.value, 'Input:', searchInput);
        } else {
            searchInput.value = '';
            const resultsDiv = document.getElementById('search-results');
            if (resultsDiv) {
                resultsDiv.style.display = 'none';
                resultsDiv.classList.remove('active');
            }
            console.log('Input cleared');
        }
    } else {
        console.error('Search input or button not found. Ensure .search-form contains at least one <input.desktop-only> and <button>.');
    }
}

async function performSearch() {
    const searchInput = document.querySelector('.search-form input.desktop-only');
    if (searchInput) {
        const query = searchInput.value.toLowerCase().trim();
        const resultsDiv = document.getElementById('search-results');
        console.log('Performing search - Query:', query, 'Input:', searchInput, 'ResultsDiv:', resultsDiv);
        if (resultsDiv) {
            resultsDiv.innerHTML = '';
            if (!query) {
                resultsDiv.style.display = 'none';
                resultsDiv.classList.remove('active');
                console.log('No query, hiding results');
                return;
            }

            const pages = [
                'index.html',
                'about.html',
                'products.html',
                'contacts.html',
                'suppliers.html',
                'vacancies.html'
            ];

            let allResults = [];
            for (const page of pages) {
                try {
                    const response = await fetch(page);
                    if (response.ok) {
                        const text = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(text, 'text/html');
                        const texts = doc.querySelectorAll('.container p, .container li, .container h2, .container h3, .container td');
                        texts.forEach(text => {
                            const content = text.textContent.toLowerCase();
                            if (content.includes(query)) {
                                const result = document.createElement('div');
                                result.className = 'result';
                                result.textContent = text.textContent;
                                result.dataset.page = page;
                                result.dataset.target = text.id || text.className;
                                result.addEventListener('click', () => scrollToElement(text, page));
                                allResults.push(result);
                                console.log(`Match found in ${page}:`, text.textContent);
                            }
                        });
                    } else {
                        console.error(`Failed to fetch ${page}:`, response.status);
                    }
                } catch (error) {
                    console.error(`Error fetching ${page}:`, error);
                }
            }

            if (allResults.length > 0) {
                allResults.forEach(result => resultsDiv.appendChild(result));
                resultsDiv.style.display = 'block';
                resultsDiv.classList.add('active');
                console.log('Results displayed:', allResults.length);
            } else {
                resultsDiv.innerHTML = `<div class="result">${document.documentElement.getAttribute('data-lang') === 'ru' ? 'Ничего не найдено' : 'No results found'}</div>`;
                resultsDiv.style.display = 'block';
                resultsDiv.classList.add('active');
                console.log('No matches, showing no results message');
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
                orderForm.scrollIntoView({ behavior: 'smooth' });
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

function closeSearchOnOutsideClick(event) {
    const searchInput = document.querySelector('.search-form input.desktop-only');
    const searchButton = document.querySelector('.search-form button');
    const isClickInside = searchInput.contains(event.target) || searchButton.contains(event.target);
    if (!isClickInside && searchInput.classList.contains('active')) {
        searchInput.classList.remove('active');
        searchInput.value = '';
        const resultsDiv = document.getElementById('search-results');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.classList.remove('active');
        }
    }
}

async function scrollToElement(element, page) {
    if (page && page !== window.location.pathname) {
        window.location.href = page;
        // Сокращаем задержку до 300 мс для более быстрого перехода
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const searchInput = document.querySelector('.search-form input.desktop-only');
    if (searchInput) {
        searchInput.classList.remove('active');
        searchInput.value = '';
        const resultsDiv = document.getElementById('search-results');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    document.documentElement.setAttribute('data-lang', savedLang);

    const searchInput = document.querySelector('.search-form input.desktop-only');
    const searchButton = document.querySelector('.search-form button');
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', toggleSearch);
        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('change', performSearch);
        searchInput.addEventListener('keyup', performSearch);
        console.log('Search initialized - Input:', searchInput, 'Button:', searchButton);
    } else {
        console.error('Search input or button not found. Ensure .search-form contains at least one <input.desktop-only> and <button>.');
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

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    document.addEventListener('click', closeSearchOnOutsideClick);

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