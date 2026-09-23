/* ============ TRANSICIÓN ENTRE PÁGINAS ============ */
// Crear el overlay de transición al cargar
(function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.id = 'pageTransition';
    overlay.innerHTML = `
        <svg class="page-transition-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="26" width="48" height="48" rx="8" fill="none" stroke="#ff2e2e" stroke-width="3.5"/>
            <g fill="#ff2e2e">
                <rect x="31" y="20" width="2.5" height="7"/><rect x="38" y="20" width="2.5" height="7"/>
                <rect x="45" y="20" width="2.5" height="7"/><rect x="52" y="20" width="2.5" height="7"/>
                <rect x="59" y="20" width="2.5" height="7"/><rect x="66" y="20" width="2.5" height="7"/>
                <rect x="31" y="73" width="2.5" height="7"/><rect x="38" y="73" width="2.5" height="7"/>
                <rect x="45" y="73" width="2.5" height="7"/><rect x="52" y="73" width="2.5" height="7"/>
                <rect x="59" y="73" width="2.5" height="7"/><rect x="66" y="73" width="2.5" height="7"/>
                <rect x="19" y="31" width="7" height="2.5"/><rect x="19" y="38" width="7" height="2.5"/>
                <rect x="19" y="45" width="7" height="2.5"/><rect x="19" y="52" width="7" height="2.5"/>
                <rect x="19" y="59" width="7" height="2.5"/><rect x="19" y="66" width="7" height="2.5"/>
                <rect x="74" y="31" width="7" height="2.5"/><rect x="74" y="38" width="7" height="2.5"/>
                <rect x="74" y="45" width="7" height="2.5"/><rect x="74" y="52" width="7" height="2.5"/>
                <rect x="74" y="59" width="7" height="2.5"/><rect x="74" y="66" width="7" height="2.5"/>
            </g>
            <g stroke="#ff2e2e" stroke-width="1.8" fill="none" stroke-linecap="round">
                <path d="M 33 38 L 38 38 L 38 42 L 43 42"/>
                <path d="M 43 42 L 43 48 L 50 48"/>
                <path d="M 60 38 L 60 45 L 66 45 L 66 52"/>
                <path d="M 36 60 L 42 60 L 42 55 L 48 55"/>
                <path d="M 55 58 L 62 58 L 62 52"/>
            </g>
            <text x="50" y="60" text-anchor="middle" fill="#ff2e2e" font-size="22" font-weight="900" font-family="Arial">LH</text>
        </svg>
        <div class="page-transition-text">Cargando...</div>
        <div class="page-transition-bar"></div>
    `;
    document.body.appendChild(overlay);
})();

// Interceptar clic en links internos para animar la transición
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignorar links externos, anclas (#), mailto, tel, target _blank
    if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        link.target === '_blank' ||
        link.hasAttribute('download')
    ) return;

    // Solo interceptar si es un .html o ruta relativa
    if (!href.endsWith('.html') && !href.match(/^[a-zA-Z0-9_-]+\.html$/)) return;

    e.preventDefault();

    // Activar overlay
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        overlay.classList.add('active');

        // Esperar la animación y luego navegar
        setTimeout(() => {
            window.location.href = href;
        }, 700);
    } else {
        // Fallback si no se creó el overlay
        window.location.href = href;
    }
});

/* ============ NAVBAR SCROLL ============ */
const navbar = document.getElementById('mainNav');
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) progressBar.style.width = (y / docHeight * 100) + '%';
    }
});

/* ============ CERRAR MENÚ MÓVIL ============ */
document.querySelectorAll('.navbar-nav .nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', () => {
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navCollapse).hide();
        }
    });
});

/* ============ REVEAL ANIMATIONS ============ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ CONTADOR ANIMADO ============ */
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = '1';
            const target = +entry.target.dataset.count;
            let current = 0;
            const step = target / 40;
            const interval = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(interval); }
                entry.target.textContent = Math.floor(current);
            }, 30);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
