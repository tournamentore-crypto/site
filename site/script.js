let lastScrollTop = 0;
let scrollTimeout = null;

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem('language', newLang);
    performSearch(); // Update search results on language change
}

function toggleSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        document.getElementById('search-results').style.display = 'none';
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
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
    sidebar.classList.toggle('open');
}

function closeSidebar(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
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
    const delta = 30; // Minimum scroll change to avoid jitter
    const isScrolled = header.classList.contains('scrolled');

    if (Math.abs(currentScrollTop - lastScrollTop) <= delta) return;

    if (currentScrollTop > 100 && currentScrollTop > lastScrollTop && !isScrolled) {
        // Scrolling down past 100px
        header.classList.add('scrolled');
        console.log('Added scrolled class:', currentScrollTop);
    } else if ((currentScrollTop <= 100 || currentScrollTop < lastScrollTop) && isScrolled) {
        // Scrolling up or near top
        header.classList.remove('scrolled');
        console.log('Removed scrolled class:', currentScrollTop);
    }

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('language') || 'ru';
    document.documentElement.setAttribute('data-lang', savedLang);
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    } else {
        console.error('Search input not found');
    }
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    } else {
        console.error('Order form not found');
    }
    const hamburger = document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.close-btn');
    if (hamburger && closeBtn) {
        hamburger.addEventListener('click', toggleSidebar);
        closeBtn.addEventListener('click', toggleSidebar);
        document.addEventListener('click', closeSidebar);
    } else {
        console.error('Hamburger or close button not found');
    }

    // Attach scroll event for both mouse and touch with passive listener
    const scrollHandler = () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 50); // Debounce 50ms
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('touchmove', scrollHandler, { passive: true });
});