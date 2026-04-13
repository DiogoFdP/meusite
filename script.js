// --------------------------------------------------------
// 1. CONFIGURAÇÃO DO FIREBASE
// --------------------------------------------------------
const firebaseConfig = {
    apiKey: "COLE_SUA_API_KEY_AQUI",
    authDomain: "COLE_SEU_AUTH_DOMAIN_AQUI",
    projectId: "COLE_SEU_PROJECT_ID_AQUI",
    storageBucket: "COLE_SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID_AQUI",
    appId: "COLE_SEU_APP_ID_AQUI"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --------------------------------------------------------
// 2. DADOS PADRÃO (PORTFÓLIO E AVALIAÇÕES FIXAS)
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

// As 10 avaliações fixadas (Nunca mudam e não vão para o Firebase)
const fixedReviews = [
    { client: "Ivanete Bernardes", text: "Excelente profissional. Encontrei o contato do Douglas aqui na internet. Foi atencioso desde o primeiro contato. O serviço era a colocação de piso na parede da cozinha, onde tem a pia. Foi honesto e cobrou preço justo de mercado. Realizou a obra com capricho e atenção. Sempre chegando no horário ou avisando em caso de algum imprevisto. Ao final, deixou a obra limpa e organizada.", rating: 5 },
    { client: "Alef Goulart", text: "Serviço maravilhoso, impecável. Deixou a obra toda limpinha, o assentamento do piso bem nivelado e muito caprichado! Entregou antes do prazo previsto e com preço super justo. Recomendo muito o Douglas! Não há decepção com ele.", rating: 5 },
    { client: "Marianna Gomes", text: "Quero deixar aqui minha avaliação super positiva sobre o trabalho do Douglas. Ele reformou todo o meu apartamento, e a experiência foi excelente do início ao fim. O Douglas é um profissional muito competente, prestativo e sempre muito solícito. Além disso, é extremamente pontual e cumpre os prazos combinados, algo que faz toda a diferença em uma obra.", rating: 5 },
    { client: "Wanderson Araújo", text: "Serviço realizado com muita qualidade e pontualidade. Trabalho limpo e organizado. Excelente profissional.", rating: 5 },
    { client: "Bruno Donatelli", text: "Excelente profissional, trabalha muito bem, organizado e pontual com os horários. Sempre deixa o local limpo e, o mais importante, o porcelanato ficou bem nivelado e a obra foi entregue dentro do prazo. Preço justo, profissional honesto. Fica a recomendação!", rating: 5 },
    { client: "Ivan Pk", text: "Quero deixar meu feedback para o Douglas pelo excelente trabalho realizado. Um profissional extremamente competente, que executa tudo com muita qualidade e atenção aos detalhes. Além disso, mantém a obra sempre limpa e organizada, o que faz toda a diferença no dia a dia. Demonstra muito profissionalismo, responsabilidade e compromisso com o cliente. Recomendo sem dúvidas.", rating: 5 },
    { client: "Alex Sander Braz", text: "Chamei de última hora para um serviço de emergência e fui surpreendido. O Douglas fez o trabalho rápido e muito bem feito. Serviço top, recomendo demais!", rating: 5 },
    { client: "Pablo Loyola", text: "Douglas é 1000%! Podem contratar, é confiável. Faz o serviço sem receber adiantado, não pede nem um real antes, só depois que entrega tudo pronto. E o melhor: faz um excelente trabalho!", rating: 5 },
    { client: "Marcos Borba", text: "O Douglas é um excelente profissional. Comprometido com os horários e com uma programação compatível com a demanda de atividades. Recomendo.", rating: 5 },
    { client: "Juliam Fabio", text: "Profissional comprometido e pontual. Planejou e executou o serviço com perfeição. Serviço rápido e limpo.", rating: 5 }
];

let portfolio = [];
let isReviewsExpanded = false;

// Monitora o Firebase APENAS para a Galeria
db.collection("dados").doc("site").onSnapshot((doc) => {
    if (doc.exists) {
        portfolio = doc.data().portfolio || defaultPortfolio;
        renderPortfolio();
        setTimeout(initScrollAnimations, 100);
        
        if (!document.getElementById('admin-modal').classList.contains('hidden')) {
            renderAdminData();
        }
    } else {
        portfolio = defaultPortfolio;
        saveDataGlobally();
    }
});

function saveDataGlobally() {
    db.collection("dados").doc("site").set({
        portfolio: portfolio
    }).catch(error => console.error("Erro ao salvar galeria:", error));
}

// --------------------------------------------------------
// 3. NAVEGAÇÃO SPA
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
// 4. FUNÇÕES WHATSAPP
// --------------------------------------------------------
function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function sendWhatsAppForm(e) {
    e.preventDefault();
    const nome = document.getElementById('wa-nome').value;
    const msg = document.getElementById('wa-msg').value;
    const textoFinal = `Olá, Douglas! Meu nome é *${nome}*.\n\nGostaria de falar sobre o seguinte projeto:\n_${msg}_`;
    openWhatsApp(textoFinal);
    e.target.reset();
}

// --------------------------------------------------------
// 5. GALERIA E LIGHTBOX
// --------------------------------------------------------
function renderPortfolio() {
    const containerHome = document.getElementById('portfolio-grid-home');
    const amostra = portfolio.slice(0, 3);
    
    containerHome.innerHTML = amostra.map((item, index) => {
        const titleHtml = item.title ? `<h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2">${item.title}</h4>` : '';
        return `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal" style="transition-delay: ${index * 100}ms">
            <div class="gallery-img-wrapper h-64 w-full" onclick="openLightbox('${item.img}', '${item.title || ''}')">
                <img src="${item.img}" alt="Obra" class="w-full h-full object-cover">
            </div>
            ${titleHtml}
        </div>`;
    }).join('');

    const containerFull = document.getElementById('portfolio-grid-full');
    containerFull.innerHTML = portfolio.map((item) => {
        const titleHtml = item.title ? `<h4 class="font-heading font-bold text-brand-dark text-center mt-3 mb-1 text-sm md:text-base truncate px-2">${item.title}</h4>` : '';
        return `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal">
            <div class="gallery-img-wrapper w-full" onclick="openLightbox('${item.img}', '${item.title || ''}')">
                <img src="${item.img}" alt="Obra">
            </div>
            ${titleHtml}
        </div>`;
    }).join('');
}

function openLightbox(imgSrc, title) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox-caption').textContent = title || ''; 
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
});

// --------------------------------------------------------
// 6. AVALIAÇÕES FIXAS
// --------------------------------------------------------
const getStars = (rating) => {
    let stars = '';
    for(let i=1; i<=5; i++) {
        stars += `<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    return stars;
};

function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btn = document.getElementById('show-more-btn');
    
    const limit = 3;
    const reviewsToShow = isReviewsExpanded ? fixedReviews : fixedReviews.slice(0, limit);
    
    container.innerHTML = reviewsToShow.map(r => `
        <div class="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-blue relative mb-4">
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <div class="flex">${getStars(5)}</div>
            </div>
            <p class="text-gray-600 italic mt-4 text-center leading-relaxed text-sm">"${r.text}"</p>
            <p class="font-heading font-bold text-brand-dark text-center mt-6">— ${r.client}</p>
        </div>`).join('');

    document.getElementById('show-more-container').classList.remove('hidden');
    btn.textContent = isReviewsExpanded ? "Ver menos avaliações" : "Ver mais avaliações";
}

function toggleReviews() {
    isReviewsExpanded = !isReviewsExpanded;
    renderPublicReviews();
}

// --------------------------------------------------------
// 7. ADMIN E ACESSO SECRETO (Apenas Galeria)
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
        secretClickTimer = setTimeout(() => { secretClickCount = 0; }, 2000); 
    }
}

function requestAdminAccess() {
    if (prompt("Acesso Administrativo. Digite a senha:") === "Dioguinho2") {
        document.getElementById('admin-modal').classList.remove('hidden');
        renderAdminData();
    } else {
        alert("Senha incorreta.");
    }
}

function closeAdmin() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function renderAdminData() {
    const galContainer = document.getElementById('admin-gallery-list');
    galContainer.innerHTML = portfolio.map((p, index) => {
        const displayTitle = p.title ? p.title : "Sem título";
        return `
        <div draggable="true" 
             ondragstart="handleDragStart(event, ${index})" 
             ondragover="handleDragOver(event)" 
             ondragleave="handleDragLeave(event)" 
             ondrop="handleDrop(event, ${index})"
             class="bg-white p-2 rounded shadow border text-center relative group cursor-move transition-all">
            <img src="${p.img}" class="w-full h-24 object-cover rounded mb-2 pointer-events-none">
            <p class="text-xs font-bold truncate text-gray-700">${displayTitle}</p>
            
            <button onclick="editPhotoTitle(${p.id})" class="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Editar Título">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            
            <button onclick="deletePhoto(${p.id})" class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Apagar Foto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>`;
    }).join('');
}

function editPhotoTitle(id) {
    const photo = portfolio.find(p => p.id === id);
    if (!photo) return;
    const newTitle = prompt("Digite o novo título da foto (Deixe em branco para remover o título):", photo.title || "");
    if (newTitle !== null) {
        photo.title = newTitle.trim();
        saveDataGlobally();
    }
}

function addPhoto(e) {
    e.preventDefault();
    const titleInput = document.getElementById('new-photo-title').value.trim();
    const fileInput = document.getElementById('new-photo-file');
    const file = fileInput.files[0];

    if (!file) return;

    const btn = document.getElementById('add-photo-btn');
    btn.textContent = "Salvando...";
    btn.disabled = true;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

            portfolio.unshift({ 
                id: Date.now(),
                title: titleInput,
                img: compressedDataUrl
            });
            
            saveDataGlobally();
            e.target.reset();
            btn.textContent = "Adicionar";
            btn.disabled = false;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function deletePhoto(id) {
    if(confirm("Deseja apagar esta foto da galeria?")) {
        portfolio = portfolio.filter(p => p.id !== id);
        saveDataGlobally();
    }
}

let draggedItemIndex = null;
function handleDragStart(e, index) { draggedItemIndex = index; setTimeout(() => e.target.classList.add('opacity-50'), 0); }
function handleDragOver(e) { e.preventDefault(); const t = e.target.closest('div[draggable]'); if(t) t.classList.add('drag-over'); }
function handleDragLeave(e) { const t = e.target.closest('div[draggable]'); if(t) t.classList.remove('drag-over'); }
function handleDrop(e, dropTargetIndex) {
    e.preventDefault();
    const t = e.target.closest('div[draggable]');
    if(t) t.classList.remove('drag-over');
    if (draggedItemIndex === null || draggedItemIndex === dropTargetIndex) return;

    const draggedItem = portfolio.splice(draggedItemIndex, 1)[0];
    portfolio.splice(dropTargetIndex, 0, draggedItem);

    saveDataGlobally(); 
    draggedItemIndex = null;
}

// --------------------------------------------------------
// 8. ANIMAÇÕES DE SCROLL E INICIALIZAÇÃO
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
    renderPublicReviews();
    switchPage('home'); 
});