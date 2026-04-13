async function sendEmail(e) {
    e.preventDefault();
    
    const nome = document.getElementById('email-nome').value;
    const msg = document.getElementById('email-msg').value;
    const btn = document.querySelector('#page-contact form button[type="submit"]');

    // Salva o texto original e coloca o loading
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
    btn.disabled = true;

    try {
        // Manda os dados para o código Python no Vercel
        const response = await fetch('/api/enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                msg: msg
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("E-mail enviado com sucesso! O Douglas entrará em contato em breve.");
            e.target.reset(); // Limpa o formulário
        } else {
            alert(data.mensagem);
        }
    } catch (error) {
        alert("Ocorreu um erro na conexão. Por favor, tente falar conosco pelo WhatsApp.");
        console.error(error);
    } finally {
        // Volta o botão ao normal
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
}