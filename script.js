// --------------------------------------------------------
// 1. DADOS BASE E SALVAMENTO NA MEMÓRIA DO NAVEGADOR
// --------------------------------------------------------
const PHONE_NUMBER = "5527992255770";
const EMAIL_ADDRESS = "orcamento@douglaspedreiro.com.br";

const defaultPortfolio = [
    { id: 6, title: "Piso Amadeirado", img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=500&auto=format" },
    { id: 5, title: "Cozinha Americana", img: "https://images.unsplash.com/photo-1556912177-c54030639a67?q=80&w=500&auto=format" }
];

const defaultReviews = [
    { id: 1, client: "Ivanete Bernardes", text: "Excelente profissional. Fui muito bem atendida.", rating: 5 },
    { id: 2, client: "Alef Goulart", text: "Serviço maravilhoso e impecável.", rating: 5 }
];

let portfolio = JSON.parse(localStorage.getItem('dp_portfolio')) || defaultPortfolio;
let reviews = JSON.parse(localStorage.getItem('dp_reviews')) || defaultReviews;

function saveDataLocally() {
    localStorage.setItem('dp_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('dp_reviews', JSON.stringify(reviews));
}

let isReviewsExpanded = false;

// --------------------------------------------------------
// 2. NAVEGAÇÃO SPA E ACESSO ESCONDIDO (Easter Egg)
// --------------------------------------------------------
let footerClickCount = 0;
function secretAdminAccess() {
    footerClickCount++;
    if (footerClickCount === 5) {
        footerClickCount = 0;
        if (prompt("Acesso Administrativo. Digite a senha:") === "admin123") {
            openAdmin();
        }
    }
    setTimeout(() => { footerClickCount = 0; }, 3000); // Reseta se demorar a clicar
}

function switchPage(pageId) {
    document.getElementById('page-home').classList.add('hidden');
    document.getElementById('page-gallery').classList.add('hidden');
    document.getElementById('page-contact').classList.add('hidden');
    document.getElementById(`page-${pageId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.classList.remove('active-nav');
        const text = link.textContent.toLowerCase();
        if ((pageId === 'home' && text.includes('início')) || 
            (pageId === 'gallery' && text.includes('galeria')) || 
            (pageId === 'contact' && text.includes('contato'))) {
            link.classList.add('active-nav');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initScrollAnimations, 150);
}

// --------------------------------------------------------
// 3. WHATSAPP E EMAIL
// --------------------------------------------------------
function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function sendEmail(e) {
    e.preventDefault();
    const nome = document.getElementById('email-nome').value;
    const msg = document.getElementById('email-msg').value;
    const subject = `Orçamento Site - ${nome}`;
    const body = `Olá Douglas,\n\nMeu nome/empresa é: ${nome}\n\nDetalhes do projeto:\n${msg}`;
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const getStars = (rating) => {
    let stars = '';
    for(let i=1; i<=5; i++) {
        stars += `<svg class="w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    return stars;
};

// --------------------------------------------------------
// 4. GALERIA
// --------------------------------------------------------
function renderPortfolio() {
    const containerHome = document.getElementById('portfolio-grid-home');
    const containerFull = document.getElementById('portfolio-grid-full');
    
    const amostra = portfolio.slice(0, 3);
    
    const itemHTML = (item) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal">
            <div class="gallery-img-wrapper" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}" loading="lazy">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2 truncate px-2">${item.title}</h4>
        </div>`;

    containerHome.innerHTML = amostra.map(itemHTML).join('');
    containerFull.innerHTML = portfolio.map(itemHTML).join('');
}

function openLightbox(imgSrc, title) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-caption').textContent = title;
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

// --------------------------------------------------------
// 5. AVALIAÇÕES (CORRIGIDO)
// --------------------------------------------------------
function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btnContainer = document.getElementById('show-more-container');
    
    // FILTRO RIGOROSO: Só aparece no site o que for Nota 5
    const topReviews = reviews.filter(r => Number(r.rating) === 5);
    const limit = 3;
    const reviewsToShow = isReviewsExpanded ? topReviews : topReviews.slice(0, limit);
    
    container.innerHTML = reviewsToShow.map(r => `
        <div class="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-blue relative mb-4">
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <div class="flex">${getStars(5)}</div>
            </div>
            <p class="text-gray-600 italic mt-4 text-center leading-relaxed text-sm">"${r.text}"</p>
            <p class="font-heading font-bold text-brand-dark text-center mt-6">— ${r.client}</p>
        </div>`).join('');

    if (topReviews.length > limit) {
        btnContainer.classList.remove('hidden');
        document.getElementById('show-more-btn').textContent = isReviewsExpanded ? "Ver menos" : "Ver mais";
    } else {
        btnContainer.classList.add('hidden');
    }
}

function initStarSelector() {
    const container = document.getElementById('star-selector');
    const inputRating = document.getElementById('review-rating');
    
    const drawStars = (currentVal) => {
        container.innerHTML = '';
        for(let i=1; i<=5; i++) {
            const star = document.createElement('div');
            star.className = 'cursor-pointer p-1 transition-transform hover:scale-125';
            star.innerHTML = `<svg class="w-10 h-10 ${i <= currentVal ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
            star.onclick = () => { inputRating.value = i; drawStars(i); };
            container.appendChild(star);
        }
    };
    drawStars(inputRating.value);
}

function submitReview(e) {
    e.preventDefault();
    const nota = parseInt(document.getElementById('review-rating').value);
    
    reviews.unshift({ 
        id: Date.now(), 
        client: document.getElementById('review-name').value, 
        text: document.getElementById('review-text').value, 
        rating: nota 
    });
    
    saveDataLocally();
    e.target.reset();
    document.getElementById('review-rating').value = 5;
    initStarSelector();
    alert("Avaliação recebida! Se for nota 5, ela aparecerá no site em breve.");
    renderPublicReviews();
}

// --------------------------------------------------------
// 6. ADMIN E UPLOAD DE IMAGEM (NOVO)
// --------------------------------------------------------
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('new-photo-url').value = event.target.result;
            alert("Imagem carregada do dispositivo!");
        };
        reader.readAsDataURL(file);
    }
}

function renderAdminData() {
    const revContainer = document.getElementById('admin-reviews-list');
    revContainer.innerHTML = reviews.map(r => `
        <div class="bg-white p-4 rounded border-l-4 ${r.rating === 5 ? 'border-green-500' : 'border-red-400'} flex justify-between items-center mb-2">
            <div>
                <p class="font-bold">${r.client} <span class="text-xs ml-2">⭐ ${r.rating}</span></p>
                <p class="text-sm">"${r.text}"</p>
            </div>
            <button onclick="deleteReview(${r.id})" class="text-red-500 font-bold">Apagar</button>
        </div>`).join('');

    const galContainer = document.getElementById('admin-gallery-list');
    galContainer.innerHTML = portfolio.map((p, index) => `
        <div draggable="true" ondragstart="handleDragStart(event, ${index})" ondrop="handleDrop(event, ${index})" ondragover="e=>e.preventDefault()"
             class="bg-white p-2 rounded shadow border relative group">
            <img src="${p.img}" class="w-full h-20 object-cover rounded">
            <p class="text-[10px] truncate mt-1">${p.title}</p>
            <button onclick="deletePhoto(${p.id})" class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">✕</button>
        </div>`).join('');
}

function addPhoto(e) {
    e.preventDefault();
    const url = document.getElementById('new-photo-url').value;
    if(!url.startsWith('http') && !url.startsWith('data:image')) {
        alert("Por favor, selecione um arquivo ou insira um link direto de imagem válido.");
        return;
    }
    portfolio.unshift({ 
        id: Date.now(),
        title: document.getElementById('new-photo-title').value,
        img: url
    });
    saveDataLocally();
    renderAdminData();
    renderPortfolio();
    e.target.reset();
}

// Funções de Deletar e Drag&Drop permanecem similares, mas com saveDataLocally()
function deleteReview(id) { if(confirm("Apagar?")) { reviews = reviews.filter(r => r.id !== id); saveDataLocally(); renderAdminData(); renderPublicReviews(); } }
function deletePhoto(id) { if(confirm("Apagar?")) { portfolio = portfolio.filter(p => p.id !== id); saveDataLocally(); renderAdminData(); renderPortfolio(); } }

function openAdmin() { document.getElementById('admin-modal').classList.remove('hidden'); renderAdminData(); }
function closeAdmin() { document.getElementById('admin-modal').classList.add('hidden'); }

// --------------------------------------------------------
// 7. INICIALIZAÇÃO
// --------------------------------------------------------
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Adiciona evento de clique no logo do footer para o "Easter Egg"
    const footerLogo = document.querySelector('footer .w-8.h-8');
    if(footerLogo) footerLogo.parentElement.onclick = secretAdminAccess;

    // Atalho teclado
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toUpperCase() === 'L') {
            if (prompt("Senha Admin:") === "admin123") openAdmin();
        }
    });

    renderPortfolio();
    renderPublicReviews();
    initStarSelector();
    switchPage('home');
});