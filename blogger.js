// Get blogger data from localStorage or URL
let currentBlogger = null;
let selectedSupportOption = null;

document.addEventListener('DOMContentLoaded', function() {
    loadBloggerData();
    setupEventListeners();
});

function loadBloggerData() {
    const bloggerId = localStorage.getItem('selectedBloggerId');
    console.log('Загружаем данные блогера с ID:', bloggerId);
    console.log('window.bloggersData доступен:', !!window.bloggersData);
    
    if (!bloggerId || !window.bloggersData) {
        console.error('Не найден ID блогера или данные блогеров недоступны');
        // Redirect to main page if no blogger selected
        window.location.href = 'index.html';
        return;
    }
    
    currentBlogger = window.bloggersData.find(b => b.id == bloggerId);
    console.log('Найден блогер:', currentBlogger);
    
    if (!currentBlogger) {
        console.error('Блогер с ID', bloggerId, 'не найден в данных');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('supportOptions блогера:', currentBlogger.supportOptions);
    
    renderBloggerProfile();
    renderServices();
}

function renderBloggerProfile() {
    const profileContainer = document.getElementById('bloggerProfile');
    
    // Преобразуем массив категорий в строку с названиями категорий
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
                        <span>${currentBlogger.followers} подписчиков</span>
                    </div>

                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>Проверенный блогер</span>
                    </div>
                </div>
                <div class="blogger-description">
                    <p>Привет! Я ${currentBlogger.name} и я создаю контент в категории "${categoryNames}". Буду рада выполнить для вас персональный заказ! Все услуги выполняются качественно и в срок.</p>
                </div>
            </div>
        </div>
    `;
}

function renderServices() {
    console.log('Начинаем рендеринг услуг блогера');
    const servicesContainer = document.getElementById('servicesGrid');
    console.log('Элемент servicesGrid найден:', !!servicesContainer);
    
    servicesContainer.innerHTML = currentBlogger.supportOptions.map((supportOption, index) => {
        console.log(`Обработка варианта поддержки ${index}:`, supportOption);
        const availability = supportOption.available / supportOption.total;
        const isLowStock = availability < 0.3;
        const isOutOfStock = supportOption.available === 0;
        
        return `
            <div class="service-card ${isOutOfStock ? 'out-of-stock' : ''}">
                <div class="service-header">
                    <h3 class="service-name">${supportOption.name}</h3>
            <div class="service-price">${supportOption.donationAmount}₽</div>
                </div>
                <div class="service-availability">
                    <div class="availability-bar">
                        <div class="availability-fill" style="width: ${availability * 100}%"></div>
                    </div>
                    <div class="availability-text ${isLowStock ? 'low-stock' : ''}">
                        ${supportOption.available} из ${supportOption.total} доступно
                        ${isLowStock && !isOutOfStock ? '<span class="low-stock-badge">Мало осталось!</span>' : ''}
                        ${isOutOfStock ? '<span class="out-of-stock-badge">Нет в наличии</span>' : ''}
                    </div>
                </div>
                <div class="service-description">
                    ${getServiceDescription(supportOption.name)}
                </div>
                <button class="btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} btn-full" 
                        onclick="${isOutOfStock ? '' : `openBookingModal(${index})`}"
                        ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Недоступно' : 'Поддержать'}
                </button>
            </div>
        `;
    }).join('');
    console.log('Рендеринг услуг завершен');
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
    
    return descriptions[serviceName] || 'Персональная поддержка от блогера.';
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
                    <span class="price-rub">${selectedSupportOption.donationAmount}₽</span>
            <span class="price-crypto">≈ ${selectedSupportOption.priceEth}</span>
                </div>
                <span class="availability">Доступно: ${selectedSupportOption.available} из ${selectedSupportOption.total}</span>
            </div>
            <div class="smart-contract-info">
                <i class="fas fa-shield-alt"></i>
                <p>Если заказ не будет выполнен в течение недели, сумма автоматически вернется на ваш кошелек благодаря смарт-контрактам</p>
            </div>
        </div>
    `;
    
    totalPrice.innerHTML = `
        <div class="total-price-info">
            <div class="price-rub">${selectedSupportOption.donationAmount}₽</div>
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