// --------------------------------------------------------
// 1. DADOS (Mock)
// --------------------------------------------------------
const PHONE_NUMBER = "5527992255770";

const portfolio = [
    { id: 1, title: "Bancada em Porcelanato", img: "img/bancada.jpg" },
    { id: 2, title: "Revestimento Banheiro", img: "img/banheiro.jpg" },
    { id: 3, title: "Porcelanato Grandes Formatos", img: "img/sala.jpg" },
    { id: 4, title: "Nicho", img: "img/nicho.jpg" },
    { id: 5, title: "Cozinha Americana (Meia Esquadria)", img: "img/cozinha.jpg" },
    { id: 6, title: "Piso Amadeirado", img: "img/amadeirado.jpg" }
];

let reviews = [
    { 
        id: 1, 
        client: "Ivanete Bernardes", 
        text: "Excelente profissional. Encontrei o contato do Douglas pela internet e fui muito bem atendida desde o primeiro momento. O serviço consistia na colocação de pisos na parede da cozinha, na área da pia. Foi honesto e cobrou um preço justo de mercado. Realizou o trabalho com muito capricho e atenção. Sempre pontual, avisando em caso de imprevistos. Ao final, deixou tudo limpo e organizado.", 
        rating: 5 
    },
    { 
        id: 2, 
        client: "Alef Goulart", 
        text: "Serviço maravilhoso e impecável. Deixou a obra completamente limpa, com o assentamento do piso bem nivelado e feito com muito capricho. Entregou antes do prazo previsto e com um preço justo. Recomendo muito o Douglas. Não há decepção com ele.", 
        rating: 5 
    },
    { 
        id: 3, 
        client: "Wanderson Araujo", 
        text: "Serviço realizado com muita qualidade e dentro do prazo. Trabalho limpo, organizado e bem executado. Excelente profissional.", 
        rating: 5 
    },
    { 
        id: 4, 
        client: "Alexsander Braz", 
        text: "Precisei de um serviço de última hora e fui surpreendido positivamente. O Douglas realizou o trabalho com rapidez e muita qualidade. Serviço excelente, recomendo demais!", 
        rating: 5 
    },
    { 
        id: 5, 
        client: "Pablo Loyola", 
        text: "O Douglas é um profissional extremamente confiável. Realiza o serviço sem exigir pagamento adiantado e só cobra após a conclusão do trabalho. Além disso, entrega um excelente resultado. Podem contratar sem medo.", 
        rating: 5 
    },
    { 
        id: 6, 
        client: "Marianna Gomes", 
        text: "Gostaria de deixar minha avaliação super positiva sobre o trabalho do Douglas. Ele reformou todo o meu apartamento e a experiência foi excelente do início ao fim. É um profissional muito competente, prestativo e sempre muito solícito. Além disso, é extremamente pontual e cumpre todos os prazos combinados, o que faz toda a diferença em uma obra.", 
        rating: 5 
    }
];

// Estado de visualização das avaliações públicas
let isReviewsExpanded = false;

// --------------------------------------------------------
// 2. FUNÇÕES GERAIS E RENDERIZAÇÃO
// --------------------------------------------------------

// WHATSAPP
function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Estrelas HTML
const getStars = (rating) => {
    let stars = '';
    for(let i=1; i<=5; i++) {
        stars += `<svg class="w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
    return stars;
};

// Renderizar Portfólio
function renderPortfolio() {
    const container = document.getElementById('portfolio-grid');
    container.innerHTML = portfolio.map((item, index) => `
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-2 scroll-reveal" style="transition-delay: ${index * 100}ms">
            <div class="gallery-img-wrapper h-64 w-full">
                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <h4 class="font-heading font-bold text-brand-dark text-center mt-4 mb-2">${item.title}</h4>
        </div>
    `).join('');
}

// Lógica de Renderizar as Avaliações com LIMITADOR DE 6
function renderPublicReviews() {
    const container = document.getElementById('reviews-container');
    const btnContainer = document.getElementById('show-more-container');
    const btn = document.getElementById('show-more-btn');
    
    // Pega SOMENTE as nota 5
    const topReviews = reviews.filter(r => r.rating === 5);
    
    // Limita a 6 caso não esteja expandido
    const limit = 6;
    const reviewsToShow = isReviewsExpanded ? topReviews : topReviews.slice(0, limit);
    
    container.innerHTML = reviewsToShow.map((r, index) => `
        <div class="bg-white p-8 rounded-2xl shadow-md border-t-4 border-brand-blue relative" style="transition-delay: ${(index % limit) * 50}ms">
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <div class="flex">${getStars(r.rating)}</div>
            </div>
            <p class="text-gray-600 italic mt-4 text-center leading-relaxed">"${r.text}"</p>
            <p class="font-heading font-bold text-brand-dark text-center mt-6">— ${r.client}</p>
        </div>
    `).join('');

    // Verifica se precisa mostrar o botão
    if (topReviews.length > limit) {
        btnContainer.classList.remove('hidden');
        if (isReviewsExpanded) {
            btn.innerHTML = `Ver menos avaliações <svg class="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
        } else {
            btn.innerHTML = `Ver mais avaliações <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
        }
    } else {
        btnContainer.classList.add('hidden');
    }
}

// Botão que expande/recolhe a lista
function toggleReviews() {
    isReviewsExpanded = !isReviewsExpanded;
    renderPublicReviews();
}

// --------------------------------------------------------
// 3. SISTEMA DE SUBMISSÃO DE AVALIAÇÃO
// --------------------------------------------------------
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
    const name = document.getElementById('review-name').value;
    const text = document.getElementById('review-text').value;
    const rating = parseInt(document.getElementById('review-rating').value);

    // Adiciona a nova avaliação no início
    reviews.unshift({ id: Date.now(), client: name, text: text, rating: rating });

    e.target.reset();
    document.getElementById('review-rating').value = 5;
    initStarSelector();

    alert("Avaliação enviada com sucesso! Muito obrigado pelo feedback.");
    
    // Atualiza a interface
    renderPublicReviews();
    renderAdminReviews();
}

// --------------------------------------------------------
// 4. ADMIN OCULTO (Shift + L)
// --------------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        const pwd = prompt("Acesso Administrativo. Digite a senha:");
        if (pwd === "admin123") {
            openAdmin();
        } else if (pwd !== null) {
            alert("Senha incorreta.");
        }
    }
});

function openAdmin() {
    document.getElementById('admin-modal').classList.remove('hidden');
    renderAdminReviews();
}

function closeAdmin() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function deleteReview(id) {
    if(confirm("Deseja realmente apagar esta avaliação do banco de dados?")) {
        reviews = reviews.filter(r => r.id !== id);
        renderAdminReviews();
        renderPublicReviews(); 
    }
}

function renderAdminReviews() {
    const container = document.getElementById('admin-reviews-list');
    if (reviews.length === 0) {
        container.innerHTML = "<p class='text-gray-500'>Nenhuma avaliação no sistema.</p>";
        return;
    }

    container.innerHTML = reviews.map(r => `
        <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 ${r.rating === 5 ? 'border-green-500' : (r.rating >= 3 ? 'border-yellow-400' : 'border-red-500')} flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex-1">
                <div class="flex items-center gap-3">
                    <p class="font-bold text-gray-800">${r.client}</p>
                    <div class="flex">${getStars(r.rating)}</div>
                    <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">(Nota: ${r.rating})</span>
                </div>
                <p class="text-gray-600 text-sm mt-2">"${r.text}"</p>
            </div>
            <button onclick="deleteReview(${r.id})" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded shrink-0 font-semibold transition-colors">
                Apagar
            </button>
        </div>
    `).join('');
}

document.getElementById('admin-modal').addEventListener('click', (e) => {
    if (e.target.id === 'admin-modal') closeAdmin();
});

// --------------------------------------------------------
// 5. ANIMAÇÕES DE SCROLL
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

    reveals.forEach(element => {
        observer.observe(element);
    });
}

// --------------------------------------------------------
// 6. INICIALIZAÇÃO
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    renderPortfolio();
    renderPublicReviews();
    initStarSelector();
    setTimeout(initScrollAnimations, 100);
});