import express from "express";
import service from "../services/userService.js";

const route = express.Router();

route.get("/LU/:codEmpresa",  async (request, response) => {
    const {codEmpresa} = request.params;
    const users = await service.listUser(codEmpresa);

    if(users.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": users});
});

route.get("/SU/:codEmpresa",  async (request, response) => {
    const {codEmpresa} = request.params;
    const users = await service.listUserSU(codEmpresa);

    if(users.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({"message": users});
});

route.get("/:Email",  async (request, response) => {
    const {Email} = request.params;
    const users = await service.listUserByType(Email);


    if(users.length < 1) {
        response.status(404).json({ erro: 'Usuário não encontrado' });
    }
    return response.status(200).send({"message": users});
});

route.get("/nameUser/:loginUser",  async (request, response) => {
    const {loginUser} = request.params;
    const users = await service.listUserByTypeLU(loginUser);


    if(users.length < 1) {
        response.status(404).json({ erro: 'Usuário não encontrado' });
    }
    return response.status(200).send({"message": users});
});

route.post("/", async (request, response) => {
    const {nome, acesso, email, nomeUsuario, senha, telefone, whatsapp, tipo, genero, codEmpresa, codDono} = request.body;

    await service.createUser(nome, acesso, email, nomeUsuario, senha, telefone, whatsapp, tipo, genero, codEmpresa, codDono);

    return response.status(201).send({"message": "Usuário cadastrado com sucesso!"})
});


route.put('/:codDono',  async (request, response) => {
    const {codEmpresa} = request.body;
    const {codDono} = request.params;

    // if(password.length <= 5) {
    //     return response.status(400).send({"message": "A senha deve conter no minimo 6 caracteres!"});
    // }

    // if(typeUser.toUpperCase() != "Administrador".toUpperCase() && typeUser.toUpperCase() != "Comum".toUpperCase()) {
    //     return response.status(400).send({"message": "O tipo de usuário deve ser 'Administrador' ou 'Comum'."});
    // }

    await service.updateUser(codEmpresa, codDono);
    
    return response.status(200).send({"message": "Dados atualizados com sucesso"});

});

route.delete("/:id",  async(request, response) => {
    const {id} = request.params;
    await service.deleteUser(id);

    return response.status(200).send({"message": "Usuário excluido com sucesso"});
});
export default route;