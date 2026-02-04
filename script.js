// Mathematical formulas and code snippets
const mathFormulas = [
    '∫f(x)dx', '∇²φ = 0', 'E = mc²', '∂u/∂t + u·∇u = -∇p + ν∇²u',
    'lim_{n→∞} (1+1/n)ⁿ = e', '∑_{i=1}^n xᵢ', 'P(A|B) = P(B|A)P(A)/P(B)',
    'det(A) = ∑σ sgn(σ)∏aᵢ,σ(ᵢ)', '∇ × B = μ₀J', 'Δx·Δp ≥ ħ/2',
    'f\'(x) = lim_{h→0} [f(x+h)-f(x)]/h', '∫₋∞^∞ e^(-x²) dx = √π',
    'div F = ∇·F', 'curl F = ∇×F', 'λx = Ax', '||x||₂ = √(∑xᵢ²)',
    'σ² = E[(X-μ)²]', 'χ²(k) = ∑Zᵢ²', 'N(μ,σ²)', 'β = (XᵀX)⁻¹XᵀY'
];

const codeSnippets = [
    'import numpy as np', 'def gradient_descent():', 'plt.plot(x, y)',
    'from scipy import optimize', 'X_train, X_test = train_test_split()',
    'model.fit(X, y)', 'np.linalg.solve(A, b)', 'pd.DataFrame(data)',
    'sklearn.linear_model', 'torch.nn.functional', 'tf.keras.layers',
    'cv2.findContours()', 'spline = UnivariateSpline()', 'R²_score',
    'matplotlib.pyplot', 'seaborn.heatmap()', 'stats.normaltest()',
    'optimize.minimize()', 'interpolate.griddata()', 'linalg.svd()'
];

// Create floating elements
function createFloatingElement(content, type) {
    const element = document.createElement('div');
    element.className = type === 'math' ? 'floating-formula' : 'floating-code';
    element.textContent = content;
    
    // Random positioning and sizing
    element.style.left = Math.random() * 100 + '%';
    element.style.fontSize = (Math.random() * 0.8 + 0.8) + 'rem';
    element.style.animationDelay = Math.random() * 20 + 's';
    element.style.animationDuration = (Math.random() * 10 + 15) + 's';
    
    return element;
}

// Generate floating background
function generateMathBackground() {
    const background = document.getElementById('mathBackground');
    if (!background) return; // Exit if element doesn't exist
    
    // Create formulas
    for (let i = 0; i < 15; i++) {
        const formula = mathFormulas[Math.floor(Math.random() * mathFormulas.length)];
        const element = createFloatingElement(formula, 'math');
        background.appendChild(element);
    }
    
    // Create code snippets
    for (let i = 0; i < 10; i++) {
        const code = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        const element = createFloatingElement(code, 'code');
        background.appendChild(element);
    }
}

// Regenerate elements periodically
function regenerateBackground() {
    const background = document.getElementById('mathBackground');
    if (!background) return; // Exit if element doesn't exist
    background.innerHTML = '';
    generateMathBackground();
}

// Language management
let currentLang = 'en'; // Default to English

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    updateLanguage();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-fr][data-en]');
    const langToggle = document.getElementById('langToggle');
    
    elements.forEach(element => {
        if (currentLang === 'fr') {
            element.textContent = element.getAttribute('data-fr');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update language toggle button
    if (currentLang === 'fr') {
        langToggle.innerHTML = '🇬🇧 EN';
    } else {
        langToggle.innerHTML = '🇫🇷 FR';
    }
    
    // Update form submission message
    updateFormMessage();
}

function updateFormMessage() {
    // This will be used in the form submission
    window.currentFormMessage = currentLang === 'fr' 
        ? 'Merci pour votre message ! Je vous répondrai bientôt.'
        : 'Thank you for your message! I will reply soon.';
}

// Initialize with English as default
function initializeLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.innerHTML = '🇫🇷 FR'; // Show FR since we're in EN mode
    }
    updateLanguage();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    alert(window.currentFormMessage || 'Merci pour votre message ! Je vous répondrai bientôt.');
    event.target.reset();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language and math background
    initializeLanguage();
    generateMathBackground();
    
    // Regenerate background every 30 seconds for variety
    setInterval(regenerateBackground, 30000);

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.research-card, .highlight-item, .conference-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});
