// Navigation structure with grouped items
const menuStructure = [
    { text: 'Home', href: '/index.html', page: 'index' },
    {
        text: 'About',
        page: 'index',
        submenu: [
            { text: 'About Me', href: '/index.html#about' },
            { text: 'Qualifications', href: '/index.html#qualifications' },
            { text: 'Education', href: '/index.html#education' }
        ]
    },
    { text: 'Experience', href: '/experience.html', page: 'experience' },
    { text: 'Skills', href: '/skills.html', page: 'skills' },
    {
        text: 'Portfolio',
        submenu: [
            { text: 'Projects', href: '/projects.html', page: 'projects' },
            { text: 'Publications', href: '/publications.html', page: 'publications' },
            { text: 'Certificates', href: '/certificates.html', page: 'certificates' }
        ]
    },
    { text: 'Exchange Rates', href: '/exchange-rates.html', page: 'exchange-rates' }
];

// Flat list for mobile menu
const mobileMenuItems = [
    { text: 'Home', href: '/index.html', page: 'index' },
    { text: 'About Me', href: '/index.html#about', page: 'index' },
    { text: 'Experience', href: '/experience.html', page: 'experience' },
    { text: 'Skills', href: '/skills.html', page: 'skills' },
    { divider: true },
    { text: 'Projects', href: '/projects.html', page: 'projects' },
    { text: 'Publications', href: '/publications.html', page: 'publications' },
    { text: 'Certificates', href: '/certificates.html', page: 'certificates' },
    { divider: true },
    { text: 'Exchange Rates', href: '/exchange-rates.html', page: 'exchange-rates' }
];

function isPortfolioActive(currentPage) {
    return ['projects', 'publications', 'certificates'].includes(currentPage);
}

// Create desktop navigation
function createMenu(currentPage) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    menuStructure.forEach(item => {
        if (item.submenu) {
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown';

            const dropbtn = document.createElement('a');
            dropbtn.href = '#';
            dropbtn.textContent = item.text;
            dropbtn.className = 'dropbtn';
            dropbtn.addEventListener('click', e => e.preventDefault());

            const isActive = item.page === currentPage ||
                item.submenu.some(sub => sub.page === currentPage);
            if (isActive) dropbtn.classList.add('active');

            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'dropdown-content';
            item.submenu.forEach(sub => {
                const link = document.createElement('a');
                link.href = sub.href;
                link.textContent = sub.text;
                dropdownContent.appendChild(link);
            });

            dropdown.appendChild(dropbtn);
            dropdown.appendChild(dropdownContent);
            nav.appendChild(dropdown);
        } else {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.text;
            if (item.page === currentPage) link.classList.add('active');
            nav.appendChild(link);
        }
    });

}

// Create mobile navigation
function createMobileMenu(currentPage) {
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.id = 'mobileOverlay';
    document.body.appendChild(overlay);

    // Mobile nav panel
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobileNav';

    mobileMenuItems.forEach(item => {
        if (item.divider) {
            const divider = document.createElement('div');
            divider.className = 'mobile-nav-divider';
            mobileNav.appendChild(divider);
        } else {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.text;
            if (item.page === currentPage) link.classList.add('active');
            link.addEventListener('click', closeMobileMenu);
            mobileNav.appendChild(link);
        }
    });

    document.body.appendChild(mobileNav);

    // Hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburgerBtn';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    const header = document.querySelector('header');
    if (header) header.appendChild(hamburger);

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');

    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');

    if (hamburger) hamburger.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Create header
function createHeader(pageTitle, currentPage) {
    const header = document.querySelector('header');
    if (!header) return;

    header.innerHTML = `
        <h1>${pageTitle}</h1>
        <nav></nav>
    `;
    createMenu(currentPage);
    createMobileMenu(currentPage);
}

// Create footer
function createFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="footer-inner">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>Taras Antoniuk</h3>
                    <p>Senior Backend Java Developer specializing in REST APIs, microservices, and high-load enterprise systems.</p>
                    <div class="footer-social">
                        <a href="https://github.com/TarasAntoniuk/" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/taras-antoniuk-7a550816a/" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="https://www.hackerrank.com/profile/bronya2004" target="_blank" aria-label="HackerRank"><i class="fab fa-hackerrank"></i></a>
                        <a href="https://dev.to/taras_antoniuk_ea6a2fe7ee" target="_blank" aria-label="DEV.to"><i class="fab fa-dev"></i></a>
                    </div>
                </div>
                <div class="footer-links">
                    <h4>Navigation</h4>
                    <a href="/index.html">Home</a>
                    <a href="/experience.html">Experience</a>
                    <a href="/skills.html">Skills</a>
                    <a href="/projects.html">Projects</a>
                </div>
                <div class="footer-links">
                    <h4>More</h4>
                    <a href="/publications.html">Publications</a>
                    <a href="/certificates.html">Certificates</a>
                    <a href="/exchange-rates.html">Exchange Rates</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2026 Taras Antoniuk. All rights reserved.
            </div>
        </div>
    `;
}

// Create scroll-to-top button
function createScrollTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.id = 'scrollTopBtn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header) {
        const pageTitle = header.dataset.title || 'TARAS ANTONIUK';
        const currentPage = header.dataset.page || 'index';
        createHeader(pageTitle, currentPage);
    }
    createFooter();
    createScrollTop();
});
