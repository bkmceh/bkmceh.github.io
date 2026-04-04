// Blogger profile logic
let currentBlogger = null;
let selectedSupportOption = null;

document.addEventListener('DOMContentLoaded', function() {
    initBloggerPage();
});

function initBloggerPage() {
    const bloggerId = localStorage.getItem('selectedBloggerId');
    
    // Ensure data is available
    if (!window.bloggersData) {
        console.error('Blogger data not found');
        window.location.href = 'index.html';
        return;
    }
    
    if (!bloggerId) {
        // If no ID, default to first blogger for demo purposes
        currentBlogger = window.bloggersData[0];
    } else {
        currentBlogger = window.bloggersData.find(b => b.id == bloggerId);
    }
    
    if (!currentBlogger) {
        window.location.href = 'index.html';
        return;
    }
    
    renderBloggerProfile();
    renderServices();
    renderGallery();
    renderReviews();
    setupEventListeners();
}

function renderBloggerProfile() {
    const container = document.getElementById('bloggerProfile');
    const categories = currentBlogger.category.map(cat => getCategoryName(cat)).join(' • ');
    
    // Social links HTML
    let socialsHtml = '';
    if (currentBlogger.socials) {
        if (currentBlogger.socials.instagram) socialsHtml += `<a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>`;
        if (currentBlogger.socials.youtube) socialsHtml += `<a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>`;
        if (currentBlogger.socials.twitter) socialsHtml += `<a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>`;
        if (currentBlogger.socials.tiktok) socialsHtml += `<a href="#" class="social-btn"><i class="fab fa-tiktok"></i></a>`;
    }

    container.innerHTML = `
        <div class="blogger-header">
            <div class="blogger-avatar-large">${currentBlogger.avatar}</div>
            <div class="blogger-info">
                <h1 class="blogger-name-large">${currentBlogger.name}</h1>
                <p class="blogger-category-large">${categories}</p>
                <div class="blogger-stats-large">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${currentBlogger.followers} followers</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-history"></i>
                        <span>${currentBlogger.experience} on platform</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>Verified Creator</span>
                    </div>
                </div>
                <p class="blogger-description">${currentBlogger.description || 'Welcome to my profile! I am excited to create something special for you.'}</p>
                <div class="social-links">
                    ${socialsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderServices() {
    const container = document.getElementById('servicesGrid');
    
    container.innerHTML = currentBlogger.supportOptions.map((option, index) => {
        const availability = (option.available / option.total) * 100;
        const isLow = option.available < 5;
        
        return `
            <div class="service-card">
                <div class="service-header">
                    <h3 class="service-name">${option.name}</h3>
                    <div class="service-price">$${option.donationAmount}</div>
                </div>
                <div class="service-availability">
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availability}%"></div>
                    </div>
                    <div class="availability-text">
                        <span>${option.available} of ${option.total} available</span>
                        ${isLow ? `<span style="color: var(--secondary); font-weight: 700;">Almost gone!</span>` : ''}
                    </div>
                </div>
                <p class="service-description">${getServiceDescription(option.name)}</p>
                <button class="btn btn-primary btn-full" onclick="openBookingModal(${index})">
                    Select Surprise
                </button>
            </div>
        `;
    }).join('');
}

function renderGallery() {
    const container = document.getElementById('galleryGrid');
    if (!currentBlogger.gallery || currentBlogger.gallery.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No recent creations to show yet.</p>';
        return;
    }

    container.innerHTML = currentBlogger.gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.url}" alt="${item.title}">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; font-size: 0.875rem;">
                ${item.title}
            </div>
        </div>
    `).join('');
}

function renderReviews() {
    const container = document.getElementById('reviewsGrid');
    if (!currentBlogger.reviews || currentBlogger.reviews.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No reviews yet. Be the first to support!</p>';
        return;
    }

    container.innerHTML = currentBlogger.reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.avatar}</div>
                <div class="review-author">${review.author}</div>
                <div class="review-rating">
                    ${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}
                </div>
            </div>
            <p class="review-text">"${review.text}"</p>
        </div>
    `).join('');
}

function getServiceDescription(name) {
    const descs = {
        'Birthday Greeting': 'A personalized video message wishing you or your friend a very happy birthday with a special shoutout.',
        'Gaming Session': 'Play your favorite game together with me for 30 minutes. We can talk about strategies or just have fun!',
        'Personal Advice': 'Ask me anything! I will record a thoughtful video response sharing my experience and tips.',
        'Custom Song': 'Tell me your story or theme, and I will compose and perform a short original song just for you.',
        'Voice Greeting': 'A high-quality audio recording for your voicemail, alarm, or as a special gift.',
        'Custom Stand-up': 'Give me a topic, and I will create a 2-minute personalized comedy routine just for you.',
        'Friend Prank': 'I will help you prank your friend! We can plan a video call or a special message that will surprise them.'
    };
    return descs[name] || 'A unique experience created specifically for you by your favorite creator.';
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

function openBookingModal(index) {
    selectedSupportOption = currentBlogger.supportOptions[index];
    const modal = document.getElementById('bookingModal');
    
    document.getElementById('serviceDetails').innerHTML = `
        <div style="padding: 1.5rem; background: var(--background); border-radius: 1rem; border-left: 4px solid var(--primary);">
            <h4 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${selectedSupportOption.name}</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem;">${getServiceDescription(selectedSupportOption.name)}</p>
        </div>
    `;
    
    updateCryptoPrice();
    
    // Set min date to today
    const dateInput = document.getElementById('deliveryDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateCryptoPrice() {
    if (!selectedSupportOption) return;
    
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;
    const usdAmount = selectedSupportOption.donationAmount;
    
    let cryptoAmount = 0;
    let symbol = '';
    
    // Mock exchange rates
    const rates = {
        'ethereum': 0.00032, // 1 USD = 0.00032 ETH
        'solana': 0.0065,    // 1 USD = 0.0065 SOL
        'polygon': 1.2,      // 1 USD = 1.2 POL
        'ton': 0.18          // 1 USD = 0.18 TON
    };
    
    const symbols = {
        'ethereum': 'ETH',
        'solana': 'SOL',
        'polygon': 'POL',
        'ton': 'TON'
    };
    
    cryptoAmount = (usdAmount * rates[method]).toFixed(method === 'ethereum' ? 5 : 2);
    symbol = symbols[method];
    
    document.getElementById('totalPriceRub').innerText = `$${usdAmount}`;
    document.getElementById('totalPriceCrypto').innerText = `≈ ${cryptoAmount} ${symbol}`;
}

function closeModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setupEventListeners() {
    const form = document.getElementById('bookingForm');
    
    // Listen for payment method changes
    const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');
    paymentInputs.forEach(input => {
        input.addEventListener('change', updateCryptoPrice);
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalHtml = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            showSuccess();
            closeModal();
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            form.reset();
        }, 2000);
    });
}

function showSuccess() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <h4 style="margin-bottom: 0.25rem;">Order Placed!</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem;">The blogger has been notified. You can track your surprise in the "Surprises" section.</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
