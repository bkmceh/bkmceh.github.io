// Mock data for bloggers
const bloggers = [
    {
        id: 1,
        name: "Анна Стримова",
        category: "gaming",
        avatar: "АС",
        followers: "125K",
        rating: "4.9",
        priceFrom: "от 500₽",
        services: [
            { name: "Поздравление с ДР", price: 800, available: 15, total: 50 },
            { name: "Игровая сессия", price: 1200, available: 8, total: 20 },
            { name: "Персональный совет", price: 600, available: 25, total: 30 }
        ]
    },
    {
        id: 2,
        name: "Максим Лайф",
        category: "lifestyle",
        avatar: "МЛ",
        followers: "89K",
        rating: "4.8",
        priceFrom: "от 400₽",
        services: [
            { name: "Мотивационное видео", price: 700, available: 12, total: 40 },
            { name: "Поздравление", price: 500, available: 20, total: 35 },
            { name: "Лайфхак на заказ", price: 900, available: 5, total: 15 }
        ]
    },
    {
        id: 3,
        name: "София Мьюзик",
        category: "music",
        avatar: "СМ",
        followers: "200K",
        rating: "4.9",
        priceFrom: "от 1000₽",
        services: [
            { name: "Песня на заказ", price: 2000, available: 3, total: 10 },
            { name: "Голосовое поздравление", price: 1000, available: 18, total: 25 },
            { name: "Кавер любимой песни", price: 1500, available: 7, total: 15 }
        ]
    },
    {
        id: 4,
        name: "Дмитрий Смех",
        category: "comedy",
        avatar: "ДС",
        followers: "156K",
        rating: "4.7",
        priceFrom: "от 600₽",
        services: [
            { name: "Шуточное поздравление", price: 800, available: 22, total: 40 },
            { name: "Стендап на заказ", price: 1200, available: 6, total: 12 },
            { name: "Розыгрыш друга", price: 1000, available: 10, total: 20 }
        ]
    },
    {
        id: 5,
        name: "Елена Фитнес",
        category: "lifestyle",
        avatar: "ЕФ",
        followers: "95K",
        rating: "4.8",
        priceFrom: "от 350₽",
        services: [
            { name: "Персональная тренировка", price: 1500, available: 8, total: 15 },
            { name: "Мотивация к спорту", price: 600, available: 30, total: 50 },
            { name: "План питания", price: 800, available: 12, total: 25 }
        ]
    },
    {
        id: 6,
        name: "Артем Гейм",
        category: "gaming",
        avatar: "АГ",
        followers: "180K",
        rating: "4.9",
        priceFrom: "от 700₽",
        services: [
            { name: "Обучение игре", price: 1000, available: 15, total: 30 },
            { name: "Совместная игра", price: 800, available: 25, total: 40 },
            { name: "Разбор геймплея", price: 1200, available: 8, total: 20 }
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
                <h3 style="color: #718096; margin-bottom: 1rem;">Блогеры не найдены</h3>
                <p style="color: #a0aec0;">Попробуйте изменить поисковый запрос или фильтр</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredBloggers.map(blogger => `
        <div class="blogger-card" onclick="openBloggerPage(${blogger.id})">
            <div class="blogger-avatar">${blogger.avatar}</div>
            <h3 class="blogger-name">${blogger.name}</h3>
            <p class="blogger-category">${getCategoryName(blogger.category)}</p>
            <div class="blogger-stats">
                <span><i class="fas fa-users"></i> ${blogger.followers}</span>
                <span><i class="fas fa-star"></i> ${blogger.rating}</span>
            </div>
            <div class="blogger-price">${blogger.priceFrom}</div>
        </div>
    `).join('');
}

function filterBloggers() {
    return bloggers.filter(blogger => {
        const matchesCategory = currentFilter === 'all' || blogger.category === currentFilter;
        const matchesSearch = searchQuery === '' || 
            blogger.name.toLowerCase().includes(searchQuery) ||
            getCategoryName(blogger.category).toLowerCase().includes(searchQuery);
        
        return matchesCategory && matchesSearch;
    });
}

function getCategoryName(category) {
    const categories = {
        'gaming': 'Геймеры',
        'lifestyle': 'Лайфстайл',
        'music': 'Музыка',
        'comedy': 'Юмор'
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