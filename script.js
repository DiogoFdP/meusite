// --------------------------------------------------------
// 1. DADOS (Mock)
// --------------------------------------------------------
const PHONE_NUMBER = "5527992255770";
const EMAIL_ADDRESS = "orcamento@douglaspedreiro.com.br"; // Edite para o email real

let portfolio = [
    { id: 1, title: "Bancadas", img: "img/bancada.jpg" },
    { id: 2, title: "Revestimento Banheiro", img: "img/banheiro.jpg" },
    { id: 3, title: "Porcelanato Grandes Formatos", img: "img/sala.jpg" },
    { id: 4, title: "Nicho", img: "img/nicho.jpg" },
    { id: 5, title: "Cozinha Americana", img: "img/cozinha.jpg" },
    { id: 6, title: "Piso Amadeirado", img: "img/amadeirado.jpg" }
];

let reviews = [
    { id: 1, client: "Ivanete Bernardes", text: "Excelente profissional. Fui muito bem atendida. Serviço com muito capricho.", rating: 5 },
    { id: 2, client: "Alef Goulart", text: "Serviço maravilhoso e impecável. Deixou a obra limpa e nivelada.", rating: 5 },
    { id: 3, client: "Wanderson Araujo", text: "Trabalho limpo, organizado e bem executado. Excelente profissional.", rating: 5 },
    { id: 4, client: "Alexsander Braz", text: "Precisei de um serviço de última hora e fui surpreendido positivamente. Rapidez e qualidade.", rating: 5 }
];

let isReviewsExpanded = false;

// --------------------------------------------------------
// 2. NAVEGAÇÃO SPA (Troca de Páginas)
// --------------------------------------------------------
function switchPage(pageId) {
    // Ocultar todas as páginas
    document.getElementById('page-home').classList.add('hidden');
    document.getElementById('page-gallery').classList.add('hidden');
    document.getElementById('page-contact').classList.add('hidden');

    // Mostrar a página alvo
    document.getElementById(`page-${pageId}`).classList.remove('hidden');

    // Atualizar visual dos links do menu
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.classList.remove('active-nav');
        if (link.textContent.toLowerCase().includes(pageId === 'home' ? 'início' : (pageId === 'gallery' ? 'galeria' : 'contato'))) {
            link.classList.add('active-nav');
        }
    });

    // Rolar para o topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Disparar animações da nova view
    setTimeout(initScrollAnimations, 100);
}

// --------------------------------------------------------
// 3. FUNÇÕES GERAIS E RENDERIZAÇÃO
// --------------------------------------------------------
function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Simula envio de e-mail usando Mailto
function sendEmail(e) {
    e.preventDefault();
    const nome = document.getElementById('email-nome').value;
    const msg = document.getElementById('email-msg').value;
    const subject = `Orçamento Site - ${nome}`;
    const body = `Olá Douglas,\n\nMeu nome/empresa é: ${nome}\n\nDetalhes do projeto:\n${msg}\n\nAguardo retorno!`;
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
// 4. GALERIA E LIGHTBOX
// --------------------------------------------------------
function renderPortfolio() {
    // Renderiza na HOME (Apenas 3 últimas para amostra)
    const containerHome = document.getElementById('portfolio-grid-home');
    const amostra = portfolio.slice(-3).reverse(); // Pega as 3 mais recentes
    
    // Na Home, retângulos normais (usando height fixo)
    containerHome.innerHTML = amostra.map((item, index) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal" style="transition-delay: ${index * 100}ms">
            <div class="gallery-img-wrapper h-64 w-full" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2">${item.title}</h4>
        </div>
    `).join('');

    // Renderiza na PÁGINA GALERIA (Todas, organizadas em quadrados)
    const containerFull = document.getElementById('portfolio-grid-full');
    containerFull.innerHTML = portfolio.slice().reverse().map((item, index) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal">
            <!-- A classe aspect-square do CSS força o formato quadrado perfeito -->
            <div class="gallery-img-wrapper w-full" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-3 mb-1 text-sm md:text-base truncate">${item.title}</h4>
        </div>
    `).join('');
}

function openLightbox(imgSrc, title) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-caption').textContent = title;
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

// Fechar lightbox clicando fora
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

// --------------------------------------------------------
// 5. AVALIAÇÕES PÚBLICAS
// --------------------------------------------------------
function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btnContainer = document.getElementById('show-more-container');
    const btn = document.getElementById('show-more-btn');
    
    const topReviews = reviews.filter(r => r.rating === 5);
    const limit = 3; // Mostrar 3 por padrão na Home
    const reviewsToShow = isReviewsExpanded ? topReviews : topReviews.slice(0, limit);
    
    container.innerHTML = reviewsToShow.map((r, index) => `
        <div class="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-blue relative" style="transition-delay: ${(index % limit) * 50}ms">
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <div class="flex">${getStars(r.rating)}</div>
            </div>
            <p class="text-gray-600 italic mt-4 text-center leading-relaxed text-sm">"${r.text}"</p>
            <p class="font-heading font-bold text-brand-dark text-center mt-6">— ${r.client}</p>
        </div>
    `).join('');

    if (topReviews.length > limit) {
        btnContainer.classList.remove('hidden');
        btn.innerHTML = isReviewsExpanded ? "Ver menos avaliações" : "Ver mais avaliações";
    } else {
        btnContainer.classList.add('hidden');
    }
}

function toggleReviews() {
    isReviewsExpanded = !isReviewsExpanded;
    renderPublicReviews();
}

function initStarSelector() {
    const container = document.getElementById('star-selector');
    const input = document.getElementById('review-rating');
    const renderInteractiveStars = (hoverVal = 0) => {
        const currentVal = hoverVal || parseInt(input.value);
        container.innerHTML = '';
        for(let i=1; i<=5; i++) {
            const star = document.createElement('div');
            star.className = 'cursor-pointer p-1 transition-transform hover:scale-125';
            star.innerHTML = `<svg class="w-10 h-10 ${i <= currentVal ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
            star.onmouseover = () => renderInteractiveStars(i);
            star.onmouseleave = () => renderInteractiveStars();
            star.onclick = () => { input.value = i; renderInteractiveStars(); };
            container.appendChild(star);
        }
    };
    renderInteractiveStars();
}

function submitReview(e) {
    e.preventDefault();
    reviews.unshift({ 
        id: Date.now(), 
        client: document.getElementById('review-name').value, 
        text: document.getElementById('review-text').value, 
        rating: parseInt(document.getElementById('review-rating').value) 
    });
    e.target.reset();
    document.getElementById('review-rating').value = 5;
    initStarSelector();
    alert("Avaliação enviada com sucesso!");
    renderPublicReviews();
    renderAdminData();
}

// --------------------------------------------------------
// 6. ADMIN OCULTO (Shift + L)
// --------------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        if (prompt("Acesso Administrativo. Digite a senha:") === "admin123") {
            openAdmin();
        } else {
            alert("Senha incorreta.");
        }
    }
});

function openAdmin() {
    document.getElementById('admin-modal').classList.remove('hidden');
    renderAdminData();
}

function closeAdmin() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function switchAdminTab(tab) {
    document.getElementById('admin-reviews-panel').classList.toggle('hidden', tab !== 'reviews');
    document.getElementById('admin-gallery-panel').classList.toggle('hidden', tab !== 'gallery');
    
    document.getElementById('tab-reviews').className = tab === 'reviews' 
        ? "flex-1 py-3 font-bold text-brand-blue border-b-2 border-brand-blue" 
        : "flex-1 py-3 font-bold text-gray-500 hover:text-brand-blue";
        
    document.getElementById('tab-gallery').className = tab === 'gallery' 
        ? "flex-1 py-3 font-bold text-brand-blue border-b-2 border-brand-blue" 
        : "flex-1 py-3 font-bold text-gray-500 hover:text-brand-blue";
}

function renderAdminData() {
    // Renderiza Lista de Avaliações
    const revContainer = document.getElementById('admin-reviews-list');
    revContainer.innerHTML = reviews.map(r => `
        <div class="bg-white p-4 rounded border-l-4 ${r.rating === 5 ? 'border-green-500' : 'border-yellow-400'} flex justify-between items-center">
            <div><p class="font-bold">${r.client}</p><p class="text-sm">"${r.text}"</p></div>
            <button onclick="deleteReview(${r.id})" class="text-red-500 bg-red-50 px-3 py-1 rounded">Apagar</button>
        </div>
    `).join('');

    // Renderiza Lista da Galeria
    const galContainer = document.getElementById('admin-gallery-list');
    galContainer.innerHTML = portfolio.slice().reverse().map(p => `
        <div class="bg-white p-2 rounded shadow border text-center relative group">
            <img src="${p.img}" class="w-full h-24 object-cover rounded mb-2">
            <p class="text-xs font-bold truncate">${p.title}</p>
            <button onclick="deletePhoto(${p.id})" class="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
        </div>
    `).join('');
}

function deleteReview(id) {
    if(confirm("Apagar esta avaliação?")) {
        reviews = reviews.filter(r => r.id !== id);
        renderAdminData();
        renderPublicReviews(); 
    }
}

function addPhoto(e) {
    e.preventDefault();
    portfolio.push({
        id: Date.now(),
        title: document.getElementById('new-photo-title').value,
        img: document.getElementById('new-photo-url').value
    });
    e.target.reset();
    renderAdminData();
    renderPortfolio();
    alert("Foto adicionada com sucesso!");
}

function deletePhoto(id) {
    if(confirm("Deseja apagar esta foto da galeria?")) {
        portfolio = portfolio.filter(p => p.id !== id);
        renderAdminData();
        renderPortfolio();
    }
}

// --------------------------------------------------------
// 7. ANIMAÇÕES DE SCROLL E INICIALIZAÇÃO
// --------------------------------------------------------
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(element => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    renderPortfolio();
    renderPublicReviews();
    initStarSelector();
    switchPage('home'); // Garante que começa na home
});