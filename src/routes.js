import express from "express";
import userController from "./controllers/userController.js";
import empresaController from "./controllers/empresaController.js";
import donoController from "./controllers/donoController.js";
import produtoController from "./controllers/produtoController.js";
import padroesController from "./controllers/padroesController.js";
import tokenController from "./controllers/tokenController.js";
import { enviarToken, verificarToken} from './controllers/tokenController.js';
// import loginController from './controllers/loginController.js';

import RelatorioController from './controllers/relatorioController.js';
import { listarHistorico } from "./controllers/vendaController.js";




const routes = express();

routes.use("/user",  userController);
routes.use("/empresa",  empresaController);
routes.use("/dono", donoController);
routes.use("/produto", produtoController);
routes.use("/padroes", padroesController);
routes.use('/token-senha', tokenController);
routes.post('/enviar-token', enviarToken);
routes.post('/verificar-token', verificarToken);
// routes.use('/login', loginController);

routes.get('/relatorio', RelatorioController.gerarRelatorio);
routes.get('/relatorio/pdf', RelatorioController.exportarPDF);

routes.get("/historico-vendas", listarHistorico);

export default routes;
