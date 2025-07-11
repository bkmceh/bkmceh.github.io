// Mock data for bloggers
const bloggers = [
    {
        id: 1,
        name: "Anna Streamer",
        category: ["streamer", "youtube"],
        avatar: "AS",
        followers: "125K",
        experience: "3 years",
        priceFrom: "from $8",
        supportOptions: [
            { name: "Birthday Greeting", donationAmount: 8, priceEth: "0.032 ETH", available: 15, total: 50 },
            { name: "Gaming Session", donationAmount: 12, priceEth: "0.048 ETH", available: 8, total: 20 },
            { name: "Personal Advice", donationAmount: 6, priceEth: "0.024 ETH", available: 25, total: 30 }
        ]
    },
    {
        id: 2,
        name: "Max Life",
        category: ["tiktok", "youtube"],
        avatar: "ML",
        followers: "89K",
        experience: "2 years",
        priceFrom: "from $5",
        supportOptions: [
            { name: "Motivational Video", donationAmount: 7, priceEth: "0.028 ETH", available: 12, total: 40 },
            { name: "Greeting", donationAmount: 5, priceEth: "0.02 ETH", available: 20, total: 35 },
            { name: "Custom Life Hack", donationAmount: 9, priceEth: "0.036 ETH", available: 5, total: 15 }
        ]
    },
    {
        id: 3,
        name: "Sofia Music",
        category: ["youtube", "streamer"],
        avatar: "SM",
        followers: "200K",
        experience: "5 years",
        priceFrom: "from $10",
        supportOptions: [
            { name: "Custom Song", donationAmount: 20, priceEth: "0.08 ETH", available: 3, total: 10 },
            { name: "Voice Greeting", donationAmount: 10, priceEth: "0.04 ETH", available: 18, total: 25 },
            { name: "Favorite Song Cover", donationAmount: 15, priceEth: "0.06 ETH", available: 7, total: 15 }
        ]
    },
    {
        id: 4,
        name: "Dmitry Comedy",
        category: ["tiktok", "streamer"],
        avatar: "DC",
        followers: "156K",
        experience: "4 years",
        priceFrom: "from $8",
        supportOptions: [
            { name: "Funny Greeting", donationAmount: 8, priceEth: "0.032 ETH", available: 22, total: 40 },
            { name: "Custom Stand-up", donationAmount: 12, priceEth: "0.048 ETH", available: 6, total: 12 },
            { name: "Friend Prank", donationAmount: 10, priceEth: "0.04 ETH", available: 10, total: 20 }
        ]
    },
    {
        id: 5,
        name: "Elena Fitness",
        category: ["tiktok", "youtube"],
        avatar: "EF",
        followers: "95K",
        experience: "2 years",
        priceFrom: "from $6",
        supportOptions: [
            { name: "Personal Training", donationAmount: 15, priceEth: "0.06 ETH", available: 8, total: 15 },
            { name: "Sports Motivation", donationAmount: 6, priceEth: "0.024 ETH", available: 30, total: 50 },
            { name: "Nutrition Plan", donationAmount: 8, priceEth: "0.032 ETH", available: 12, total: 25 }
        ]
    },
    {
        id: 6,
        name: "Artem Game",
        category: ["streamer", "youtube"],
        avatar: "AG",
        followers: "180K",
        experience: "4 years",
        priceFrom: "from $8",
        supportOptions: [
            { name: "Game Training", donationAmount: 10, priceEth: "0.04 ETH", available: 15, total: 30 },
            { name: "Co-op Gaming", donationAmount: 8, priceEth: "0.032 ETH", available: 25, total: 40 },
            { name: "Gameplay Analysis", donationAmount: 12, priceEth: "0.048 ETH", available: 8, total: 20 }
        ]
    },
    {
        id: 7,
        name: "Victoria Art",
        category: ["artist", "tiktok"],
        avatar: "VA",
        followers: "45K",
        experience: "4 years",
        priceFrom: "from $12",
        supportOptions: [
            { name: "Digital Portrait", donationAmount: 25, priceEth: "0.1 ETH", available: 5, total: 10 },
            { name: "Game Character", donationAmount: 18, priceEth: "0.072 ETH", available: 8, total: 15 },
            { name: "Custom Logo", donationAmount: 12, priceEth: "0.048 ETH", available: 12, total: 20 }
        ]
    },
    {
        id: 8,
        name: "Kate Cosplay",
        category: ["cosplay", "tiktok", "onlyfans"],
        avatar: "KC",
        followers: "92K",
        experience: "3 years",
        priceFrom: "from $15",
        supportOptions: [
            { name: "Personal Cosplay", donationAmount: 30, priceEth: "0.12 ETH", available: 3, total: 8 },
            { name: "Character Photoshoot", donationAmount: 20, priceEth: "0.08 ETH", available: 6, total: 12 },
            { name: "Video Greeting", donationAmount: 15, priceEth: "0.06 ETH", available: 10, total: 15 }
        ]
    }
];

let currentFilter = 'all';
let searchQuery = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderBloggers();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase();
        renderBloggers();
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.category;
            renderBloggers();
        });
    });
}

function renderBloggers() {
    const grid = document.getElementById('bloggersGrid');
    const filteredBloggers = filterBloggers();
    
    if (filteredBloggers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: #718096; margin-bottom: 1rem;">No bloggers found</h3>
                <p style="color: #a0aec0;">Try changing your search query or filter</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredBloggers.map(blogger => `
        <div class="blogger-card" onclick="openBloggerPage(${blogger.id})">
            <div class="blogger-avatar">${blogger.avatar}</div>
            <h3 class="blogger-name">${blogger.name}</h3>
            <p class="blogger-category">${blogger.category.map(cat => getCategoryName(cat)).join(', ')}</p>
            <div class="blogger-stats">
                <span><i class="fas fa-users"></i> ${blogger.followers}</span>
                <span><i class="fas fa-clock"></i> ${blogger.experience}</span>
            </div>
            <div class="blogger-price">${blogger.priceFrom}</div>
        </div>
    `).join('');
}

function filterBloggers() {
    return bloggers.filter(blogger => {
        const matchesCategory = currentFilter === 'all' || blogger.category.includes(currentFilter);
        const matchesSearch = searchQuery === '' || 
            blogger.name.toLowerCase().includes(searchQuery) ||
            blogger.category.some(cat => getCategoryName(cat).toLowerCase().includes(searchQuery));
        
        return matchesCategory && matchesSearch;
    });
}

function getCategoryName(category) {
    const categories = {
        'tiktok': 'TikTok',
    'youtube': 'YouTube',
    'streamer': 'Streamer',
    'onlyfans': 'OnlyFans',
    'artist': 'Artist',
    'cosplay': 'Cosplay'
    };
    return categories[category] || category;
}

function searchBloggers() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value.toLowerCase();
    renderBloggers();
}

function openBloggerPage(bloggerId) {
    // Store blogger ID in localStorage for the blogger page
    localStorage.setItem('selectedBloggerId', bloggerId);
    // Navigate to blogger page
    window.location.href = 'blogger.html';
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.blogger-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});

// Export bloggers data for other pages
window.bloggersData = bloggers;