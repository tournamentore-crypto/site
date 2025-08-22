let lastScrollTop = 0;

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('language', newLang);
    performSearch();
}

function toggleSearch() {
    const searchInput = document.getElementById('search-input') || document.getElementById('mobile-search-input');
    if (searchInput) {
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            document.getElementById('search-results').style.display = 'none';
        }
    } else {
        console.error('Search input not found');
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input') || document.getElementById('mobile-search-input');
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const resultsDiv = document.getElementById('search-results');
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
}

function handleOrderSubmit(event) {
    event.preventDefault();
    const lang = document.documentElement.getAttribute('data-lang');
    alert(lang === 'ru' ? 'Заявка успешно отправлена!' : 'Request successfully submitted!');
    event.target.reset();
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    } else {
        console.error('Sidebar not found');
    }
}

function closeSidebar(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (sidebar && hamburger && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('open');
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

    if (currentScrollTop > 80 && !isScrolled) { /* Reduced threshold */
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

    const searchInput = document.getElementById('search-input') || document.getElementById('mobile-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    } else {
        console.error('Search input not found');
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
    window.addEventListener('scroll', scrollHandler, { passive: false }); /* Changed to non-passive */
    window.addEventListener('touchmove', scrollHandler, { passive: false });
});