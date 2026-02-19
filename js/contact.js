// ============================================================
// Contact Form Handler
// ============================================================

// Configuration - Replace with your EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Alternative: Use Formspree instead
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const USE_EMAILJS = false; // Set to true to use EmailJS instead of Formspree

// ============================================================
// Form Handler
// ============================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        showMessage('Envoi en cours...', 'loading');
        
        if (USE_EMAILJS) {
            await sendViaEmailJS(formData);
        } else {
            await sendViaFormspree(formData);
        }
        
        showMessage('Message envoyé avec succès! ✓', 'success');
        form.reset();
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    }
}

// ============================================================
// EmailJS Integration
// ============================================================

async function sendViaEmailJS(formData) {
    if (!window.emailjs) {
        throw new Error('EmailJS not loaded. Include the library in HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>');
    }
    
    // Initialize EmailJS (do once)
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    const templateParams = {
        to_email: 'your-email@example.com',
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        message: formData.get('message'),
        phone: formData.get('phone') || 'Non fourni'
    };
    
    const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
    );
    
    if (response.status !== 200) {
        throw new Error('EmailJS send failed');
    }
}

// ============================================================
// Formspree Integration
// ============================================================

async function sendViaFormspree(formData) {
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        message: formData.get('message')
    };
    
    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Formspree error: ${response.statusText}`);
    }
    
    return response.json();
}

// ============================================================
// UI Helpers
// ============================================================

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    if (type !== 'loading') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
});

// ============================================================
// Setup Instructions
// ============================================================
/*

OPTION 1: EMAILJS
================
1. Go to https://www.emailjs.com
2. Sign up and get your credentials:
   - Service ID
   - Template ID
   - Public Key
3. Add to HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"></script>
4. Update variables at the top of this file
5. Set USE_EMAILJS = true

OPTION 2: FORMSPREE (Recommended)
=================================
1. Go to https://formspree.io
2. Create an account and new form
3. Copy your form endpoint ID
4. Update FORMSPREE_ENDPOINT at the top
5. Keep USE_EMAILJS = false

Both services offer free tier with limited submissions.

*/
