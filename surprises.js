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
            bloggerName: "Anna Streamer",
        serviceName: "Birthday Greeting",
        donationAmount: 8,
        recipientName: "Maria",
            specialRequest: "Congratulate on 25th birthday, mention love for cats",
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
            bloggerName: "Sofia Music",
        serviceName: "Voice Greeting",
        donationAmount: 10,
        recipientName: "Alex",
            specialRequest: "Congratulations on work promotion",
            deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            paymentMethod: "wallet",
            orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: "in-progress"
        },
        {
            id: Date.now() - 86400000,
            bloggerId: 4,
            bloggerName: "Dmitry Comedy",
        serviceName: "Funny Greeting",
        donationAmount: 8,
        recipientName: "Igor",
            specialRequest: "Birthday congratulations, add programmer jokes",
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
        'Birthday Greeting': 'https://example.com/birthday-video.mp4',
    'Voice Greeting': 'https://example.com/voice-message.mp3',
    'Funny Greeting': 'https://example.com/funny-video.mp4',
    'Custom Song': 'https://example.com/custom-song.mp3',
    'Motivational Video': 'https://example.com/motivation.mp4'
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
                <h3>No support yet</h3>
            <p>When you support your first blogger, it will appear here</p>
            <a href="index.html" class="btn btn-primary">Find Blogger</a>
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
                    <p class="surprise-blogger">from ${order.bloggerName}</p>
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
                    <span class="detail-label">Recipient:</span>
                    <span class="detail-value">${order.recipientName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Order Date:</span>
                    <span class="detail-value">${orderDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Completion Date:</span>
                    <span class="detail-value">${deliveryDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Support Amount:</span>
                    <span class="detail-value">${order.donationAmount}₽</span>
                </div>
                ${order.specialRequest ? `
                    <div class="detail-row">
                        <span class="detail-label">Special Requests:</span>
                        <span class="detail-value">${order.specialRequest}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="surprise-actions">
                ${order.status === 'completed' || order.status === 'delivered' ? `
                    <button class="btn btn-primary" onclick="viewSurprise(${order.id})">
                        <i class="fas fa-play"></i> View Surprise
                    </button>
                ` : ''}
                ${order.status === 'pending' ? `
                    <button class="btn btn-outline" onclick="cancelOrder(${order.id})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="contactSupport(${order.id})">
                    <i class="fas fa-headset"></i> Support
                </button>
            </div>
            
            ${renderProgressBar(order.status)}
        </div>
    `;
}

function getStatusInfo(status) {
    const statuses = {
        'pending': { text: 'Processing', icon: 'fas fa-clock' },
    'in-progress': { text: 'In Progress', icon: 'fas fa-spinner fa-spin' },
    'completed': { text: 'Ready', icon: 'fas fa-check-circle' },
    'delivered': { text: 'Delivered', icon: 'fas fa-gift' }
    };
    
    return statuses[status] || { text: 'Unknown', icon: 'fas fa-question' };
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
                <p>from ${order.bloggerName} for ${order.recipientName}</p>
            <span class="completion-date">Ready ${new Date(order.completedDate).toLocaleDateString('en-US')}</span>
            </div>
            
            <div class="surprise-media">
                ${order.serviceName.includes('Voice') || order.serviceName.includes('Song') ? `
                    <div class="audio-player">
                        <i class="fas fa-music"></i>
                        <p>Audio surprise ready for listening</p>
                        <button class="btn btn-primary" onclick="playAudio()">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                ` : `
                    <div class="video-player">
                        <i class="fas fa-video"></i>
                        <p>Video surprise ready for viewing</p>
                        <button class="btn btn-primary" onclick="playVideo()">
                            <i class="fas fa-play"></i> Play
                        </button>
                    </div>
                `}
            </div>
            
            <div class="surprise-message">
                <h5>Message from blogger:</h5>
            <p>"Thank you for your support! I hope you like the result. It was very pleasant to work on this surprise!"</p>
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
    showNotification('Audio playing...', 'info');
}

function playVideo() {
    showNotification('Video playing...', 'info');
}

function downloadSurprise() {
    if (!selectedSurprise) return;
    showNotification('Surprise downloading...', 'success');
}

function shareSurprise() {
    if (!selectedSurprise) return;
    
    if (navigator.share) {
        navigator.share({
            title: `Surprise from ${selectedSurprise.bloggerName}`,
        text: `Look what an awesome surprise I got from ${selectedSurprise.bloggerName}!`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard', 'success');
    }
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel the support?')) {
        const orderIndex = userOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            userOrders.splice(orderIndex, 1);
            localStorage.setItem('userOrders', JSON.stringify(userOrders));
            renderSurprises();
            showNotification('Support cancelled', 'info');
        }
    }
}

function contactSupport(orderId) {
    const order = userOrders.find(o => o.id === orderId);
    if (order) {
        showNotification('Redirecting to support service...', 'info');
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