// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (darkModeToggle) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Typing Animation
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const titles = [
        'Senior Java Developer',
        'Spring Boot Specialist',
        'API Architect',
        'Database Optimizer',
        'Backend Engineer'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentTitle = titles[titleIndex];
        if (isDeleting) {
            typingText.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }
        setTimeout(type, typingSpeed);
    }
    setTimeout(type, 800);
}

// Scroll Animations with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            if (entry.target.querySelector('.skills-chart')) {
                animateSkillBars();
            }

            // Animate stat counters
            if (entry.target.classList.contains('stats-bar')) {
                animateCounters();
            }
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Observe stats bar for counter animation
const statsBar = document.querySelector('.stats-bar');
if (statsBar) observer.observe(statsBar);

// Skills Chart Animation
function animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(fill => {
        const width = fill.getAttribute('data-width');
        setTimeout(() => {
            fill.style.width = width + '%';
        }, 200);
    });
}

// Counter Animation for stats
let countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.stat-number').forEach(counter => {
        const text = counter.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(match[1], '');
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            counter.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = text;
            }
        }
        counter.textContent = '0' + suffix;
        requestAnimationFrame(update);
    });
}

// Staggered animation delays
document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.skill-category').forEach((cat, i) => {
    cat.style.transitionDelay = (i * 0.04) + 's';
});

document.querySelectorAll('.publication-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
});

document.querySelectorAll('.preview-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.06) + 's';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});
