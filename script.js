// Initializing Supabase Connection
const SUPABASE_URL = "https://pdgvvwyecssxghjmrdwl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZ3Z2d3llY3NzeGdoam1yZHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODUwNTYsImV4cCI6MjA5OTk2MTA1Nn0.5uPdCEoWmAC9CEmCzHJhg64_JvO2jo0vR4MCUAsrIuw";

// Safe Supabase instance check
if (typeof supabase === 'undefined') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Database Fetch Function for Blogs
async function loadBlogs() {
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) return;

    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching blogs:", error);
        blogContainer.innerHTML = `<p style="color:red">&gt; Error loading blogs: ${error.message}</p>`;
        return;
    }

    if (!blogs || blogs.length === 0) {
        blogContainer.innerHTML = "<p>&gt; No blogs published yet. Database query returned 0 rows.</p>";
        return;
    }

    blogContainer.innerHTML = blogs.map(post => {
        const date = new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long', 
            year: 'numeric'
        });
        return `
            <article class="blog-card terminal-card">
                <span class="blog-date">&gt; ${date}</span>
                <h3>${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="${post.link_url}" target="_blank" rel="noopener" class="read-more">[Article Links &rarr;]</a>
            </article>
        `;
    }).join('');
}

// Web Audio API: 8-Bit Retro Sound Generator
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playRetroBlip() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square'; // Classic 8-bit sound wave
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
}

// Attach hover sound blips dynamically to interactive elements
function attachSoundEffects() {
    document.querySelectorAll('.terminal-card, .tab-link, .toggle-btn, a, .pixel-dino-wrapper').forEach(element => {
        element.addEventListener('mouseenter', playRetroBlip);
    });
}

// Tab Highlighting on Scroll Logic
function setupTabHighlighting() {
    const sections = document.querySelectorAll('.terminal-section');
    const navTabs = document.querySelectorAll('.tab-link');
    const terminalBody = document.getElementById('terminal-body');

    if (!terminalBody) return;

    terminalBody.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - terminalBody.offsetTop;
            if (terminalBody.scrollTop >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${current}`) {
                tab.classList.add('active');
            }
        });
    });
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Theme Toggle Handler
    if (themeToggleBtn) {
        const activeTheme = localStorage.getItem('theme');
        if (activeTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = '[THEME: NEON_PINK]';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                themeToggleBtn.textContent = '[THEME: NEON_PINK]';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggleBtn.textContent = '[THEME: NEON_GREEN]';
                localStorage.setItem('theme', 'light');
            }
            playRetroBlip();
        });
    }

    loadBlogs().then(() => attachSoundEffects());
    setupTabHighlighting();
    attachSoundEffects();
});