import database from '../repository/mysql.js';

async function createDono(cpf, data_nascimento, endereco_particular, codDono) {
    const sql = `INSERT INTO dono (
        cpf, data_nascimento, endereco_particular, id
      )
      VALUES (?, ?, ?, ?)`;

    const infoDono = [cpf, data_nascimento, endereco_particular, codDono];

    const conn = await database.connectDB();
    await conn.query(sql, infoDono);
    conn.end();
}

async function updateDono(cpf, data_nascimento, endereco_particular, ativo, codDono) {
    const sql = "UPDATE dono SET cpf = ?, data_nascimento = ?, endereco_particular = ?, ativo = ? WHERE id = ?;";

    const infoDono = [cpf, data_nascimento, endereco_particular, ativo, codDono]

    const conn = await database.connectDB();
    await conn.query(sql, infoDono);
    conn.end();    
}

async function listDono() {
    const sql = "SELECT * FROM dono WHERE ativo = 1";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function listDonoByType(id) {
    const sql = `SELECT 
    e.razao_social,
    e.cnpj,
    e.id AS e_id,
    u.email

FROM dono d
JOIN empresa e ON e.dono_id = d.id
JOIN usuarios u ON u.dono_id = d.id
WHERE u.ativo = 1 AND d.id = ?`;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, id);
    conn.end();
    return rows;
}

async function updateUserDono(codEmpresa, codDono) {
    const sql = "UPDATE usuarios SET empresa_id = ? WHERE ativo = 1 AND dono_id = ?";

    const infoUser = [codEmpresa, codDono]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function deleteDono(idDono) {
    const sql = "UPDATE dono SET ativo = 0 WHERE id = ?";

//  const sql = "DELETE FROM dono WHERE id = ?";

    const conn = await database.connectDB();
    await conn.query(sql, idDono);
    conn.end();
}
export default {createDono, updateDono, updateUserDono, listDono, listDonoByType, deleteDono};

