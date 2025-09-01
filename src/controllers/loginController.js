// import express from 'express';
// import loginService from '../services/loginService.js';

// const routes = express.Router();

// routes.post('/', async (request, response) => {
//     const {email, password} = request.body;

//     try {
//         const login = await loginService.login(email, password);
//         const {id_usuario, nome} = login[0]

//         if(login.length > 0) {
//             const token = generatedToken(id_usuario, nome)
//             return response.status(200).send({message: token});
//         } else {
//             return response.status(401).send({message: "Login Invalido"});
//         }
    
//     } catch(err) {
//         response.status(500).send({"message": `Houve um erro na requisição. ${err}`})
//     }
// });

// routes.post('/reset', async (request, response) => {
//     const {email} = request.body;

//     try {
//         const user = await loginService.checkEmail(email);
    
//         if(user.length > 0) {
//             const newPassword = generatePassword();
//             await loginService.changePassword(email, newPassword)
//             return response.status(200).send({message: `Nova senha: ${newPassword}`});
//         } else {
//             return response.status(404).send({message: "Usuário não encontrado."});
//         }
    
//     } catch(err) {
//         response.status(500).send({"message": `Houve um erro na requisição. ${err}`})
//     }

// });

// export default routes;