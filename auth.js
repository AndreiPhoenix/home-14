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
