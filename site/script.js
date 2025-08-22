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

function handleScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const delta = 30; // Minimum scroll change to avoid jitter
    const isScrolled = header.classList.contains('scrolled');

    if (Math.abs(currentScrollTop - lastScrollTop) <= delta) return;

    if (currentScrollTop > 100 && currentScrollTop > lastScrollTop && !isScrolled) {
        // Scrolling down past 100px
        header.classList.add('scrolled');
    } else if ((currentScrollTop <= 100 || currentScrollTop < lastScrollTop) && isScrolled) {
        // Scrolling up or near top
        header.classList.remove('scrolled');
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

    // Attach scroll event for both mouse and touch
    const scrollHandler = () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 50); // Reduced debounce delay to 50ms
    };
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('touchmove', scrollHandler);
});