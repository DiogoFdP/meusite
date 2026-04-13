from flask import Flask, request, jsonify
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

# Configurações do E-mail
EMAIL_REMETENTE = "douglasdepaula.fr@gmail.com"
EMAIL_DESTINO = "douglasdepaula.fr@gmail.com"

# Puxa a senha das configurações seguras do Vercel
SENHA_APP = os.getenv("SENHA_GMAIL")

@app.route('/api/enviar', methods=['POST'])
def enviar_email():
    if not SENHA_APP:
        return jsonify({"mensagem": "Erro: Senha do e-mail não configurada no servidor."}), 500

    dados = request.json
    nome = dados.get('nome', 'Não informado')
    mensagem = dados.get('msg', 'Sem mensagem')

    assunto = f"Nova Solicitação de Orçamento pelo Site - {nome}"
    corpo_email = f"Nome/Empresa: {nome}\n\nDetalhes do Projeto:\n{mensagem}"

    msg = MIMEMultipart()
    msg['From'] = EMAIL_REMETENTE
    msg['To'] = EMAIL_DESTINO
    msg['Subject'] = assunto
    msg.attach(MIMEText(corpo_email, 'plain'))

    try:
        # Envia pelo Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_REMETENTE, SENHA_APP)
        server.send_message(msg)
        server.quit()
        
        return jsonify({"mensagem": "E-mail enviado com sucesso!"}), 200
    except Exception as e:
        print("Erro:", str(e))
        return jsonify({"mensagem": "Falha ao enviar o e-mail. Tente pelo WhatsApp."}), 500

# Essa linha é necessária para o Vercel entender a aplicação
def handler(request, response):
    return app(request, response)