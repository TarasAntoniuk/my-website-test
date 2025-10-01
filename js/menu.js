// Структура меню з підменю
const menuStructure = [
    { text: 'Home', href: 'index.html', page: 'index' },
    {
        text: 'About',
        page: 'index',
        submenu: [
            { text: 'About Me', href: 'index.html#about' },
            { text: 'Qualifications', href: 'index.html#qualifications' },
            { text: 'Education', href: 'index.html#education' },
            { text: 'Skills', href: 'index.html#skills' }
        ]
    },
    { text: 'Experience', href: 'experience.html', page: 'experience' },
    { text: 'Certificates', href: 'certificates.html', page: 'certificates' },
    { text: 'Projects', href: 'projects.html', page: 'projects' }
];

// Функція для створення меню
function createMenu(currentPage) {
    const nav = document.querySelector('nav');

    menuStructure.forEach(item => {
        if (item.submenu) {
            // Створюємо dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown';

            const dropbtn = document.createElement('a');
            dropbtn.href = '#';
            dropbtn.textContent = item.text;
            dropbtn.className = 'dropbtn';
            if (item.page === currentPage) {
                dropbtn.classList.add('active');
            }

            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'dropdown-content';

            item.submenu.forEach(subitem => {
                const sublink = document.createElement('a');
                sublink.href = subitem.href;
                sublink.textContent = subitem.text;
                dropdownContent.appendChild(sublink);
            });

            dropdown.appendChild(dropbtn);
            dropdown.appendChild(dropdownContent);
            nav.appendChild(dropdown);
        } else {
            // Звичайне посилання
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.text;

            if (item.page === currentPage) {
                link.classList.add('active');
            }

            nav.appendChild(link);
        }
    });
}

// Функція для створення header з меню
function createHeader(pageTitle, currentPage) {
    const headerHTML = `
        <h1>${pageTitle}</h1>
        <nav></nav>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = headerHTML;
        createMenu(currentPage);
    }
}

// Функція для створення footer
function createFooter() {
    const footerHTML = `&copy; 2025 Taras Antoniuk. All rights reserved.`;
    const footer = document.querySelector('footer');
    if (footer) {
        footer.innerHTML = footerHTML;
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (header) {
        const pageTitle = header.dataset.title || 'TARAS ANTONIUK';
        const currentPage = header.dataset.page || 'index';
        createHeader(pageTitle, currentPage);
    }

    createFooter();
});