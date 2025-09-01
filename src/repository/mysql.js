// src/database/mysql.js
import mysql from "mysql2/promise";

async function connectDB() {
    return await mysql.createConnection({
        password: "etecembu@123",
        host: "localhost",
        user: "root",
        port: 3306,
        database: "systemPos"
    });
}

export default {connectDB};
// Testar as APIs
// Abra o Postman ou Insomnia.
// Teste os endpoints:
// GET http://localhost:3333/relatorio?tipo=Vendas&periodo=Semana&empresaId=1
// GET http://localhost:3333/relatorio/pdf?tipo=Vendas&periodo=Semana&empresaId=1&usuarioId=1
// Veja se os dados são retornados corretamente ou se o PDF é baixado.