// Surprises page logic
let currentFilter = 'all';
let userOrders = [];
let selectedSurprise = null;

document.addEventListener('DOMContentLoaded', function() {
    initSurprisesPage();
});

function initSurprisesPage() {
    loadUserOrders();
    setupEventListeners();
    renderSurprises();
}

function loadUserOrders() {
    userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    if (userOrders.length === 0) {
        userOrders = generateDemoOrders();
        localStorage.setItem('userOrders', JSON.stringify(userOrders));
    }
}

function generateDemoOrders() {
    const now = new Date();
    return [
        {
            id: 1,
            bloggerName: "Anna Streamer",
            serviceName: "Birthday Greeting",
            donationAmount: 8,
            recipientName: "Maria",
            orderDate: new Date(now - 86400000 * 3).toISOString(),
            deliveryDate: new Date(now + 86400000).toISOString(),
            status: "completed",
            completedDate: new Date(now - 86400000).toISOString()
        },
        {
            id: 2,
            bloggerName: "Sofia Music",
            serviceName: "Custom Song",
            donationAmount: 20,
            recipientName: "Alex",
            orderDate: new Date(now - 86400000).toISOString(),
            deliveryDate: new Date(now + 86400000 * 5).toISOString(),
            status: "in-progress"
        }
    ];
}

function setupEventListeners() {
    window.addEventListener('walletStatusChanged', () => {
        renderSurprises();
    });

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
    
    // Check if wallet is connected
    const wallet = JSON.parse(localStorage.getItem('connectedWallet'));
    const knownWallets = JSON.parse(localStorage.getItem('knownWallets') || '[]');
    
    if (!wallet && knownWallets.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 6rem 2rem;">
                <div style="font-size: 4rem; color: var(--surface-hover); margin-bottom: 2rem;">
                    <i class="fas fa-lock"></i>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Surprises are Locked</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Connect any of your wallets to see your personalized content and order status.</p>
                <button class="btn btn-primary" onclick="window.connectWallet()">Connect Wallet</button>
            </div>
        `;
        return;
    }

    // Load all orders from known wallets
    const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const currentWalletAddress = wallet ? wallet.address : null;
    const knownAddresses = knownWallets.map(w => w.address);

    const userOrders = allOrders.filter(order => 
        knownAddresses.includes(order.walletAddress) || order.walletAddress === currentWalletAddress
    );

    const filtered = currentFilter === 'all' ? userOrders : userOrders.filter(o => o.status === currentFilter);
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 6rem 2rem;">
                <div style="font-size: 4rem; color: var(--surface-hover); margin-bottom: 2rem;">
                    <i class="fas fa-gift"></i>
                </div>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">No surprises found</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">When you support a creator, your orders will appear here.</p>
                <a href="index.html" class="btn btn-primary">Explore Creators</a>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
            ${filtered.map(order => renderOrderCard(order)).join('')}
        </div>
    `;
}

function renderOrderCard(order) {
    const date = new Date(order.orderDate).toLocaleDateString();
    const statusLabel = {
        'pending': 'Processing',
        'in-progress': 'In Progress',
        'completed': 'Ready'
    }[order.status];

    return `
        <div class="service-card" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
                <div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">${order.serviceName}</h3>
                    <p style="color: var(--primary); font-weight: 600;">from ${order.bloggerName}</p>
                </div>
                <div style="padding: 0.25rem 0.75rem; background: var(--background); border-radius: 2rem; font-size: 0.75rem; font-weight: 700; height: fit-content; border: 1px solid var(--border);">
                    ${statusLabel}
                </div>
            </div>
            
            <div style="margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                    <span style="color: var(--text-muted);">Recipient</span>
                    <span>${order.recipientName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                    <span style="color: var(--text-muted);">Ordered on</span>
                    <span>${date}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                    <span style="color: var(--text-muted);">Amount</span>
                    <span style="font-weight: 700;">$${order.donationAmount}</span>
                </div>
            </div>

            <div style="display: flex; gap: 1rem;">
                ${order.status === 'completed' ? `
                    <button class="btn btn-primary btn-full" onclick="viewSurprise(${order.id})">
                        <i class="fas fa-play"></i> View Result
                    </button>
                ` : `
                    <button class="btn btn-outline btn-full" disabled>
                        <i class="fas fa-hourglass-half"></i> Creator Working...
                    </button>
                `}
            </div>
        </div>
    `;
}

function viewSurprise(id) {
    const order = userOrders.find(o => o.id === id);
    selectedSurprise = order;
    
    const content = document.getElementById('surpriseContent');
    content.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: var(--background); border-radius: 1.5rem; margin-bottom: 2rem;">
            <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">
                <i class="fas ${order.serviceName.includes('Song') ? 'fa-music' : 'fa-video'}"></i>
            </div>
            <p style="color: var(--text-muted);">Your personalized ${order.serviceName.toLowerCase()} is ready!</p>
        </div>
        <div style="padding: 1.5rem; border: 1px solid var(--border); border-radius: 1rem;">
            <h5 style="margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Message from ${order.bloggerName}</h5>
            <p style="font-style: italic;">"I really enjoyed creating this for you, ${order.recipientName}! Hope you love it as much as I loved making it."</p>
        </div>
    `;

    document.getElementById('surpriseModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSurpriseModal() {
    document.getElementById('surpriseModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function downloadSurprise() {
    alert('Starting download...');
}

function shareSurprise() {
    alert('Opening share options...');
}
