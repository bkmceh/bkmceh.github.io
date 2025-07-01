// Get blogger data from localStorage or URL
let currentBlogger = null;
let selectedService = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBloggerData();
    setupEventListeners();
});

function loadBloggerData() {
    const bloggerId = localStorage.getItem('selectedBloggerId');
    
    if (!bloggerId || !window.bloggersData) {
        // Redirect to main page if no blogger selected
        window.location.href = 'index.html';
        return;
    }
    
    currentBlogger = window.bloggersData.find(b => b.id == bloggerId);
    
    if (!currentBlogger) {
        window.location.href = 'index.html';
        return;
    }
    
    renderBloggerProfile();
    renderServices();
}

function renderBloggerProfile() {
    const profileContainer = document.getElementById('bloggerProfile');
    
    profileContainer.innerHTML = `
        <div class="blogger-header">
            <div class="blogger-avatar-large">${currentBlogger.avatar}</div>
            <div class="blogger-info">
                <h1 class="blogger-name-large">${currentBlogger.name}</h1>
                <p class="blogger-category-large">${getCategoryName(currentBlogger.category)}</p>
                <div class="blogger-stats-large">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${currentBlogger.followers} подписчиков</span>
                    </div>

                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>Проверенный блогер</span>
                    </div>
                </div>
                <div class="blogger-description">
                    <p>Привет! Я ${currentBlogger.name} и я создаю контент в категории "${getCategoryName(currentBlogger.category)}". Буду рада выполнить для вас персональный заказ! Все услуги выполняются качественно и в срок.</p>
                </div>
            </div>
        </div>
    `;
}

function renderServices() {
    const servicesContainer = document.getElementById('servicesGrid');
    
    servicesContainer.innerHTML = currentBlogger.services.map((service, index) => {
        const availability = service.available / service.total;
        const isLowStock = availability < 0.3;
        const isOutOfStock = service.available === 0;
        
        return `
            <div class="service-card ${isOutOfStock ? 'out-of-stock' : ''}">
                <div class="service-header">
                    <h3 class="service-name">${service.name}</h3>
                    <div class="service-price">${service.price}</div>
                </div>
                <div class="service-availability">
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availability * 100}%"></div>
                    </div>
                    <div class="availability-text ${isLowStock ? 'low-stock' : ''}">
                        ${service.available} из ${service.total} доступно
                        ${isLowStock && !isOutOfStock ? '<span class="low-stock-badge">Мало осталось!</span>' : ''}
                        ${isOutOfStock ? '<span class="out-of-stock-badge">Нет в наличии</span>' : ''}
                    </div>
                </div>
                <div class="service-description">
                    ${getServiceDescription(service.name)}
                </div>
                <button class="btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} btn-full" 
                        onclick="${isOutOfStock ? '' : `openBookingModal(${index})`}"
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Недоступно' : 'Заказать'}
                </button>
            </div>
        `;
    }).join('');
}

function getServiceDescription(serviceName) {
    const descriptions = {
        'Поздравление с ДР': 'Персональное видео-поздравление с днем рождения. Длительность 1-2 минуты.',
        'Игровая сессия': 'Совместная игра в течение 1 часа с общением и советами.',
        'Персональный совет': 'Индивидуальная консультация по игровым вопросам в видеоформате.',
        'Мотивационное видео': 'Персональное мотивационное сообщение для достижения ваших целей.',
        'Поздравление': 'Видео-поздравление с любым праздником или событием.',
        'Лайфхак на заказ': 'Персональный совет или лайфхак по вашему запросу.',
        'Песня на заказ': 'Исполнение песни специально для вас или ваших близких.',
        'Голосовое поздравление': 'Аудио-поздравление с музыкальным сопровождением.',
        'Кавер любимой песни': 'Исполнение кавер-версии вашей любимой песни.',
        'Шуточное поздравление': 'Веселое поздравление с юмором и шутками.',
        'Стендап на заказ': 'Персональный мини-стендап на интересующую вас тему.',
        'Розыгрыш друга': 'Помощь в организации безобидного розыгрыша.',
        'Персональная тренировка': 'Индивидуальная фитнес-тренировка онлайн.',
        'Мотивация к спорту': 'Мотивационное видео для начала спортивного пути.',
        'План питания': 'Персональные рекомендации по питанию и диете.',
        'Обучение игре': 'Обучающая сессия по конкретной игре с разбором ошибок.',
        'Совместная игра': 'Игра в команде с общением и развлечениями.',
        'Разбор геймплея': 'Анализ вашего геймплея с советами по улучшению.'
    };
    
    return descriptions[serviceName] || 'Персональная услуга от блогера.';
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

function openBookingModal(serviceIndex) {
    selectedService = currentBlogger.services[serviceIndex];
    
    const modal = document.getElementById('bookingModal');
    const overlay = document.getElementById('modalOverlay');
    const serviceDetails = document.getElementById('serviceDetails');
    const totalPrice = document.getElementById('totalPrice');
    
    serviceDetails.innerHTML = `
        <div class="selected-service">
            <h4>${selectedService.name}</h4>
            <p>${getServiceDescription(selectedService.name)}</p>
            <div class="service-meta">
                <span class="price">${selectedService.price}</span>
                <span class="availability">Доступно: ${selectedService.available} из ${selectedService.total}</span>
            </div>
        </div>
    `;
    
    totalPrice.textContent = selectedService.price;
    
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
    selectedService = null;
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
    if (!selectedService) return;
    
    const formData = new FormData(document.getElementById('bookingForm'));
    const bookingData = {
        bloggerId: currentBlogger.id,
        bloggerName: currentBlogger.name,
        serviceName: selectedService.name,
        price: selectedService.price,
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
        
        // Update service availability
        selectedService.available--;
        renderServices();
        
        // Show success message
        showSuccessMessage();
        
        closeModal();
    }, 2000);
}

function showPaymentProcessing() {
    const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка платежа...';
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
                <h4>Заказ успешно оформлен!</h4>
                <p>Блогер получил ваш заказ и скоро приступит к выполнению. Вы можете отслеживать статус в разделе "Сюрпризы".</p>
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