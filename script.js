// Mock data for bloggers with enriched information
const bloggers = [
    {
        id: 1,
        name: "Anna Streamer",
        category: ["streamer", "youtube"],
        avatar: "AS",
        followers: "125K",
        experience: "3 years",
        priceFrom: "from $8",
        socials: { instagram: "@anna_live", youtube: "AnnaGames", twitter: "@annastream" },
        supportedNetworks: ['ethereum', 'solana', 'ton'],
        description: "Professional gamer and variety streamer. I love interacting with my community and creating unique moments for my fans!",
        supportOptions: [
            { name: "Birthday Greeting", donationAmount: 8, available: 15, total: 50 },
            { name: "Gaming Session", donationAmount: 12, available: 8, total: 20 },
            { name: "Personal Advice", donationAmount: 6, available: 25, total: 30 }
        ],
        reviews: [
            { author: "GamerPro", rating: 5, text: "Anna's birthday greeting was amazing! My brother was so happy.", avatar: "G" },
            { author: "Alex99", rating: 5, text: "The gaming session was super helpful. I learned a lot of new tricks.", avatar: "A" }
        ],
        gallery: [
            { type: "image", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80", title: "Gaming Setup" },
            { type: "image", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=80", title: "Last Stream" }
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
        socials: { instagram: "@maxlife_official", tiktok: "@maxlife" },
        supportedNetworks: ['solana', 'polygon'],
        description: "Living life to the fullest! I share daily vlogs, life hacks, and motivation to help you be your best self.",
        supportOptions: [
            { name: "Motivational Video", donationAmount: 7, available: 12, total: 40 },
            { name: "Greeting", donationAmount: 5, available: 20, total: 35 },
            { name: "Custom Life Hack", donationAmount: 9, available: 5, total: 15 }
        ],
        reviews: [
            { author: "SaraW", rating: 4, text: "Great motivation, thanks Max!", avatar: "S" }
        ],
        gallery: [
            { type: "image", url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80", title: "Travel Vlog" }
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
        socials: { instagram: "@sofia_melodies", youtube: "SofiaMusicChannel", spotify: "Sofia Melodies" },
        supportedNetworks: ['ethereum', 'polygon', 'ton'],
        description: "Singer and songwriter. I turn your stories into songs. Let's create something beautiful together!",
        supportOptions: [
            { name: "Custom Song", donationAmount: 20, available: 3, total: 10 },
            { name: "Voice Greeting", donationAmount: 10, available: 18, total: 25 },
            { name: "Favorite Song Cover", donationAmount: 15, available: 7, total: 15 }
        ],
        reviews: [
            { author: "MelodyFan", rating: 5, text: "Sofia has the voice of an angel. The custom song for my wedding was perfect.", avatar: "M" }
        ],
        gallery: [
            { type: "image", url: "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?w=500&q=80", title: "Studio Session" }
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
        socials: { instagram: "@dima_jokes", tiktok: "@dima_comedy" },
        supportedNetworks: ['solana', 'ton'],
        description: "Making the world laugh, one joke at a time. Need a laugh? I've got you covered!",
        supportOptions: [
            { name: "Funny Greeting", donationAmount: 8, available: 22, total: 40 },
            { name: "Custom Stand-up", donationAmount: 12, available: 6, total: 12 },
            { name: "Friend Prank", donationAmount: 10, available: 10, total: 20 }
        ],
        reviews: [
            { author: "LaughterLover", rating: 5, text: "Dmitry is hilarious! The prank on my friend was legendary.", avatar: "L" }
        ],
        gallery: [
            { type: "image", url: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=500&q=80", title: "Live Show" }
        ]
    }
];

let currentFilter = 'all';
let searchQuery = '';

// Wallet Connection Logic
let connectedWallet = JSON.parse(localStorage.getItem('connectedWallet')) || null;
let knownWallets = JSON.parse(localStorage.getItem('knownWallets') || '[]');

function toggleWalletConnection() {
    if (connectedWallet) {
        disconnectWallet();
    } else {
        // By default connect to Ethereum if just clicking the header button
        connectWallet('ethereum');
    }
}

function connectWallet(network = 'ethereum') {
    return new Promise((resolve) => {
        // Mock wallet connection
        const prefixes = { 'ethereum': '0x', 'solana': 'SOL', 'ton': 'TON', 'polygon': '0x' };
        const prefix = prefixes[network] || '0x';
        const mockAddress = prefix + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
        
        const walletData = { address: mockAddress, network: network };
        connectedWallet = walletData;
        localStorage.setItem('connectedWallet', JSON.stringify(walletData));
        
        // Add to known wallets if not already there
        const isAlreadyKnown = knownWallets.some(w => w.address === mockAddress);
        if (!isAlreadyKnown) {
            knownWallets.push(walletData);
            localStorage.setItem('knownWallets', JSON.stringify(knownWallets));
        }
        
        updateWalletUI();
        showNotification(`${network.toUpperCase()} Wallet connected!`, 'success');
        resolve(walletData);
    });
}

function disconnectWallet() {
    connectedWallet = null;
    localStorage.removeItem('connectedWallet');
    updateWalletUI();
    showNotification('Wallet disconnected', 'info');
}

function updateWalletUI() {
    const btn = document.getElementById('connectWalletBtn');
    if (!btn) return;

    if (connectedWallet) {
        const networkIcon = connectedWallet.network === 'ethereum' ? 'fab fa-ethereum' : 'fas fa-wallet';
        btn.innerHTML = `<span style="font-size: 0.75rem; color: var(--primary); margin-right: 0.5rem;">${connectedWallet.network.toUpperCase()}</span> <i class="${networkIcon}"></i> ${connectedWallet.address}`;
        btn.classList.replace('btn-primary', 'btn-outline');
    } else {
        btn.innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet`;
        btn.classList.replace('btn-outline', 'btn-primary');
    }
    
    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('walletStatusChanged', { detail: { connected: !!connectedWallet, wallet: connectedWallet } }));
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `success-notification show`;
    notification.style.borderLeft = `4px solid var(--${type === 'success' ? 'primary' : 'text-muted'})`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <div>
            <h4 style="margin-bottom: 0.25rem;">${type === 'success' ? 'Wallet' : 'System'}</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem;">${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateWalletUI();
    renderBloggers();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase();
            renderBloggers();
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            renderBloggers();
        });
    });
}

function renderBloggers() {
    const grid = document.getElementById('bloggersGrid');
    if (!grid) return;

    const filteredBloggers = filterBloggers();
    
    if (filteredBloggers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-muted); margin-bottom: 1rem;">No bloggers found</h3>
                <p style="color: var(--text-muted);">Try changing your search query or filter</p>
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
            <div style="margin-top: 1.5rem; color: var(--primary); font-weight: 700; font-size: 1.125rem;">${blogger.priceFrom}</div>
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
    if (searchInput) {
        searchQuery = searchInput.value.toLowerCase();
        renderBloggers();
    }
}

function openBloggerPage(bloggerId) {
    localStorage.setItem('selectedBloggerId', bloggerId);
    window.location.href = 'blogger.html';
}

// Export bloggers data for other pages
window.bloggersData = bloggers;
