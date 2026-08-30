// Theme bootstrap — must run in <head>, before first paint, to avoid a flash
// of the light theme for visitors who prefer dark.
(function () {
    const STORAGE_KEY = 'darkMode';
    const DARK_CLASS = 'dark-mode';

    function prefersDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function isDarkEnabled() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'enabled') return true;
        if (stored === 'disabled') return false;
        return prefersDark();
    }

    document.documentElement.classList.toggle(DARK_CLASS, isDarkEnabled());

    window.Theme = {
        STORAGE_KEY,
        DARK_CLASS,
        isDark: () => document.documentElement.classList.contains(DARK_CLASS),
        toggle() {
            const enabled = document.documentElement.classList.toggle(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, enabled ? 'enabled' : 'disabled');
            return enabled;
        }
    };
})();
