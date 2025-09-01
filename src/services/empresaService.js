import database from '../repository/mysql.js';

async function createEmpresa(dono_id, razao_social, nome_fantasia, cnpj, codEmpresa, telefone, whatsapp, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep) {
    endereco_estado = endereco_estado.toUpperCase();
    const sql = `INSERT INTO empresa (
        dono_id, razao_social, nome_fantasia, cnpj, id, telefone, whatsapp, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const infoEmpresa = [dono_id, razao_social, nome_fantasia, cnpj, codEmpresa, telefone, whatsapp, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep];

    const conn = await database.connectDB();
    await conn.query(sql, infoEmpresa);
    conn.end();
}

async function updateEmpresa(dono_id, razao_social, nome_fantasia, cnpj, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, data_inatividade, ativo, idEmpresa) {
    const sql = "UPDATE empresa SET dono_id = ?, razao_social = ?, nome_fantasia = ?, cnpj = ?, endereco_logradouro = ?, endereco_numero = ?, endereco_complemento = ?, endereco_bairro = ?, endereco_cidade = ?, endereco_estado = ?, endereco_cep = ?, data_inatividade = ?, ativo = ? WHERE id = ?";

    const infoEmpresa = [dono_id, razao_social, nome_fantasia, cnpj, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep, data_inatividade, ativo, idEmpresa]

    const conn = await database.connectDB();
    await conn.query(sql, infoEmpresa);
    conn.end();    
}

async function listEmpresa() {
    const sql = "select * from empresa where ativo = 1";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function listEmpresaByType(cnpj) {
    const sql = "SELECT * FROM empresa WHERE ativo = 1 AND cnpj = ?";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, cnpj);
    conn.end();
    return rows;
}

async function deleteEmpresa(idEmpresa) {
    const sql = "UPDATE empresa SET ativo = 0, data_inatividade = current_timestamp WHERE id = ?";

    const conn = await database.connectDB();
    await conn.query(sql, idEmpresa);
    conn.end();
}
export default {createEmpresa, updateEmpresa, listEmpresa, listEmpresaByType, deleteEmpresa};