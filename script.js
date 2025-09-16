// ===== FUNCIONES PARA VERSIÓN A - CORRECTA (Ley de Postel y Pareto) =====

// Función flexible para actualizar cantidad (acepta diferentes tipos de entrada)
function updateQuantity(itemId, change) {
    const input = document.getElementById(`qty-${itemId}`);
    let currentValue = parseInt(input.value) || 1; // Manejo flexible de valores
    let newValue = currentValue + change;
    
    // Validación permisiva pero segura
    if (newValue < 1) newValue = 1;
    if (newValue > 99) newValue = 99; // Límite razonable
    
    input.value = newValue;
    updateTotal();
}

// Validación flexible de cantidad (Ley de Postel: ser liberal en lo que aceptas)
function validateQuantity(input) {
    let value = input.value;
    
    // Limpiar entrada: remover caracteres no numéricos
    value = value.replace(/[^0-9]/g, '');
    
    // Si está vacío, establecer valor por defecto
    if (value === '' || value === '0') {
        value = '1';
    }
    
    // Convertir a número y validar rango
    let numValue = parseInt(value);
    if (numValue > 99) numValue = 99;
    if (numValue < 1) numValue = 1;
    
    input.value = numValue;
    updateTotal();
    
    // Feedback visual sutil
    input.style.borderColor = '#27ae60';
    setTimeout(() => {
        input.style.borderColor = '#ddd';
    }, 1000);
}

// Función simple para remover item (foco en funcionalidad esencial - Pareto)
function removeItem(itemId) {
    const item = document.getElementById(`qty-${itemId}`).closest('.cart-item');
    item.style.transition = 'opacity 0.3s ease';
    item.style.opacity = '0';
    
    setTimeout(() => {
        item.remove();
        updateTotal();
        updateItemCount();
    }, 300);
}

// Aplicar código promocional con validación flexible
function applyPromo(version) {
    const input = document.getElementById(`promo-input-${version}`);
    let code = input.value.trim().toUpperCase();
    
    // Aceptar diferentes formatos de códigos promocionales
    const validCodes = ['DESCUENTO10', 'DESC10', '10OFF', 'PROMO10', 'SAVE10'];
    
    if (validCodes.includes(code) || code.includes('10') || code.includes('DESC')) {
        showMessage('✅ Código aplicado correctamente. Descuento del 10%', 'success');
        input.style.borderColor = '#27ae60';
        input.disabled = true;
    } else if (code === '') {
        showMessage('ℹ️ Ingresa un código promocional', 'info');
    } else {
        showMessage('⚠️ Código no válido, pero puedes seguir comprando', 'warning');
    }
}

// Actualizar total (funcionalidad core - Pareto)
function updateTotal() {
    // Simulación simple del cálculo
    const totalElement = document.querySelector('.version-a .total strong');
    if (totalElement) {
        totalElement.textContent = 'Total: $479.97';
    }
}

// Actualizar contador de items
function updateItemCount() {
    const items = document.querySelectorAll('.version-a .cart-item');
    const counter = document.querySelector('.version-a .item-count');
    if (counter) {
        counter.textContent = `${items.length} productos`;
    }
}

// ===== FUNCIONES PARA VERSIÓN B - INCORRECTA (Incumple ambas leyes) =====

// Validación estricta y rígida (Incumple Ley de Postel)
function strictValidation(input) {
    const value = input.value;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg';
    errorDiv.style.display = 'block';
    
    // Remover mensajes de error previos
    const existingError = input.parentNode.querySelector('.error-msg');
    if (existingError) {
        existingError.remove();
    }
    
    // Validación extremadamente estricta
    if (!/^[1-9][0-9]*$/.test(value)) {
        errorDiv.textContent = 'ERROR: Solo se permiten números enteros positivos sin ceros a la izquierda';
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#f8d7da';
        return false;
    }
    
    if (parseInt(value) > 10) {
        errorDiv.textContent = 'ERROR: Cantidad máxima permitida: 10 unidades';
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#dc3545';
        return false;
    }
    
    if (parseInt(value) === 1) {
        errorDiv.textContent = 'ADVERTENCIA: ¿Estás seguro de que solo quieres 1 unidad?';
        errorDiv.style.backgroundColor = '#fff3cd';
        errorDiv.style.color = '#856404';
        input.parentNode.appendChild(errorDiv);
    }
    
    input.style.borderColor = '#28a745';
    input.style.backgroundColor = '#d4edda';
    return true;
}

// Validación extremadamente estricta para código promocional
function strictPromoValidation() {
    const input = document.getElementById('promo-strict');
    const errorMsg = document.getElementById('promo-error');
    const value = input.value;
    
    // Limpiar mensajes previos
    errorMsg.style.display = 'none';
    input.style.borderColor = '#ffc107';
    
    // Validación rígida del formato exacto
    const regex = /^PROMO-[A-Z]{4}-[A-Z]{4}$/;
    
    if (value.length !== 15) {
        showStrictError('El código debe tener exactamente 15 caracteres');
        return;
    }
    
    if (!regex.test(value)) {
        showStrictError('Formato incorrecto. Debe ser: PROMO-XXXX-YYYY (solo letras mayúsculas)');
        return;
    }
    
    if (value === 'PROMO-TEST-CODE') {
        showStrictError('Este código de prueba no es válido');
        return;
    }
    
    if (value.includes('DEMO') || value.includes('TEST')) {
        showStrictError('Los códigos de demostración no son válidos');
        return;
    }
    
    // Incluso si el formato es correcto, rechazar por otras razones
    const rejectionReasons = [
        'Código expirado',
        'Código ya utilizado',
        'Código no válido para tu región',
        'Código solo válido para usuarios premium',
        'Código no compatible con productos en tu carrito'
    ];
    
    const randomReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
    showStrictError(randomReason);
}

function showStrictError(message) {
    const input = document.getElementById('promo-strict');
    const errorMsg = document.getElementById('promo-error');
    
    errorMsg.textContent = `ERROR: ${message}`;
    errorMsg.style.display = 'block';
    input.style.borderColor = '#dc3545';
    input.style.backgroundColor = '#f8d7da';
    
    // Efecto de vibración
    input.style.animation = 'shake 0.5s';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

// Función para mostrar mensajes (versión A)
function showMessage(message, type) {
    // Remover mensaje previo si existe
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#27ae60';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#f39c12';
            break;
        case 'info':
            messageDiv.style.backgroundColor = '#3498db';
            break;
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateTotal();
    updateItemCount();
    
    // Agregar tooltips informativos a la versión A (funcionalidad útil - Pareto)
    const versionA = document.querySelector('.version-a');
    if (versionA) {
        const checkoutBtn = versionA.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.title = 'Proceder al pago de forma segura';
        }
        
        const promoInput = versionA.querySelector('.promo-code input');
        if (promoInput) {
            promoInput.title = 'Ingresa cualquier código promocional. Aceptamos varios formatos.';
        }
    }
    
    // Agregar comportamientos molestos a la versión B (incumple usabilidad)
    const versionB = document.querySelector('.version-b');
    if (versionB) {
        // Popup molesto cada 10 segundos
        setInterval(() => {
            if (Math.random() > 0.7) {
                alert('¡OFERTA ESPECIAL! ¿Quieres suscribirte a nuestro newsletter?');
            }
        }, 10000);
        
        // Hacer que los botones se muevan al pasar el mouse
        const buttons = versionB.querySelectorAll('.checkout-btn-b');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (Math.random() > 0.5) {
                    this.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
                }
            });
        });
    }
});