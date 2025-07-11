// Get blogger data from localStorage or URL
let currentBlogger = null;
let selectedSupportOption = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBloggerData();
    setupEventListeners();
});

function loadBloggerData() {
    const bloggerId = localStorage.getItem('selectedBloggerId');
    console.log('Loading blogger data with ID:', bloggerId);
    console.log('window.bloggersData available:', !!window.bloggersData);
    
    if (!bloggerId || !window.bloggersData) {
        console.error('Blogger ID not found or blogger data unavailable');
        // Redirect to main page if no blogger selected
        window.location.href = 'index.html';
        return;
    }
    
    currentBlogger = window.bloggersData.find(b => b.id == bloggerId);
    console.log('Found blogger:', currentBlogger);
    
    if (!currentBlogger) {
        console.error('Blogger with ID', bloggerId, 'not found in data');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Blogger supportOptions:', currentBlogger.supportOptions);
    
    renderBloggerProfile();
    renderServices();
}

function renderBloggerProfile() {
    const profileContainer = document.getElementById('bloggerProfile');
    
    // Convert category array to string with category names
    const categoryNames = Array.isArray(currentBlogger.category) 
        ? currentBlogger.category.map(cat => getCategoryName(cat)).join(', ')
        : getCategoryName(currentBlogger.category);
    
    profileContainer.innerHTML = `
        <div class="blogger-header">
            <div class="blogger-avatar-large">${currentBlogger.avatar}</div>
            <div class="blogger-info">
                <h1 class="blogger-name-large">${currentBlogger.name}</h1>
                <p class="blogger-category-large">${categoryNames}</p>
                <div class="blogger-stats-large">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${currentBlogger.followers} followers</span>
                    </div>

                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>Verified blogger</span>
                    </div>
                </div>
                <div class="blogger-description">
                    <p>Hello! I'm ${currentBlogger.name} and I create content in the "${categoryNames}" category. I'll be happy to create a personal surprise for you! All work is done with love and on time.</p>
                </div>
            </div>
        </div>
    `;
}

function renderServices() {
    console.log('Starting blogger surprises rendering');
    const servicesContainer = document.getElementById('servicesGrid');
    console.log('servicesGrid element found:', !!servicesContainer);
    
    servicesContainer.innerHTML = currentBlogger.supportOptions.map((supportOption, index) => {
        console.log(`Processing support option ${index}:`, supportOption);
        const availability = supportOption.available / supportOption.total;
        const isLowStock = availability < 0.3;
        const isOutOfStock = supportOption.available === 0;
        
        return `
            <div class="service-card ${isOutOfStock ? 'out-of-stock' : ''}">
                <div class="service-header">
                    <h3 class="service-name">${supportOption.name}</h3>
            <div class="service-price">$${supportOption.donationAmount}</div>
                </div>
                <div class="service-availability">
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availability * 100}%"></div>
                    </div>
                    <div class="availability-text ${isLowStock ? 'low-stock' : ''}">
                        ${supportOption.available} of ${supportOption.total} available
                        ${isLowStock && !isOutOfStock ? '<span class="low-stock-badge">Few left!</span>' : ''}
                        ${isOutOfStock ? '<span class="out-of-stock-badge">Out of stock</span>' : ''}
                    </div>
                </div>
                <div class="service-description">
                    ${getServiceDescription(supportOption.name)}
                </div>
                <button class="btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} btn-full" 
                        onclick="${isOutOfStock ? '' : `openBookingModal(${index})`}"
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Unavailable' : 'Support'}
                </button>
            </div>
        `;
    }).join('');
    console.log('Surprises rendering completed');
}

function getServiceDescription(serviceName) {
    const descriptions = {
        'Birthday Greeting': 'Personal video birthday greeting. Duration 1-2 minutes.',
        'Gaming Session': 'Joint game for 1 hour with communication and advice.',
        'Personal Advice': 'Individual consultation on gaming issues in video format.',
        'Motivational Video': 'Personal motivational message to achieve your goals.',
        'Greeting': 'Video greeting for any holiday or event.',
        'Custom Life Hack': 'Personal advice or life hack according to your request.',
        'Custom Song': 'Song performance specially for you or your loved ones.',
        'Voice Greeting': 'Audio greeting with musical accompaniment.',
        'Favorite Song Cover': 'Cover version of your favorite song.',
        'Funny Greeting': 'Fun greeting with humor and jokes.',
        'Custom Stand-up': 'Personal mini stand-up on a topic of interest to you.',
        'Friend Prank': 'Help organizing a harmless prank.',
        'Personal Training': 'Individual fitness training online.',
        'Sports Motivation': 'Motivational video to start your sports journey.',
        'Nutrition Plan': 'Personal nutrition and diet recommendations.',
        'Game Tutorial': 'Training session on a specific game with error analysis.',
        'Co-op Gaming': 'Team game with communication and entertainment.',
        'Gameplay Review': 'Analysis of your gameplay with improvement tips.'
    };
    
    return descriptions[serviceName] || 'Personal support from blogger.';
}

function getCategoryName(category) {
    const categories = {
        'gaming': 'Gaming',
        'lifestyle': 'Lifestyle',
        'music': 'Music',
        'comedy': 'Comedy'
    };
    return categories[category] || category;
}

function openBookingModal(serviceIndex) {
    selectedSupportOption = currentBlogger.supportOptions[serviceIndex];
    
    const modal = document.getElementById('bookingModal');
    const overlay = document.getElementById('modalOverlay');
    const serviceDetails = document.getElementById('serviceDetails');
    const totalPrice = document.getElementById('totalPrice');
    
    serviceDetails.innerHTML = `
        <div class="selected-service">
            <h4>${selectedSupportOption.name}</h4>
        <p>${getServiceDescription(selectedSupportOption.name)}</p>
            <div class="service-meta">
                <div class="price-info">
                    <span class="price-rub">$${selectedSupportOption.donationAmount}</span>
            <span class="price-crypto">≈ ${selectedSupportOption.priceEth}</span>
                </div>
                <span class="availability">Available: ${selectedSupportOption.available} of ${selectedSupportOption.total}</span>
            </div>
            <div class="smart-contract-info">
                <i class="fas fa-shield-alt"></i>
                <p>If the surprise is not created within a week, the amount will automatically return to your wallet thanks to smart contracts</p>
            </div>
        </div>
    `;
    
    totalPrice.innerHTML = `
        <div class="total-price-info">
            <div class="price-rub">$${selectedSupportOption.donationAmount}</div>
            <div class="price-crypto">≈ ${selectedSupportOption.priceEth}</div>
        </div>
    `;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deliveryDate').min = tomorrow.toISOString().split('T')[0];
    
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('bookingForm').reset();
    selectedSupportOption = null;
}

function setupEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processBooking();
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function processBooking() {
    if (!selectedSupportOption) return;
    
    const formData = new FormData(document.getElementById('bookingForm'));
    const bookingData = {
        bloggerId: currentBlogger.id,
        bloggerName: currentBlogger.name,
        serviceName: selectedSupportOption.name,
        donationAmount: selectedSupportOption.donationAmount,
        recipientName: formData.get('recipientName'),
        specialRequest: formData.get('specialRequest'),
        deliveryDate: formData.get('deliveryDate'),
        paymentMethod: formData.get('paymentMethod'),
        orderDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Simulate payment processing
    showPaymentProcessing();
    
    setTimeout(() => {
        // Save order to localStorage (in real app, this would be sent to server)
        saveOrder(bookingData);
        
        // Update support option availability
    selectedSupportOption.available--;
    renderServices();
        
        // Show success message
        showSuccessMessage();
        
        closeModal();
    }, 2000);
}

function showPaymentProcessing() {
    const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing payment...';
    submitBtn.disabled = true;
    
    // Reset button after processing
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
}

function saveOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    orderData.id = Date.now(); // Simple ID generation
    orders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(orders));
}

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Support successfully placed!</h4>
                <p>The blogger has received your support and will soon start creating a surprise. You can track the status in the "Surprises" section.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

// Add some interactive effects for service cards
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.service-card:not(.out-of-stock)');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
    });
});