// Функция для проверки видимости элемента в окне просмотра
function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": ["#1588b9", "#31cf6d", "#0a6591"]
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#1588b9",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Мобильное меню
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Переключение навигации
        nav.classList.toggle('active');
        
        // Анимация бургер-меню
        burger.classList.toggle('toggle');
        
        // Анимация ссылок
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Закрытие мобильного меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('toggle');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Изменение стиля хедера при скролле
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация чисел в статистике
    const stats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const time = 2000;
            const step = target / time * 10;
            
            let current = 0;
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    clearInterval(counter);
                    stat.textContent = target.toString();
                } else {
                    stat.textContent = Math.floor(current).toString();
                }
            }, 10);
        });
    }

    // Запуск анимации статистики при прокрутке до секции
    const aboutSection = document.querySelector('.about');
    let animated = false;

    window.addEventListener('scroll', () => {
        if (!animated && isInViewport(aboutSection)) {
            animateStats();
            animated = true;
        }
    });

    // Функция для анимации элементов при прокрутке
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Выбираем элементы, которые должны анимироваться
    const animatedElements = document.querySelectorAll('.project-card, .testimonial, .service-card');
    
    animatedElements.forEach(element => {
        // Добавляем класс для начального состояния
        element.classList.add('fade-in');
        
        // Убедимся, что кнопки внутри карточек всегда видимы
        const buttons = element.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.display = 'inline-block';
        });
    });
    
    // Проверяем элементы при загрузке
    animateOnScroll();
    
    // Проверяем элементы при прокрутке
    window.addEventListener('scroll', animateOnScroll);

    // Обработка отправки формы
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь будет логика отправки формы
            // Для демонстрации просто покажем сообщение
            alert('Спасибо за сообщение! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }

    // Дополнительно убедимся, что все карточки проектов и их кнопки видимы
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.transform = 'translateY(0)';
            
            // Убедимся, что кнопки внутри карточек видимы
            const btn = card.querySelector('.btn');
            if (btn) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
                btn.style.display = 'inline-block';
            }
        });
    }, 500); // Небольшая задержка для уверенности

    // Добавляем эффект параллакса для фона
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPosition = `50% ${scrollPosition * 0.4}px`;
        });
    }

    // Добавляем интерактивность для карточек услуг
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Автоматическое обновление года в футере
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace(/\d{4}/, currentYear);
    }
});

// CSS для анимации бургер-меню и эффектов
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .burger.toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .burger.toggle .line2 {
            opacity: 0;
        }
        
        .burger.toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`);

// Функциональность карусели проектов
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.projects-carousel');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const projectCards = document.querySelectorAll('.projects-carousel .project-card');
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    
    // Определяем количество карточек, видимых одновременно, в зависимости от ширины экрана
    function getCardsPerView() {
        if (window.innerWidth > 1200) {
            return 3;
        } else if (window.innerWidth > 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    // Обновляем количество карточек при изменении размера окна
    window.addEventListener('resize', function() {
        cardsPerView = getCardsPerView();
        updateCarousel();
    });
    
    // Обработчик для кнопки "Предыдущий"
    prevArrow.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Обработчик для кнопки "Следующий"
    nextArrow.addEventListener('click', function() {
        if (currentIndex < projectCards.length - cardsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Обновление положения карусели
    function updateCarousel() {
        // Вычисляем ширину карточки с учетом отступа
        const cardWidth = projectCards[0].offsetWidth + 30; // 30px - это gap между карточками
        
        // Обновляем положение карусели
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Обновляем состояние кнопок
        prevArrow.disabled = currentIndex === 0;
        nextArrow.disabled = currentIndex >= projectCards.length - cardsPerView;
        
        // Визуальное отображение состояния кнопок
        prevArrow.style.opacity = prevArrow.disabled ? '0.5' : '1';
        nextArrow.style.opacity = nextArrow.disabled ? '0.5' : '1';
    }
    
    // Инициализация карусели
    updateCarousel();
});

// Интерактивность для Techfrens визуального элемента
document.addEventListener('DOMContentLoaded', function() {
    const techfrensVisual = document.querySelector('.techfrens-visual');
    if (techfrensVisual) {
        // Следование за курсором
        techfrensVisual.addEventListener('mousemove', function(e) {
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                // Вычисляем положение глаз относительно курсора
                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;
                
                // Вычисляем угол между глазом и курсором
                const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
                
                // Ограничиваем движение глаз
                const distance = 3;
                const moveX = Math.cos(angle) * distance;
                const moveY = Math.sin(angle) * distance;
                
                // Применяем трансформацию
                eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        // Возвращаем глаза в исходное положение при уходе курсора
        techfrensVisual.addEventListener('mouseleave', function() {
            const eyes = document.querySelectorAll('.eye');
            eyes.forEach(eye => {
                eye.style.transform = 'translate(0, 0)';
            });
        });
        
        // Анимация улыбки при клике
        techfrensVisual.addEventListener('click', function() {
            const smile = document.querySelector('.friend-smile');
            smile.style.borderBottomWidth = '6px';
            smile.style.height = '25px';
            
            setTimeout(() => {
                smile.style.borderBottomWidth = '4px';
                smile.style.height = '20px';
            }, 300);
        });
    }
});

// // Функция для случайного расположения ключевых слов при загрузке страницы
// document.addEventListener('DOMContentLoaded', function() {
//     // Получаем все ключевые слова
//     const keywords = document.querySelectorAll('.keyword-item');
    
//     // Функция для получения случайного числа в диапазоне
//     function getRandomPosition(min, max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//     }
    
//     // Устанавливаем случайное положение для каждого ключевого слова
//     keywords.forEach(keyword => {
//         // Получаем случайные координаты в пределах контейнера
//         const randomTop = getRandomPosition(15, 75);
//         const randomLeft = getRandomPosition(10, 80);
        
//         // Применяем случайное положение
//         keyword.style.top = randomTop + '%';
//         keyword.style.left = randomLeft + '%';
        
//         // Устанавливаем случайную задержку анимации
//         const randomDelay = getRandomPosition(0, 6);
//         keyword.style.animationDelay = randomDelay + 's';
//     });
// });