// --------------------------------------------------------
// 1. DADOS BASE E SALVAMENTO (LOCAL STORAGE)
// --------------------------------------------------------
const PHONE_NUMBER = "5527992255770";
const EMAIL_ADDRESS = "orcamento@douglaspedreiro.com.br";

const defaultPortfolio = [
    { id: 6, title: "Piso Amadeirado", img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=500&auto=format" },
    { id: 5, title: "Cozinha Americana", img: "https://images.unsplash.com/photo-1556912177-c54030639a67?q=80&w=500&auto=format" },
    { id: 4, title: "Nicho em Porcelanato", img: "https://images.unsplash.com/photo-1620626011761-9963d7521576?q=80&w=500&auto=format" }
];

const defaultReviews = [
    { id: 1, client: "Ivanete Bernardes", text: "Excelente profissional. Fui muito bem atendida. Serviço com muito capricho.", rating: 5 },
    { id: 2, client: "Alef Goulart", text: "Serviço maravilhoso e impecável. Deixou a obra limpa.", rating: 5 },
    { id: 3, client: "Wanderson Araujo", text: "Trabalho limpo, organizado e bem executado.", rating: 5 },
    { id: 4, client: "Alexsander Braz", text: "Rapidez e qualidade. Fui surpreendido positivamente.", rating: 5 }
];

let portfolio = JSON.parse(localStorage.getItem('dp_portfolio')) || defaultPortfolio;
let reviews = JSON.parse(localStorage.getItem('dp_reviews')) || defaultReviews;

function saveDataLocally() {
    localStorage.setItem('dp_portfolio', JSON.stringify(portfolio));
    localStorage.setItem('dp_reviews', JSON.stringify(reviews));
}

let isReviewsExpanded = false;

// --------------------------------------------------------
// 2. NAVEGAÇÃO SPA E ACESSO ADMIN ESCONDIDO
// --------------------------------------------------------
let footerClickCount = 0;
function secretAdminAccess() {
    footerClickCount++;
    if (footerClickCount === 5) {
        footerClickCount = 0;
        const pass = prompt("Acesso Administrativo. Digite a senha:");
        if (pass === "admin123") openAdmin();
    }
    setTimeout(() => { footerClickCount = 0; }, 3000);
}

function switchPage(pageId) {
    // Esconde todas as páginas
    ['home', 'gallery', 'contact'].forEach(p => {
        const el = document.getElementById(`page-${p}`);
        if(el) el.classList.add('hidden');
    });

    // Mostra a página alvo
    const target = document.getElementById(`page-${pageId}`);
    if(target) target.classList.remove('hidden');

    // Atualiza links do menu
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
// 3. WHATSAPP E E-MAIL
// --------------------------------------------------------
function openWhatsApp(message) {
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function sendEmail(e) {
    e.preventDefault();
    const nome = document.getElementById('email-nome').value;
    const msg = document.getElementById('email-msg').value;
    const subject = `Orçamento Site - ${nome}`;
    const body = `Olá Douglas,\n\nNome: ${nome}\n\nProjeto:\n${msg}`;
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
    const containerHome = document.getElementById('portfolio-grid-home');
    const containerFull = document.getElementById('portfolio-grid-full');
    if(!containerHome || !containerFull) return;

    const itemHTML = (item) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal">
            <div class="gallery-img-wrapper" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}" loading="lazy">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2 truncate px-2 text-sm md:text-base">${item.title}</h4>
        </div>`;

    containerHome.innerHTML = portfolio.slice(0, 3).map(itemHTML).join('');
    containerFull.innerHTML = portfolio.map(itemHTML).join('');
}

function openLightbox(imgSrc, title) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-caption').textContent = title;
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() { document.getElementById('lightbox').classList.add('hidden'); }

// --------------------------------------------------------
// 5. AVALIAÇÕES (CORRIGIDO NOTAS E VER MAIS)
// --------------------------------------------------------
function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btnContainer = document.getElementById('show-more-container');
    const btn = document.getElementById('show-more-btn');
    if(!container) return;

    // Apenas notas 5 aparecem no site público
    const topReviews = reviews.filter(r => Number(r.rating) === 5);
    const limit = 3;
    const reviewsToShow = isReviewsExpanded ? topReviews : topReviews.slice(0, limit);
    
    container.innerHTML = reviewsToShow.map(r => `
        <div class="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-blue relative mb-8">
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <div class="flex">${getStars(5)}</div>
            </div>
            <p class="text-gray-600 italic mt-4 text-center leading-relaxed text-sm">"${r.text}"</p>
            <p class="font-heading font-bold text-brand-dark text-center mt-6">— ${r.client}</p>
        </div>`).join('');

    if (topReviews.length > limit) {
        btnContainer.classList.remove('hidden');
        btn.textContent = isReviewsExpanded ? "Ver menos avaliações" : "Ver mais avaliações";
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
    const inputRating = document.getElementById('review-rating');
    if(!container) return;

    const drawStars = (val) => {
        container.innerHTML = '';
        for(let i=1; i<=5; i++) {
            const star = document.createElement('div');
            star.className = 'cursor-pointer p-1 transition-transform hover:scale-125';
            star.innerHTML = `<svg class="w-10 h-10 ${i <= val ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
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
    alert("Avaliação enviada com sucesso!");
    renderPublicReviews();
    renderAdminData();
}

// --------------------------------------------------------
// 6. ADMIN (ABAS, UPLOAD E DRAG & DROP)
// --------------------------------------------------------
function switchAdminTab(tab) {
    document.getElementById('admin-reviews-panel').classList.toggle('hidden', tab !== 'reviews');
    document.getElementById('admin-gallery-panel').classList.toggle('hidden', tab !== 'gallery');
    
    const tRev = document.getElementById('tab-reviews');
    const tGal = document.getElementById('tab-gallery');
    
    const active = "flex-1 py-3 font-bold text-brand-blue border-b-2 border-brand-blue";
    const inactive = "flex-1 py-3 font-bold text-gray-500 hover:text-brand-blue";
    
    if(tRev && tGal) {
        tRev.className = tab === 'reviews' ? active : inactive;
        tGal.className = tab === 'gallery' ? active : inactive;
    }
}

// Transformar arquivo local em Link (Base64)
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('new-photo-url').value = ev.target.result;
            alert("Imagem carregada!");
        };
        reader.readAsDataURL(file);
    }
}

function renderAdminData() {
    const revContainer = document.getElementById('admin-reviews-list');
    const galContainer = document.getElementById('admin-gallery-list');
    if(!revContainer || !galContainer) return;

    revContainer.innerHTML = reviews.map(r => `
        <div class="bg-white p-3 rounded border-l-4 ${r.rating === 5 ? 'border-green-500' : 'border-red-400'} mb-2 flex justify-between items-center text-sm shadow-sm">
            <div>
                <p><b>${r.client}</b> <span class="text-xs bg-gray-100 px-1 rounded">Nota: ${r.rating}</span></p>
                <p class="text-gray-600">"${r.text}"</p>
            </div>
            <button onclick="deleteReview(${r.id})" class="text-red-500 p-2">Apagar</button>
        </div>`).join('');

    galContainer.innerHTML = portfolio.map((p, index) => `
        <div draggable="true" ondragstart="draggedItemIndex=${index}" ondragover="event.preventDefault()" ondrop="handleDrop(event, ${index})" 
             class="bg-white p-2 rounded shadow border relative group cursor-move">
            <img src="${p.img}" class="w-full h-20 object-cover rounded">
            <p class="text-[10px] truncate mt-1 font-bold">${p.title}</p>
            <button onclick="deletePhoto(${p.id})" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow">✕</button>
        </div>`).join('');
}

function addPhoto(e) {
    e.preventDefault();
    const url = document.getElementById('new-photo-url').value;
    if(!url) return alert("Por favor, selecione uma foto ou insira um link.");

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

function deleteReview(id) { if(confirm("Apagar avaliação?")) { reviews = reviews.filter(r => r.id !== id); saveDataLocally(); renderAdminData(); renderPublicReviews(); } }
function deletePhoto(id) { if(confirm("Apagar foto?")) { portfolio = portfolio.filter(p => p.id !== id); saveDataLocally(); renderAdminData(); renderPortfolio(); } }

let draggedItemIndex = null;
function handleDrop(e, index) {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const item = portfolio.splice(draggedItemIndex, 1)[0];
    portfolio.splice(index, 0, item);
    saveDataLocally();
    renderAdminData();
    renderPortfolio();
    draggedItemIndex = null;
}

function openAdmin() { document.getElementById('admin-modal').classList.remove('hidden'); renderAdminData(); }
function closeAdmin() { document.getElementById('admin-modal').classList.add('hidden'); }

// --------------------------------------------------------
// 7. INICIALIZAÇÃO E EVENTOS
// --------------------------------------------------------
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    // Ano atual no footer
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Easter Egg no Logo do Footer (5 cliques para abrir admin)
    const logoFooter = document.querySelector('footer img, footer .font-heading');
    if(logoFooter) {
        logoFooter.parentElement.style.cursor = "pointer";
        logoFooter.parentElement.onclick = secretAdminAccess;
    }

    // Atalho Shift + L
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && (e.key === 'l' || e.key === 'L')) {
            const pass = prompt("Acesso Administrativo. Digite a senha:");
            if (pass === "admin123") openAdmin();
        }
    });

    renderPortfolio();
    renderPublicReviews();
    initStarSelector();
    switchPage('home'); // Inicia na home
});