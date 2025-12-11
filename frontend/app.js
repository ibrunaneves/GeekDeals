/**
 * Geek Deals - Frontend Web
 * Arquivo JavaScript principal
 */

// Configuração da API
const API_URL = 'http://localhost:3000';

/**
 * Verifica se o usuário está autenticado
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();

    // Páginas que não precisam de autenticação
    const publicPages = ['login.html', 'register.html'];

    if (!token && !publicPages.includes(currentPage)) {
        // Redireciona para login se não estiver autenticado
        window.location.href = 'login.html';
        return false;
    }

    if (token && publicPages.includes(currentPage)) {
        // Redireciona para home se já estiver autenticado
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

/**
 * Faz logout do usuário
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

/**
 * Formata preço em BRL
 */
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

/**
 * Formata data
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Mostra alerta de erro
 */
function showError(message) {
    const alertError = document.getElementById('alert-error');
    const errorMessage = document.getElementById('error-message');

    if (alertError && errorMessage) {
        alertError.style.display = 'flex';
        errorMessage.textContent = message;
    }
}

/**
 * Mostra alerta de sucesso
 */
function showSuccess(message) {
    const alertSuccess = document.getElementById('alert-success');
    const successMessage = document.getElementById('success-message');

    if (alertSuccess && successMessage) {
        alertSuccess.style.display = 'flex';
        successMessage.textContent = message;
    }
}

/**
 * Esconde alertas
 */
function hideAlerts() {
    const alertError = document.getElementById('alert-error');
    const alertSuccess = document.getElementById('alert-success');

    if (alertError) alertError.style.display = 'none';
    if (alertSuccess) alertSuccess.style.display = 'none';
}

// Verifica auth ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona classe de fade-in aos elementos quando carrega
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '1';
    });
});
