let lastScrollTop = 0;

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('language', newLang);
    performSearch();
}

function toggleSearch(event) {
    event.preventDefault(); // Предотвращаем возможные конфликты
    const searchInputs = document.querySelectorAll('.search-form input'); // Поддержка desktop и mobile
    const searchButton = document.querySelector('.search-form button');
    console.log('Toggling search - Inputs:', searchInputs, 'Button:', searchButton, 'Event:', event); // Диагностика
    if (searchInputs.length > 0 && searchButton) {
        searchInputs.forEach(input => {
            input.classList.toggle('active');
            if (input.classList.contains('active')) {
                input.focus(); // Устанавливаем фокус на поле ввода
                console.log('Input focused, value:', input.value, 'Input:', input);
            } else {
                input.value = '';
                const resultsDiv = document.getElementById('search-results');
                if (resultsDiv) {
                    resultsDiv.style.display = 'none';
                }
                console.log('Input cleared');
            }
        });
    } else {
        console.error('Search input or button not found. Ensure .search-form contains at least one <input> and <button>.');
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-form input.active'); // Берем активное поле
    if (searchInput) {
        const query = searchInput.value.toLowerCase();
        const resultsDiv = document.getElementById('search-results');
        console.log('Performing search with query:', query); // Диагностика
        if (resultsDiv) {
            resultsDiv.innerHTML = '';
            if (!query) {
                resultsDiv.style.display = 'none';
                return;
            }
            const container = document.querySelector('.container');
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
            } else {
                resultsDiv.innerHTML = `<div class="result">${
                    document.documentElement.getAttribute('data-lang') === 'ru'
                        ? 'Ничего не найдено'
                        : 'No results found'
                }</div>`;
                resultsDiv.style.display = 'block';
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
            if (hamburger) hamburger.classList.add('hidden'); // Hide hamburger
        } else {
            if (hamburger) hamburger.classList.remove('hidden'); // Show hamburger
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
        hamburger.classList.remove('hidden'); // Ensure hamburger is visible
    }
}

function handleScroll() {
    const header = document.querySelector('header');
    if (!header) {
        console.error('Header element not found');
        return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = 10; /* Reduced for sensitivity */
    const isScrolled = header.classList.contains('scrolled');

    if (Math.abs(currentScrollTop - lastScrollTop) <= delta) return;

    if (currentScrollTop > 80 && !isScrolled) {
        header.classList.add('scrolled');
        console.log('Added scrolled class:', currentScrollTop);
    } else if (currentScrollTop <= 80 && isScrolled) {
        header.classList.remove('scrolled');
        console.log('Removed scrolled class:', currentScrollTop);
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ru';
    document.documentElement.setAttribute('data-lang', savedLang);

    const searchInputs = document.querySelectorAll('.search-form input');
    const searchButton = document.querySelector('.search-form button');
    if (searchInputs.length > 0 && searchButton) {
        searchButton.addEventListener('click', toggleSearch);
        searchInputs.forEach(input => {
            input.addEventListener('input', performSearch);
        });
        console.log('Search initialized - Inputs:', searchInputs, 'Button:', searchButton); // Диагностика
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

    // Initial scroll check
    handleScroll();

    // Scroll event with requestAnimationFrame
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