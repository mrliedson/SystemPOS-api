import padroesService from '../services/padroesService.js';
import userService from '../services/userService.js';
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const padroes = await padroesService.listPadroes();
    if(padroes.length < 1) {
      return res.status(204).end();
    }
    return res.status(200).json(padroes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar padrões' });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const padrao = await padroesService.buscarPadraoPorId(id);
    if (!padrao) {
      return res.status(404).json({ erro: 'Padrão não encontrado.' });
    }
    res.status(200).json(padrao);
  } catch (err) {
    console.error('Erro ao buscar padrão:', err);
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.get("/:Email",  async (request, response) => {
    const {Email} = request.params;
    const users = await userService.listUserByType(Email);


    if(users.length < 1) {
        response.status(404).json({ erro: 'Usuário não encontrado' });
    }
    return response.status(200).send({"message": users});
});

router.get("/email/:email",  async (request, response) => {
    const {email} = request.params;
    const users = await padroesService.buscarPadraoPorEmail(email);


    if(users.length < 1) {
        response.status(404).json({ erro: 'Usuário não encontrado' });
    }
    return response.status(200).send({"message": users});
});

router.post("/", async (request, response) => {
    const {adicionarUsuario, adicionarProduto, relatorios, reporEstoque, gerenciarPermissoes, adicionarPromocao, cadastrarEmpresa, prestesAVencer, iniciarExpediente} = request.body;

    await padroesService.createPadroes(adicionarUsuario, adicionarProduto, relatorios, reporEstoque, gerenciarPermissoes, adicionarPromocao, cadastrarEmpresa, prestesAVencer, iniciarExpediente);

    return response.status(201).send({"message": "Usuário cadastrado com sucesso!"})
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const dados = req.body;

  try {
    const resultado = await padroesService.atualizarPadrao(id, dados);
    if(resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Padrão não encontrado.' });
    }
    res.status(200).json({ mensagem: 'Atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar padrão' });
  }
});

router.delete("/:id",  async(request, response) => {
    const {id} = request.params;
    await padroesService.deleteUser(id);

    return response.status(200).send({"message": "Usuário excluido com sucesso"});
});

export default router;
