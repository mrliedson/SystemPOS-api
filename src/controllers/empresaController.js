import express from "express";
import service from "../services/empresaService.js";

const route = express.Router();

route.get("/",  async (request, response) => {
    const empresa = await service.listEmpresa();

    if(empresa.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": empresa});
});

route.get("/:cnpj",  async (request, response) => {
    const {cnpj} = request.params;
    const empresa = await service.listEmpresaByType(cnpj);

    if(empresa.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": empresa});
});

route.post("/", async (request, response) => {
    const {dono_id, razao_social, nome_fantasia, cnpj, codEmpresa, telefone, whatsapp, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep} = request.body;

    await service.createEmpresa(dono_id, razao_social, nome_fantasia, cnpj, codEmpresa, telefone, whatsapp, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep);

    return response.status(201).send({"message": "Empresa cadastrada com sucesso!"})
});


route.put('/:idEmpresa',  async (request, response) => {
    const {dono_id, razao_social, nome_fantasia, cnpj, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, data_inatividade, ativo} = request.body;
    const {idEmpresa} = request.params;

    // if(password.length <= 5) {
    //     return response.status(400).send({"message": "A senha deve conter no minimo 6 caracteres!"});
    // }

    // if(typeEmpresa.toUpperCase() != "Administrador".toUpperCase() && typeEmpresa.toUpperCase() != "Comum".toUpperCase()) {
    //     return response.status(400).send({"message": "O tipo de usuário deve ser 'Administrador' ou 'Comum'."});
    // }

    await service.updateEmpresa(dono_id, razao_social, nome_fantasia, cnpj, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado.toUpperCase(), endereco_cep, data_inatividade, ativo, idEmpresa);
    
    return response.status(200).send({"message": "Dados atualizados com sucesso"});

});


route.delete("/:idEmpresa",  async(request, response) => {
    const {idEmpresa} = request.params;

    await service.deleteEmpresa(idEmpresa);

    return response.status(200).send({"message": "Empresa excluido com sucesso"});
});
export default route;
