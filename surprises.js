let currentFilter = 'all';
let userOrders = [];
let selectedSurprise = null;

document.addEventListener('DOMContentLoaded', function() {
    loadUserOrders();
    setupEventListeners();
    renderSurprises();
});

function loadUserOrders() {
    // Load orders from localStorage
    userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    // Add some demo orders if none exist
    if (userOrders.length === 0) {
        userOrders = generateDemoOrders();
        localStorage.setItem('userOrders', JSON.stringify(userOrders));
    }
    
    // Simulate order status updates
    updateOrderStatuses();
}

function generateDemoOrders() {
    const demoOrders = [
        {
            id: Date.now() - 86400000 * 3,
            bloggerId: 1,
            bloggerName: "Анна Стримова",
            serviceName: "Поздравление с ДР",
            price: 800,
            recipientName: "Мария",
            specialRequest: "Поздравить с 25-летием, упомянуть любовь к кошкам",
            deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            paymentMethod: "card",
            orderDate: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: "completed",
            completedDate: new Date(Date.now() - 86400000).toISOString(),
            surpriseUrl: "https://example.com/video1.mp4"
        },
        {
            id: Date.now() - 86400000 * 2,
            bloggerId: 3,
            bloggerName: "София Мьюзик",
            serviceName: "Голосовое поздравление",
            price: 1000,
            recipientName: "Алексей",
            specialRequest: "Поздравление с повышением на работе",
            deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            paymentMethod: "wallet",
            orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: "in-progress"
        },
        {
            id: Date.now() - 86400000,
            bloggerId: 4,
            bloggerName: "Дмитрий Смех",
            serviceName: "Шуточное поздравление",
            price: 800,
            recipientName: "Игорь",
            specialRequest: "Поздравить с днем рождения, добавить шутки про программистов",
            deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            paymentMethod: "card",
            orderDate: new Date(Date.now() - 86400000).toISOString(),
            status: "pending"
        }
    ];
    
    return demoOrders;
}

function updateOrderStatuses() {
    // Simulate realistic order progression
    userOrders.forEach(order => {
        const orderAge = Date.now() - new Date(order.orderDate).getTime();
        const daysSinceOrder = orderAge / (1000 * 60 * 60 * 24);
        
        if (order.status === 'pending' && daysSinceOrder > 0.5) {
            order.status = 'in-progress';
        } else if (order.status === 'in-progress' && daysSinceOrder > 2) {
            order.status = 'completed';
            order.completedDate = new Date().toISOString();
            order.surpriseUrl = generateSurpriseUrl(order.serviceName);
        } else if (order.status === 'completed' && daysSinceOrder > 3) {
            order.status = 'delivered';
        }
    });
    
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
}

function generateSurpriseUrl(serviceName) {
    // In a real app, this would be actual URLs to completed content
    const urls = {
        'Поздравление с ДР': 'https://example.com/birthday-video.mp4',
        'Голосовое поздравление': 'https://example.com/voice-message.mp3',
        'Шуточное поздравление': 'https://example.com/funny-video.mp4',
        'Песня на заказ': 'https://example.com/custom-song.mp3',
        'Мотивационное видео': 'https://example.com/motivation.mp4'
    };
    
    return urls[serviceName] || 'https://example.com/surprise.mp4';
}

function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.status;
            renderSurprises();
        });
    });
}

function renderSurprises() {
    const container = document.getElementById('surprisesContent');
    const filteredOrders = filterOrders();
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-gift"></i>
                </div>
                <h3>Пока нет заказов</h3>
                <p>Когда вы сделаете первый заказ, он появится здесь</p>
                <a href="index.html" class="btn btn-primary">Найти блогера</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="surprises-grid">
            ${filteredOrders.map(order => renderOrderCard(order)).join('')}
        </div>
    `;
}

function filterOrders() {
    if (currentFilter === 'all') {
        return userOrders;
    }
    return userOrders.filter(order => order.status === currentFilter);
}

function renderOrderCard(order) {
    const statusInfo = getStatusInfo(order.status);
    const orderDate = new Date(order.orderDate).toLocaleDateString('ru-RU');
    const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('ru-RU');
    
    return `
        <div class="surprise-card ${order.status}">
            <div class="surprise-header">
                <div class="surprise-info">
                    <h3 class="surprise-title">${order.serviceName}</h3>
                    <p class="surprise-blogger">от ${order.bloggerName}</p>
                </div>
                <div class="surprise-status">
                    <span class="status-badge ${order.status}">
                        <i class="${statusInfo.icon}"></i>
                        ${statusInfo.text}
                    </span>
                </div>
            </div>
            
            <div class="surprise-details">
                <div class="detail-row">
                    <span class="detail-label">Получатель:</span>
                    <span class="detail-value">${order.recipientName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Дата заказа:</span>
                    <span class="detail-value">${orderDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Дата выполнения:</span>
                    <span class="detail-value">${deliveryDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Стоимость:</span>
                    <span class="detail-value">${order.price}₽</span>
                </div>
                ${order.specialRequest ? `
                    <div class="detail-row">
                        <span class="detail-label">Пожелания:</span>
                        <span class="detail-value">${order.specialRequest}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="surprise-actions">
                ${order.status === 'completed' || order.status === 'delivered' ? `
                    <button class="btn btn-primary" onclick="viewSurprise(${order.id})">
                        <i class="fas fa-play"></i> Посмотреть сюрприз
                    </button>
                ` : ''}
                ${order.status === 'pending' ? `
                    <button class="btn btn-outline" onclick="cancelOrder(${order.id})">
                        <i class="fas fa-times"></i> Отменить
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="contactSupport(${order.id})">
                    <i class="fas fa-headset"></i> Поддержка
                </button>
            </div>
            
            ${renderProgressBar(order.status)}
        </div>
    `;
}

function getStatusInfo(status) {
    const statuses = {
        'pending': { text: 'В обработке', icon: 'fas fa-clock' },
        'in-progress': { text: 'Выполняется', icon: 'fas fa-spinner fa-spin' },
        'completed': { text: 'Готово', icon: 'fas fa-check-circle' },
        'delivered': { text: 'Доставлено', icon: 'fas fa-gift' }
    };
    
    return statuses[status] || { text: 'Неизвестно', icon: 'fas fa-question' };
}

function renderProgressBar(status) {
    const steps = ['pending', 'in-progress', 'completed', 'delivered'];
    const currentStep = steps.indexOf(status);
    
    return `
        <div class="progress-bar">
            ${steps.map((step, index) => `
                <div class="progress-step ${index <= currentStep ? 'active' : ''}">
                    <div class="step-circle">
                        <i class="${getStatusInfo(step).icon}"></i>
                    </div>
                    <span class="step-label">${getStatusInfo(step).text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function viewSurprise(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (!order) return;
    
    selectedSurprise = order;
    
    const modal = document.getElementById('surpriseModal');
    const overlay = document.getElementById('surpriseModalOverlay');
    const content = document.getElementById('surpriseContent');
    
    content.innerHTML = `
        <div class="surprise-preview">
            <div class="surprise-meta">
                <h4>${order.serviceName}</h4>
                <p>от ${order.bloggerName} для ${order.recipientName}</p>
                <span class="completion-date">Готово ${new Date(order.completedDate).toLocaleDateString('ru-RU')}</span>
            </div>
            
            <div class="surprise-media">
                ${order.serviceName.includes('Голосовое') || order.serviceName.includes('Песня') ? `
                    <div class="audio-player">
                        <i class="fas fa-music"></i>
                        <p>Аудио-сюрприз готов к прослушиванию</p>
                        <button class="btn btn-primary" onclick="playAudio()">
                            <i class="fas fa-play"></i> Воспроизвести
                        </button>
                    </div>
                ` : `
                    <div class="video-player">
                        <i class="fas fa-video"></i>
                        <p>Видео-сюрприз готов к просмотру</p>
                        <button class="btn btn-primary" onclick="playVideo()">
                            <i class="fas fa-play"></i> Воспроизвести
                        </button>
                    </div>
                `}
            </div>
            
            <div class="surprise-message">
                <h5>Сообщение от блогера:</h5>
                <p>"Спасибо за заказ! Надеюсь, вам понравится результат. Было очень приятно работать над этим сюрпризом!"</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSurpriseModal() {
    const modal = document.getElementById('surpriseModal');
    const overlay = document.getElementById('surpriseModalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    selectedSurprise = null;
}

function playAudio() {
    showNotification('Аудио воспроизводится...', 'info');
}

function playVideo() {
    showNotification('Видео воспроизводится...', 'info');
}

function downloadSurprise() {
    if (!selectedSurprise) return;
    showNotification('Сюрприз скачивается...', 'success');
}

function shareSurprise() {
    if (!selectedSurprise) return;
    
    if (navigator.share) {
        navigator.share({
            title: `Сюрприз от ${selectedSurprise.bloggerName}`,
            text: `Посмотрите, какой классный сюрприз я получил от ${selectedSurprise.bloggerName}!`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        showNotification('Ссылка скопирована в буфер обмена', 'success');
    }
}

function cancelOrder(orderId) {
    if (confirm('Вы уверены, что хотите отменить заказ?')) {
        const orderIndex = userOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            userOrders.splice(orderIndex, 1);
            localStorage.setItem('userOrders', JSON.stringify(userOrders));
            renderSurprises();
            showNotification('Заказ отменен', 'info');
        }
    }
}

function contactSupport(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (order) {
        showNotification('Перенаправление в службу поддержки...', 'info');
        // In a real app, this would open a support chat or form
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSurpriseModal();
    }
});