// Initializing Supabase
const SUPABASE_URL = "https://pdgvvwyecssxghjmrdwl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3Z2d3llY3NzeGdoam1yZHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODUwNTYsImV4cCI6MjA5OTk2MTA1Nn0.5uPdCEoWmAC9CEmCzHJhg64_JvO2jo0vR4MCUAsrIuw";

// Use the existing supabase instance if admin.html already created it, otherwise create a new one
if (typeof supabase === 'undefined') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
//Database Fetch Function
async function loadBlogs() {
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) return;

    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching blogs:", error);
        return;
    }

    blogContainer.innerHTML = blogs.map(post => {
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long', 
            year: 'numeric'
        });
        return `
            <article class="blog-card">
                <span class="blog-date">${date}</span>
                <h3>${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="${post.link_url}" target="_blank" rel="noopener" class="read-more">Article Links &rarr;</a>
            </article>
        `;
    }).join('');
}

// Dark/light theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        const activeTheme = localStorage.getItem('theme');
        if (activeTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = 'Light Mode';
        }

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
    }
    loadBlogs();
});