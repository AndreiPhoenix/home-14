document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Валидация
    let isValid = true;
    
    // Валидация email
    const emailError = document.getElementById('emailError');
    if (!validateEmail(email)) {
        emailError.textContent = 'Введите корректный email';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    // Валидация пароля
    const passwordError = document.getElementById('passwordError');
    if (password.length < 6) {
        passwordError.textContent = 'Пароль должен содержать не менее 6 символов';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }
    
    if (!isValid) return;
    
    try {
        // Отправка данных на сервер
        const response = await fetch('https://example.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }
        
        const data = await response.json();
        
        // Сохраняем токен
        localStorage.setItem('jwtToken', data.token);
        
        // Перенаправляем на защищенную страницу
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message);
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Защита маршрутов - проверка токена при загрузке защищенной страницы
function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
    }
    
    // Здесь можно добавить проверку валидности токена (например, декодировать и проверить срок действия)
}

// Выход из системы
function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'login.html';
}

// Показать статус авторизации
function showAuthStatus() {
    const token = localStorage.getItem('jwtToken');
    const userNameElement = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    if (token) {
        // Здесь можно декодировать JWT, чтобы получить имя пользователя
        // Для примера просто покажем "Пользователь"
        userNameElement.textContent = 'Пользователь';
        logoutBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
    } else {
        userNameElement.textContent = '';
        logoutBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

// Показать статус сети
function showNetworkStatus() {
    const networkStatusElement = document.getElementById('networkStatus');
    
    function updateNetworkStatus() {
        if (navigator.onLine) {
            networkStatusElement.textContent = 'Онлайн';
            networkStatusElement.style.color = 'green';
            
            // Показать уведомление о восстановлении соединения
            const notification = document.createElement('div');
            notification.textContent = 'Соединение восстановлено';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            notification.style.padding = '10px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        } else {
            networkStatusElement.textContent = 'Офлайн';
            networkStatusElement.style.color = 'red';
            
            // Показать уведомление о потере соединения
            const notification = document.createElement('div');
            notification.textContent = 'Вы в офлайне';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
            notification.style.padding = '10px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '1000';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
    
    // Инициализация статуса
    updateNetworkStatus();
    
    // Слушатели изменения статуса сети
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    showAuthStatus();
    showNetworkStatus();
});
