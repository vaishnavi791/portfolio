document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check user preference saved from an earlier switch session
    const activeTheme = localStorage.getItem('theme');
    if (activeTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.textContent = 'Light Mode';
    }

    // Toggle switch logic
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggleBtn.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });
});