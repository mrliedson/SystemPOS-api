import express from "express";
import service from "../services/produtoService.js";
import multer from "multer";
import cloudinary from "../helpers/cloudinary.js";
import fs from "fs";

const route = express.Router();

const upload = multer({ dest: "./src/upload/" });

route.get("/:codEmpresa",  async (request, response) => {
  const {codEmpresa} = request.params;
    const produtos = await service.listProdVali(codEmpresa);

    if(produtos.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": produtos});
});

route.get("/RE/:codEmpresa",  async (request, response) => {
  const {codEmpresa} = request.params;
    const produtos = await service.listProdRE(codEmpresa);

    if(produtos.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": produtos});
});

route.get("/AP/:codEmpresa",  async (request, response) => {
  const {codEmpresa} = request.params;
    const produtos = await service.listProdAP(codEmpresa);

    if(produtos.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": produtos});
});

route.get("/CP/:codEmpresa",  async (request, response) => {
  const {codEmpresa} = request.params;
    const produtos = await service.listProdCP(codEmpresa);

    if(produtos.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": produtos});
});

route.get("/DD/:codBarras",  async (request, response) => {
    const {codBarras} = request.params;
    const { codEmpresa } = request.query;
    const produtos = await service.listProdByType(codBarras, codEmpresa);

    if(produtos.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": produtos});
});

route.post("/", upload.single('img'), async (request, response) => {
    const {nome, marca, codBarras, codEmpresa, codProduto, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, quantidade} = request.body;

    try {
        const result = await cloudinary.uploader.upload(request.file.path);
        const urlUpload = result.secure_url;

      await service.createProd(nome, marca, codBarras, codEmpresa, codProduto, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade);
      fs.unlinkSync(request.file.path);
      return response.status(201).send({"message": "Produto cadastrado com sucesso!", url: urlUpload});
    } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Erro de chave duplicada
      response.status(409).json({ message: 'Produto já existe' })
    } else {
      console.error(error)
      response.status(500).json({ message: 'Erro interno do servidor' })
    }
  }
});


route.put('/:id',  async (request, response) => {
    const {nome, marca, codBarras, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade, dataExclusao, ativo} = request.body;
    const {id} = request.params;

    await service.updateProd(nome, marca, codBarras, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade, dataExclusao, ativo, id);
    
    return response.status(200).send({"message": "Dados atualizados com sucesso"});

});

route.put('/RE/:id',  async (request, response) => {
  const {id} = request.params;
  const {quantidade} = request.body;

  await service.updateProdRE(quantidade, id);
  
  return response.status(200).send({"message": "Dados atualizados com sucesso"});

});

route.put('/AP/:id',  async (request, response) => {
  const {id} = request.params;
  const {preco} = request.body;

  await service.updateProdAP(preco, id);
  
  return response.status(200).send({"message": "Dados atualizados com sucesso"});

});

route.put('/VE/:id',  async (request, response) => {
  const {id} = request.params;
  const {quantidadeNova} = request.body;

  await service.updateProdVE(quantidadeNova, id);
  
  return response.status(200).send({"message": "Dados atualizados com sucesso"});

});

route.delete("/:id",  async(request, response) => {
    const {id} = request.params;
    await service.deleteProd(id);

    return response.status(200).send({"message": "Produto excluido com sucesso"});
});
export default route;