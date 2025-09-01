import express from 'express';
import routes from './routes.js';
import cors from 'cors';

const server = express();
server.use(express.json());
server.use(cors())
server.use("/", routes);

server.listen(3333, ()=> {
    console.log("Meu servidor está rodando! 🚀 ");
});