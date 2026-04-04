// Creator Platform Logic
let sampleOrders = [
    {
        id: 1,
        title: "Birthday Greeting for Maria",
        description: "Please record a 1-minute video for my friend Maria. She loves your gaming streams!",
        price: 8.00,
        deadline: "2026-04-10",
        status: "new",
        customer: "Alex K.",
        created: "2026-04-04T10:00:00Z"
    },
    {
        id: 2,
        title: "Gaming Session Request",
        description: "Would love to play one round of Battle Arena with you this weekend.",
        price: 12.00,
        deadline: "2026-04-08",
        status: "in-progress",
        customer: "ProGamer99",
        created: "2026-04-03T15:30:00Z"
    },
    {
        id: 3,
        title: "Custom Song for Wedding",
        description: "Need a short melody for my wedding anniversary. Something romantic and sweet.",
        price: 25.00,
        deadline: "2026-04-15",
        status: "new",
        customer: "James L.",
        created: "2026-04-05T09:00:00Z"
    },
    {
        id: 4,
        title: "Personal Shoutout",
        description: "Shoutout to my brother who just graduated from university!",
        price: 5.00,
        deadline: "2026-04-05",
        status: "completed",
        customer: "Linda M.",
        created: "2026-04-01T11:00:00Z"
    },
    {
        id: 5,
        title: "Gameplay Review",
        description: "Analyze my gameplay and give some tips on how to improve my strategy.",
        price: 15.00,
        deadline: "2026-04-12",
        status: "in-progress",
        customer: "NoobMaster",
        created: "2026-04-02T14:20:00Z"
    }
];

const sampleServices = [
    { id: 1, name: "Birthday Greeting", description: "Personal video shoutout for birthdays.", price: 8, sold: 156, total: 500 },
    { id: 2, name: "Gaming Session", description: "Play together for 30 minutes.", price: 12, sold: 42, total: 100 }
];

let currentOrderStatus = 'new';
let currentOrderSort = 'date-desc';

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    setupTabs();
    setupOrderStatusTabs();
    setupSorting();
    renderOrders();
    renderServices();
    setupForm();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = content.id === target ? 'block' : 'none';
            });
        });
    });
}

function setupOrderStatusTabs() {
    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            statusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentOrderStatus = tab.dataset.status;
            renderOrders();
        });
    });
}

function setupSorting() {
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            currentOrderSort = e.target.value;
            renderOrders();
        });
    }
}

function renderOrders() {
    const grid = document.getElementById('ordersGrid');
    if (!grid) return;

    // Filter by status
    let filteredOrders = sampleOrders.filter(order => order.status === currentOrderStatus);

    // Sort
    filteredOrders.sort((a, b) => {
        const [field, direction] = currentOrderSort.split('-');
        if (field === 'date') {
            const dateA = new Date(a.created);
            const dateB = new Date(b.created);
            return direction === 'desc' ? dateB - dateA : dateA - dateB;
        } else if (field === 'price') {
            return direction === 'desc' ? b.price - a.price : a.price - b.price;
        }
        return 0;
    });

    if (filteredOrders.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; background: var(--surface); border-radius: 1.5rem; border: 1px dashed var(--border);">
                <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1.5rem;"></i>
                <h3 style="color: var(--text-muted); font-size: 1.125rem;">No ${currentOrderStatus} requests yet.</h3>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
                    <h3 class="order-title" style="margin-top: 0.75rem;">${order.title}</h3>
                </div>
                <div class="order-price">$${order.price}</div>
            </div>
            <div class="order-meta">
                <span><i class="fas fa-user"></i> ${order.customer}</span>
                <span><i class="fas fa-clock"></i> Due ${new Date(order.deadline).toLocaleDateString()}</span>
            </div>
            <p class="order-description">${order.description}</p>
            <div style="display: flex; gap: 1rem;">
                ${getActionButtons(order)}
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    const labels = {
        'new': 'New Request',
        'in-progress': 'Working',
        'completed': 'Completed'
    };
    return labels[status] || status;
}

function getActionButtons(order) {
    if (order.status === 'new') {
        return `
            <button class="btn btn-primary" onclick="updateOrderStatus(${order.id}, 'in-progress')">
                <i class="fas fa-check"></i> Accept Request
            </button>
            <button class="btn btn-outline" style="color: #ef4444; border-color: #ef4444;" onclick="alert('Request declined')">Decline</button>
        `;
    } else if (order.status === 'in-progress') {
        return `
            <button class="btn btn-primary" onclick="updateOrderStatus(${order.id}, 'completed')">
                <i class="fas fa-upload"></i> Deliver Surprise
            </button>
            <button class="btn btn-outline" onclick="alert('Viewing details...')">Details</button>
        `;
    } else {
        return `
            <button class="btn btn-outline" onclick="alert('Opening delivered content...')">View Content</button>
            <button class="btn btn-outline" onclick="alert('Opening support chat...')">Support</button>
        `;
    }
}

function updateOrderStatus(orderId, newStatus) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        showSuccessNotification(`Request updated to ${newStatus}`);
        renderOrders();
    }
}

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    grid.innerHTML = sampleServices.map(service => `
        <div class="order-card">
            <div class="order-header">
                <h3 class="order-title">${service.name}</h3>
                <div class="order-price">$${service.price}</div>
            </div>
            <p class="order-description">${service.description}</p>
            <div class="order-meta">
                <span><i class="fas fa-shopping-cart"></i> ${service.sold} sold</span>
                <span><i class="fas fa-check-circle"></i> Active</span>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-outline" onclick="alert('Editing...')">Edit</button>
                <button class="btn btn-outline" style="color: #ef4444; border-color: #ef4444;" onclick="alert('Pausing...')">Pause</button>
            </div>
        </div>
    `).join('');
}

function openCreateServiceModal() {
    document.getElementById('createServiceModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCreateServiceModal() {
    document.getElementById('createServiceModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setupForm() {
    const form = document.getElementById('createServiceForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessNotification('Service published successfully!');
        closeCreateServiceModal();
    });
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <h4 style="margin-bottom: 0.25rem;">Success</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem;">${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
