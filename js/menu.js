// ===== Single source of truth for site navigation =====
// Groups become dividers in the mobile menu. A group with a `dropdownLabel`
// collapses into one desktop dropdown; without one, its items render flat.
const navGroups = [
    {
        items: [
            { text: 'Home', href: '/', page: 'index' },
            {
                text: 'About',
                page: 'index',
                submenu: [
                    { text: 'About Me', href: '/index.html#about', showInMobile: true },
                    { text: 'Education', href: '/index.html#education' }
                ]
            },
            { text: 'Experience', href: '/experience/', page: 'experience' },
            { text: 'Skills', href: '/skills/', page: 'skills' }
        ]
    },
    {
        dropdownLabel: 'Portfolio',
        items: [
            { text: 'Projects', href: '/projects/', page: 'projects' },
            { text: 'Publications', href: '/publications/', page: 'publications' },
            { text: 'Certificates', href: '/certificates/', page: 'certificates' }
        ]
    },
    {
        items: [
            { text: 'Exchange Rates', href: '/exchange-rates/', page: 'exchange-rates' }
        ]
    },
    {
        items: [
            { text: 'Hire Me', href: '/hire/', page: 'hire', className: 'nav-hire' }
        ]
    }
];

const socialLinks = [
    { href: 'https://github.com/TarasAntoniuk/', label: 'GitHub', icon: 'fab fa-github' },
    { href: 'https://www.linkedin.com/in/taras-antoniuk-7a550816a/', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
    { href: 'https://www.hackerrank.com/profile/bronya2004', label: 'HackerRank', icon: 'fab fa-hackerrank' },
    { href: 'https://dev.to/taras_antoniuk', label: 'DEV.to', icon: 'fab fa-dev' }
];

const FOOTER_TAGLINE = 'Senior Backend Java Developer specializing in REST APIs, microservices, and high-load enterprise systems.';
const FOOTER_FIRST_COLUMN_SIZE = 4;

function containsCurrentPage(items, currentPage) {
    return items.some(item => item.page === currentPage ||
        (item.submenu || []).some(sub => sub.page === currentPage));
}

function createNavLink(item, currentPage) {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    if (item.page === currentPage) link.classList.add('active');
    if (item.className) link.classList.add(item.className);
    return link;
}

function createDropdown(label, items, currentPage) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    const dropbtn = document.createElement('a');
    dropbtn.href = '#';
    dropbtn.textContent = label;
    dropbtn.className = 'dropbtn';
    dropbtn.addEventListener('click', e => e.preventDefault());
    if (containsCurrentPage(items, currentPage)) dropbtn.classList.add('active');

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    items.forEach(item => dropdownContent.appendChild(createNavLink(item, currentPage)));

    dropdown.appendChild(dropbtn);
    dropdown.appendChild(dropdownContent);
    return dropdown;
}

// Create desktop navigation
function createMenu(currentPage) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    navGroups.forEach(group => {
        if (group.dropdownLabel) {
            nav.appendChild(createDropdown(group.dropdownLabel, group.items, currentPage));
            return;
        }
        group.items.forEach(item => {
            if (item.submenu) {
                nav.appendChild(createDropdown(item.text, item.submenu, currentPage));
            } else {
                nav.appendChild(createNavLink(item, currentPage));
            }
        });
    });
}

// Flatten the nav tree for the mobile panel: submenu entries appear only when
// explicitly marked, and each group is separated by a divider.
function flattenForMobile() {
    return navGroups.map(group => group.items.flatMap(item => {
        if (item.submenu) return item.submenu.filter(sub => sub.showInMobile);
        return [item];
    }));
}

// Every top-level destination, in nav order — used to build the footer columns.
function flatDestinations() {
    return navGroups.flatMap(group => group.items.filter(item => item.href));
}

// Create mobile navigation
function createMobileMenu(currentPage) {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.id = 'mobileOverlay';
    document.body.appendChild(overlay);

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobileNav';

    flattenForMobile().forEach((groupItems, groupIndex) => {
        if (groupIndex > 0) {
            const divider = document.createElement('div');
            divider.className = 'mobile-nav-divider';
            mobileNav.appendChild(divider);
        }
        groupItems.forEach(item => {
            const link = createNavLink(item, currentPage);
            link.addEventListener('click', closeMobileMenu);
            mobileNav.appendChild(link);
        });
    });

    document.body.appendChild(mobileNav);

    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburgerBtn';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobileNav');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    const header = document.querySelector('header');
    if (header) header.appendChild(hamburger);

    hamburger.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMobileMenu();
    });
}

function setMobileMenuOpen(isOpen) {
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');

    [hamburger, mobileNav, overlay].forEach(el => el && el.classList.toggle('active', isOpen));
    if (hamburger) hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    setMobileMenuOpen(!(mobileNav && mobileNav.classList.contains('active')));
}

function closeMobileMenu() {
    setMobileMenuOpen(false);
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

function socialLinksHtml() {
    return socialLinks.map(({ href, label, icon }) =>
        `<a href="${href}" target="_blank" rel="noopener" aria-label="${label}"><i class="${icon}"></i></a>`
    ).join('\n                        ');
}

function footerColumnHtml(heading, items) {
    const links = items.map(item => `<a href="${item.href}">${item.text}</a>`).join('\n                    ');
    return `<div class="footer-links">
                    <h4>${heading}</h4>
                    ${links}
                </div>`;
}

// Create footer
function createFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const destinations = flatDestinations();
    const primary = destinations.slice(0, FOOTER_FIRST_COLUMN_SIZE);
    const secondary = destinations.slice(FOOTER_FIRST_COLUMN_SIZE);

    footer.innerHTML = `
        <div class="footer-inner">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>Taras Antoniuk</h3>
                    <p>${FOOTER_TAGLINE}</p>
                    <div class="footer-social">
                        ${socialLinksHtml()}
                    </div>
                </div>
                ${footerColumnHtml('Navigation', primary)}
                ${footerColumnHtml('More', secondary)}
            </div>
            <div class="footer-bottom">
                &copy; ${new Date().getFullYear()} Taras Antoniuk. All rights reserved.
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
        btn.classList.toggle('visible', window.scrollY > 400);
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
