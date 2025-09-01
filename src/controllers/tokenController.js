import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import express from "express";
import service from "../services/userService.js";

let tokens = {}; // Armazenamento em memória

function gerarTokenNumerico() {
  return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'systempos.2025@gmail.com',
    pass: 'ryoifgesvoblutpy',
  },
  tls: {
    rejectUnauthorized: false, // ← desativa verificação do certificado
  },
});

// Função para carregar e preencher o template HTML
function getEmailTemplate(token) {
  const templatePath = path.resolve('./src/templates/redefinirSenha.html');
  const html = fs.readFileSync(templatePath, 'utf-8');
  return html.replace('{{token}}', token);
}

// Enviar token por e-mail com HTML
export const enviarToken = async (req, res) => {
  const { email } = req.body;
  const token = gerarTokenNumerico();

  tokens[email] = token;

  try {
    const htmlContent = getEmailTemplate(token);

    await transporter.sendMail({
      from: '"SystemPOS" <sytempos.2025@gmail.com>',
      to: email,
      subject: 'Seu Token de Redefinição de Senha',
      html: htmlContent,
    });

    res.status(200).json({ mensagem: 'Token enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ erro: 'Erro ao enviar o token.' });
  }
};

// Verificar token
export const verificarToken = (req, res) => {
  const { email, tokenDigitado } = req.body;

  if (tokens[email] && tokens[email].toString() === tokenDigitado.toString()) {
    delete tokens[email]; // Apaga depois de validar
    res.status(200).json({ valido: true });
  } else {
    res.status(401).json({ valido: false, erro: 'Token incorreto' });
  }
};

const route = express.Router();

route.put('/:email',  async (request, response) => {
    const {senha} = request.body;
    const {email} = request.params;

    await service.updateUserSenha(senha, email);
    
    return response.status(200).send({"message": "Senha atualizado com sucesso"});

});
export default route;