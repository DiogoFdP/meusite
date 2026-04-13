// --------------------------------------------------------
// 1. DADOS BASE E SALVAMENTO NA MEMÓRIA DO NAVEGADOR
// --------------------------------------------------------
const PHONE_NUMBER = "5527992255770";

const defaultPortfolio = [
    { id: 6, title: "Piso Amadeirado", img: "img/amadeirado.jpg" },
    { id: 5, title: "Cozinha Americana", img: "img/cozinha.jpg" },
    { id: 4, title: "Nicho", img: "img/nicho.jpg" },
    { id: 3, title: "Porcelanato Grandes Formatos", img: "img/sala.jpg" },
    { id: 2, title: "Revestimento Banheiro", img: "img/banheiro.jpg" },
    { id: 1, title: "Bancadas", img: "img/bancada.jpg" }
];

const defaultReviews = [
    { id: 1, client: "Ivanete Bernardes", text: "Excelente profissional. Fui muito bem atendida. Serviço com muito capricho.", rating: 5 },
    { id: 2, client: "Alef Goulart", text: "Serviço maravilhoso e impecável. Deixou a obra limpa e nivelada.", rating: 5 },
    { id: 3, client: "Wanderson Araujo", text: "Trabalho limpo, organizado e bem executado. Excelente profissional.", rating: 5 },
    { id: 4, client: "Alexsander Braz", text: "Precisei de um serviço de última hora e fui surpreendido positivamente. Rapidez e qualidade.", rating: 5 }
];

let portfolio = [];
let reviews = [];

async function loadData() {
    const portfolioSnap = await fb.getDocs(fb.collection(db, "portfolio"));
    portfolio = portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const reviewsSnap = await fb.getDocs(fb.collection(db, "reviews"));
    reviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    renderPortfolio();
    renderPublicReviews();
}

async function savePortfolioItem(item) {
    await fb.addDoc(fb.collection(db, "portfolio"), item);
    await loadData();
}

async function deletePortfolioItem(id) {
    await fb.deleteDoc(fb.doc(db, "portfolio", id));
    await loadData();
}

async function saveReviewItem(item) {
    await fb.addDoc(fb.collection(db, "reviews"), item);
    await loadData();
}

async function deleteReviewItem(id) {
    await fb.deleteDoc(fb.doc(db, "reviews", id));
    await loadData();
}

let isReviewsExpanded = false;

// --------------------------------------------------------
// 2. NAVEGAÇÃO SPA
// --------------------------------------------------------
function switchPage(pageId) {
    document.getElementById('page-home').classList.add('hidden');
    document.getElementById('page-gallery').classList.add('hidden');
    document.getElementById('page-contact').classList.add('hidden');

    document.getElementById(`page-${pageId}`).classList.remove('hidden');

    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.classList.remove('active-nav');
        if (link.textContent.toLowerCase().includes(pageId === 'home' ? 'início' : (pageId === 'gallery' ? 'galeria' : 'contato'))) {
            link.classList.add('active-nav');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initScrollAnimations, 100);
}

// --------------------------------------------------------
// 3. FUNÇÕES WHATSAPP
// --------------------------------------------------------
function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Nova função que pega os dados do formulário e manda pro WhatsApp
function sendWhatsAppForm(e) {
    e.preventDefault(); // Impede a página de recarregar
    
    const nome = document.getElementById('wa-nome').value;
    const msg = document.getElementById('wa-msg').value;
    
    // Monta o texto que vai chegar no celular do Douglas
    const textoFinal = `Olá, Douglas! Meu nome é *${nome}*.\n\nGostaria de falar sobre o seguinte projeto:\n_${msg}_`;
    
    openWhatsApp(textoFinal);
    
    e.target.reset(); // Limpa os campos depois que enviou
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
    const amostra = portfolio.slice(0, 3);
    
    containerHome.innerHTML = amostra.map((item, index) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal" style="transition-delay: ${index * 100}ms">
            <div class="gallery-img-wrapper h-64 w-full" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2">${item.title}</h4>
        </div>
    `).join('');

    const containerFull = document.getElementById('portfolio-grid-full');
    containerFull.innerHTML = portfolio.map((item) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal">
            <div class="gallery-img-wrapper w-full" onclick="openLightbox('${item.img}', '${item.title}')">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-3 mb-1 text-sm md:text-base truncate px-2">${item.title}</h4>
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

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

// --------------------------------------------------------
// 5. AVALIAÇÕES 
// --------------------------------------------------------
function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btnContainer = document.getElementById('show-more-container');
    
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
        document.getElementById('show-more-btn').textContent = isReviewsExpanded ? "Ver menos" : "Ver mais avaliações";
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
    renderAdminData();
}

// --------------------------------------------------------
// 6. ADMIN E ACESSO SECRETO
// --------------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        requestAdminAccess();
    }
});

let secretClickCount = 0;
let secretClickTimer;

function handleSecretAdminClick() {
    secretClickCount++;
    clearTimeout(secretClickTimer);
    
    if (secretClickCount >= 5) {
        secretClickCount = 0;
        requestAdminAccess();
    } else {
        secretClickTimer = setTimeout(() => {
            secretClickCount = 0;
        }, 2000); 
    }
}

function requestAdminAccess() {
    if (prompt("Acesso Administrativo. Digite a senha:") === "Dioguinho2") {
        openAdmin();
    } else {
        alert("Senha incorreta.");
    }
}

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
    
    document.getElementById('tab-reviews').className = tab === 'reviews' ? "flex-1 py-3 font-bold text-brand-blue border-b-2 border-brand-blue" : "flex-1 py-3 font-bold text-gray-500 hover:text-brand-blue";
    document.getElementById('tab-gallery').className = tab === 'gallery' ? "flex-1 py-3 font-bold text-brand-blue border-b-2 border-brand-blue" : "flex-1 py-3 font-bold text-gray-500 hover:text-brand-blue";
}

function renderAdminData() {
    const revContainer = document.getElementById('admin-reviews-list');
    revContainer.innerHTML = reviews.map(r => `
        <div class="bg-white p-4 rounded border-l-4 ${r.rating === 5 ? 'border-green-500' : 'border-yellow-400'} flex justify-between items-center">
            <div>
                <p class="font-bold flex items-center gap-2">${r.client} <span class="bg-gray-100 text-xs px-2 rounded text-gray-600">Nota: ${r.rating}</span></p>
                <p class="text-sm">"${r.text}"</p>
            </div>
            <button onclick="deleteReview(${r.id})" class="text-red-500 bg-red-50 px-3 py-1 rounded">Apagar</button>
        </div>
    `).join('');

    const galContainer = document.getElementById('admin-gallery-list');
    galContainer.innerHTML = portfolio.map((p, index) => `
        <div draggable="true" 
             ondragstart="handleDragStart(event, ${index})" 
             ondragover="handleDragOver(event)" 
             ondragleave="handleDragLeave(event)" 
             ondrop="handleDrop(event, ${index})"
             class="bg-white p-2 rounded shadow border text-center relative group cursor-move transition-all">
            <img src="${p.img}" class="w-full h-24 object-cover rounded mb-2 pointer-events-none">
            <p class="text-xs font-bold truncate">${p.title}</p>
            
            <button onclick="editPhotoTitle(${p.id})" class="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Editar Título">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            
            <button onclick="deletePhoto(${p.id})" class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Apagar Foto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    `).join('');
}

function deleteReview(id) {
    if(confirm("Apagar esta avaliação?")) {
        reviews = reviews.filter(r => r.id !== id);
        saveDataLocally();
        renderAdminData();
        renderPublicReviews(); 
    }
}

function editPhotoTitle(id) {
    const photo = portfolio.find(p => p.id === id);
    if (!photo) return;
    const newTitle = prompt("Digite o novo título da foto:", photo.title);
    if (newTitle !== null && newTitle.trim() !== "") {
        photo.title = newTitle.trim();
        saveDataLocally();
        renderAdminData();
        renderPortfolio();
    }
}

// UPLOAD DE IMAGEM COM COMPRESSÃO
async function addPhoto(e) {
    e.preventDefault();
    
    const file = document.getElementById('new-photo-file').files[0];
    const title = document.getElementById('new-photo-title').value;
    const btn = document.getElementById('add-photo-btn');

    if (!file) return alert("Selecione uma imagem!");

    try {
        btn.disabled = true;
        btn.innerText = "Enviando...";

        // 1. Criar uma referência no Storage (caminho onde a foto vai ficar)
        const storageRef = fb.ref(window.storage, 'galeria/' + Date.now() + "_" + file.name);

        // 2. Fazer o upload do arquivo
        const snapshot = await fb.uploadBytes(storageRef, file);

        // 3. Pegar a URL pública da foto
        const downloadURL = await fb.getDownloadURL(snapshot.ref);

        // 4. Salvar no Firestore
        await fb.addDoc(fb.collection(db, "portfolio"), {
            title: title || "Obra Douglas",
            img: downloadURL,
            createdAt: new Date()
        });

        alert("Foto enviada com sucesso!");
        e.target.reset();
        loadData(); // Recarrega a galeria na tela
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar imagem: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Adicionar";
    }
}

function deletePhoto(id) {
    if(confirm("Deseja apagar esta foto da galeria?")) {
        portfolio = portfolio.filter(p => p.id !== id);
        saveDataLocally();
        renderAdminData();
        renderPortfolio();
    }
}

// DRAG E DROP
let draggedItemIndex = null;

function handleDragStart(e, index) {
    draggedItemIndex = index;
    setTimeout(() => e.target.classList.add('opacity-50'), 0);
}

function handleDragOver(e) {
    e.preventDefault(); 
    const targetCard = e.target.closest('div[draggable]');
    if(targetCard) targetCard.classList.add('drag-over');
}

function handleDragLeave(e) {
    const targetCard = e.target.closest('div[draggable]');
    if(targetCard) targetCard.classList.remove('drag-over');
}

function handleDrop(e, dropTargetIndex) {
    e.preventDefault();
    const targetCard = e.target.closest('div[draggable]');
    if(targetCard) targetCard.classList.remove('drag-over');

    if (draggedItemIndex === null || draggedItemIndex === dropTargetIndex) return;

    const draggedItem = portfolio.splice(draggedItemIndex, 1)[0];
    portfolio.splice(dropTargetIndex, 0, draggedItem);

    saveDataLocally(); 
    renderAdminData();
    renderPortfolio();
    
    draggedItemIndex = null;
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
    switchPage('home'); 
});