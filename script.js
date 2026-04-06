// Banco de Dados Simulado (LocalStorage)
let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [
    { nome: "Carlos Silva", nota: 5, comentario: "Melhor degradê que já fiz na vida!" },
    { nome: "João Pedro", nota: 5, comentario: "Sandro é um artista. Atendimento nota 10." }
];

document.addEventListener('DOMContentLoaded', () => {
    atualizarListaAvaliacoes();
    atualizarAdminTable();
    configurarDataMinima();
});

// --- FUNÇÕES DE AGENDAMENTO ---

const formAgendamento = document.getElementById('form-agendamento');
formAgendamento.addEventListener('submit', (e) => {
    e.preventDefault();

    const novoAgendamento = {
        id: Date.now(),
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value
    };

    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    alert(`Sucesso! Agendamento confirmado para ${novoAgendamento.data} às ${novoAgendamento.horario}`);
    formAgendamento.reset();
    atualizarAdminTable();
});

// --- FUNÇÕES DE AVALIAÇÃO ---

const formReview = document.getElementById('form-review');
formReview.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaReview = {
        nome: document.getElementById('rev-nome').value,
        nota: parseInt(document.getElementById('rev-nota').value),
        comentario: document.getElementById('rev-comentario').value
    };

    avaliacoes.push(novaReview);
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

    alert("Obrigado pela sua avaliação!");
    formReview.reset();
    atualizarListaAvaliacoes();
});

function atualizarListaAvaliacoes() {
    const container = document.getElementById('lista-avaliacoes');
    container.innerHTML = '';

    // Filtra apenas as 5 estrelas conforme solicitado
    const reviewsCincoEstrelas = avaliacoes.filter(rev => rev.nota === 5);

    reviewsCincoEstrelas.forEach(rev => {
        container.innerHTML += `
            <div class="review-card">
                <div class="stars" style="color: #FFD700; margin-bottom: 10px;">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p>"${rev.comentario}"</p>
                <h4 style="margin-top: 15px;">- ${rev.nome}</h4>
            </div>
        `;
    });
}

// --- ÁREA ADMINISTRATIVA ---

function toggleAdmin() {
    const panel = document.getElementById('admin-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function atualizarAdminTable() {
    const tbody = document.getElementById('lista-admin-agendamentos');
    tbody.innerHTML = '';

    agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data)).forEach(ag => {
        tbody.innerHTML += `
            <tr>
                <td>${formatarData(ag.data)}</td>
                <td>${ag.horario}</td>
                <td>${ag.nome}</td>
                <td>${ag.telefone}</td>
                <td>
                    <button class="btn-cancel" onclick="cancelarAgendamento(${ag.id})">
                        <i class="fas fa-trash"></i> Cancelar
                    </button>
                </td>
            </tr>
        `;
    });
}

function cancelarAgendamento(id) {
    const agendamento = agendamentos.find(a => a.id === id);
    const motivo = prompt("Motivo do cancelamento:");
    
    if (motivo !== null) {
        // Remove do array
        agendamentos = agendamentos.filter(a => a.id !== id);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        // Formata mensagem para WhatsApp
        const mensagem = `Olá ${agendamento.nome}, seu agendamento para o dia ${formatarData(agendamento.data)} às ${agendamento.horario} foi CANCELADO. Motivo: ${motivo}`;
        const urlZap = `https://wa.me/55${agendamento.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(urlZap, '_blank');
        atualizarAdminTable();
    }
}

// Auxiliares
function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

function configurarDataMinima() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);
}