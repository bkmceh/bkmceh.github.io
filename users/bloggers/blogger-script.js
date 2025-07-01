// Blogger Platform JavaScript

// Sample data
const sampleOrders = [
    {
        id: 1,
        title: "Обзор косметики",
        description: "Нужен честный обзор новой линейки косметики от известного бренда. Важно показать текстуру, цвета и результат применения.",
        price: 2500,
        deadline: "2024-01-15",
        status: "new",
        customer: "Мария К.",
        created: "2024-01-10"
    },
    {
        id: 2,
        title: "Рецепт здорового завтрака",
        description: "Покажите как готовить полезный и вкусный завтрак за 15 минут. Нужно включить калорийность и пользу ингредиентов.",
        price: 1800,
        deadline: "2024-01-12",
        status: "in-progress",
        customer: "Анна С.",
        created: "2024-01-08"
    },
    {
        id: 3,
        title: "Тренировка дома",
        description: "Покажите эффективную тренировку для дома без специального оборудования. Длительность 30 минут.",
        price: 3200,
        deadline: "2024-01-20",
        status: "new",
        customer: "Елена В.",
        created: "2024-01-09"
    },
    {
        id: 4,
        title: "Обзор книги",
        description: "Нужен подробный обзор книги по саморазвитию с вашими личными впечатлениями и рекомендациями.",
        price: 1500,
        deadline: "2024-01-18",
        status: "pending",
        customer: "Дмитрий Л.",
        created: "2024-01-07"
    }
];

const sampleServices = [
    {
        id: 1,
        name: "Персональная консультация",
        description: "Индивидуальная консультация по стилю и красоте",
        price: 5000,
        limit: 10,
        sold: 7,
        deadline: 3
    },
    {
        id: 2,
        name: "Обзор товара",
        description: "Честный обзор любого товара с детальным разбором",
        price: 2000,
        limit: null,
        sold: 23,
        deadline: 5
    },
    {
        id: 3,
        name: "Рецепт блюда",
        description: "Приготовление и презентация любого блюда",
        price: 1500,
        limit: 20,
        sold: 15,
        deadline: 2
    }
];

const sampleHistory = [
    {
        id: 101,
        title: "Утренняя рутина",
        price: 2200,
        completed: "2024-01-05",
        rating: 5,
        customer: "Ольга М."
    },
    {
        id: 102,
        title: "Обзор приложения",
        price: 1800,
        completed: "2024-01-03",
        rating: 4,
        customer: "Игорь П."
    }
];

// DOM Elements
let currentTab = 'orders';
let currentSort = 'date';
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadOrders();
    loadServices();
    loadHistory();
    setupEventListeners();
});

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
            
            currentTab = tabName;
        });
    });
}

// Load orders
function loadOrders() {
    const ordersGrid = document.getElementById('ordersGrid');
    let filteredOrders = [...sampleOrders];
    
    // Apply filters
    if (currentFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === currentFilter);
    }
    
    // Apply sorting
    filteredOrders.sort((a, b) => {
        switch (currentSort) {
            case 'price':
                return b.price - a.price;
            case 'deadline':
                return new Date(a.deadline) - new Date(b.deadline);
            case 'date':
            default:
                return new Date(b.created) - new Date(a.created);
        }
    });
    
    ordersGrid.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h3 class="order-title">${order.title}</h3>
                    <div class="order-meta">
                        <span><i class="fas fa-user"></i> ${order.customer}</span>
                        <span><i class="fas fa-calendar"></i> До ${formatDate(order.deadline)}</span>
                        <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                </div>
                <div class="order-price">₽${order.price.toLocaleString()}</div>
            </div>
            <p class="order-description">${order.description}</p>
            <div class="order-actions">
                <button class="btn btn-primary btn-small" onclick="acceptOrder(${order.id})">Принять</button>
                <button class="btn btn-outline btn-small" onclick="viewOrderDetails(${order.id})">Подробнее</button>
                <button class="btn btn-danger btn-small" onclick="rejectOrder(${order.id})">Отказаться</button>
            </div>
        </div>
    `).join('');
}

// Load services
function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    
    servicesGrid.innerHTML = sampleServices.map(service => {
        const availability = service.limit ? (service.limit - service.sold) / service.limit * 100 : 100;
        const availabilityText = service.limit ? `${service.limit - service.sold} из ${service.limit}` : 'Неограниченно';
        
        return `
            <div class="service-card">
                <div class="service-header">
                    <div>
                        <h3 class="service-name">${service.name}</h3>
                        <p class="service-description">${service.description}</p>
                    </div>
                    <div class="service-price">₽${service.price.toLocaleString()}</div>
                </div>
                <div class="service-availability">
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availability}%"></div>
                    </div>
                    <div class="availability-text">Доступно: ${availabilityText}</div>
                </div>
                <div class="service-meta">
                    <span><i class="fas fa-clock"></i> ${service.deadline} дн.</span>
                    <span><i class="fas fa-shopping-cart"></i> Продано: ${service.sold}</span>
                </div>
                <div class="service-actions">
                    <button class="btn btn-outline btn-small" onclick="editService(${service.id})">Редактировать</button>
                    <button class="btn btn-danger btn-small" onclick="deleteService(${service.id})">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
}

// Load history
function loadHistory() {
    const historyGrid = document.getElementById('historyGrid');
    
    historyGrid.innerHTML = sampleHistory.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h3 class="order-title">${order.title}</h3>
                    <div class="order-meta">
                        <span><i class="fas fa-user"></i> ${order.customer}</span>
                        <span><i class="fas fa-calendar"></i> Выполнено ${formatDate(order.completed)}</span>
                        <span><i class="fas fa-star"></i> ${order.rating}/5</span>
                    </div>
                </div>
                <div class="order-price">₽${order.price.toLocaleString()}</div>
            </div>
            <div class="order-actions">
                <button class="btn btn-outline btn-small" onclick="viewOrderDetails(${order.id})">Подробнее</button>
                <button class="btn btn-primary btn-small" onclick="createSimilarService(${order.id})">Создать похожую услугу</button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const sortSelect = document.getElementById('sortBy');
    const filterSelect = document.getElementById('filterStatus');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadOrders();
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            loadOrders();
        });
    }
    
    // Create service form
    const createServiceForm = document.getElementById('createServiceForm');
    if (createServiceForm) {
        createServiceForm.addEventListener('submit', handleCreateService);
    }
}

// Order actions
function acceptOrder(orderId) {
    if (confirm('Принять этот заказ?')) {
        const order = sampleOrders.find(o => o.id === orderId);
        if (order) {
            order.status = 'in-progress';
            loadOrders();
            showNotification('Заказ принят!', 'success');
        }
    }
}

function rejectOrder(orderId) {
    if (confirm('Отказаться от этого заказа? Это действие нельзя отменить.')) {
        const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            sampleOrders.splice(orderIndex, 1);
            loadOrders();
            showNotification('Заказ отклонен', 'info');
        }
    }
}

function viewOrderDetails(orderId) {
    // This would open a detailed view modal
    showNotification('Открытие деталей заказа...', 'info');
}

// Service actions
function editService(serviceId) {
    showNotification('Редактирование услуги...', 'info');
}

function deleteService(serviceId) {
    if (confirm('Удалить эту услугу?')) {
        const serviceIndex = sampleServices.findIndex(s => s.id === serviceId);
        if (serviceIndex !== -1) {
            sampleServices.splice(serviceIndex, 1);
            loadServices();
            showNotification('Услуга удалена', 'info');
        }
    }
}

function createSimilarService(orderId) {
    showNotification('Создание похожей услуги...', 'info');
    openCreateServiceModal();
}

// Modal functions
function openCreateServiceModal() {
    const modal = document.getElementById('createServiceModal');
    modal.classList.add('active');
}

function closeCreateServiceModal() {
    const modal = document.getElementById('createServiceModal');
    modal.classList.remove('active');
    document.getElementById('createServiceForm').reset();
}

function handleCreateService(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceData = {
        id: sampleServices.length + 1,
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseInt(document.getElementById('servicePrice').value),
        limit: document.getElementById('serviceLimit').value ? parseInt(document.getElementById('serviceLimit').value) : null,
        deadline: parseInt(document.getElementById('serviceDeadline').value),
        sold: 0
    };
    
    sampleServices.push(serviceData);
    loadServices();
    closeCreateServiceModal();
    showNotification('Услуга создана!', 'success');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getStatusText(status) {
    const statusMap = {
        'new': 'Новый',
        'in-progress': 'В работе',
        'pending': 'Ожидает',
        'completed': 'Выполнен'
    };
    return statusMap[status] || status;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: var(--card-shadow);
        z-index: 1001;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-new {
        background: #e3f2fd;
        color: #1976d2;
    }
    
    .status-in-progress {
        background: #fff3e0;
        color: #f57c00;
    }
    
    .status-pending {
        background: #f3e5f5;
        color: #7b1fa2;
    }
    
    .status-completed {
        background: #e8f5e8;
        color: #388e3c;
    }
    
    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
    }
    
    .analytics-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        text-align: center;
    }
    
    .analytics-card h3 {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .analytics-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    
    .analytics-change {
        font-size: 0.9rem;
    }
    
    .analytics-change.positive {
        color: #388e3c;
    }
    
    .analytics-change.negative {
        color: #d32f2f;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }
`;
document.head.appendChild(style);