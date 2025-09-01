import database from '../repository/mysql.js';

async function createUser(nome, acesso, email, nomeUsuario, senha, telefone, whatsapp, tipo, genero, codEmpresa, codDono) {
    const sql = `INSERT INTO usuarios (
        nome_completo, acesso, email, userlogin, senha_hash,
        telefone, whatsapp, tipo, genero, empresa_id, dono_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const infoUser = [nome, acesso, email, nomeUsuario, senha, telefone, whatsapp, tipo, genero, codEmpresa, codDono];

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();
}

async function updateUser(codEmpresa, codDono) {
    const sql = "UPDATE usuarios SET empresa_id = ?  WHERE dono_id = ?";

    const infoUser = [codEmpresa, codDono]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function updateUserSenha(senha, email) {
    const sql = "UPDATE usuarios SET senha_hash = ? WHERE email = ?";

    const infoUser = [senha, email]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function listUser(codEmpresa) {
    const sql = `SELECT
                 u.id,
                 u.nome_completo,
                 u.email,
                 u.telefone,
                 u.tipo,
                 p.ativo
                 FROM
                 usuarios u
                 JOIN
                 padroes p ON p.id = u.id
                 WHERE empresa_id = ?
                 `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}
async function listUserSU(codEmpresa) {
    const sql = `SELECT senha_hash 
                 FROM usuarios 
                 WHERE ativo = 1 
                 AND empresa_id = ? 
                 AND tipo IN ('admin', 'dono', 'gerente');
                 `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}

async function listUserByType(Email) {
    const sql = "SELECT * FROM usuarios WHERE ativo = 1 AND email = ?";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, Email);
    conn.end();
    return rows;
}

async function listUserByTypeLU(loginUser) {
    const sql = "SELECT * FROM usuarios WHERE ativo = 1 AND userlogin = ?";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, loginUser);
    conn.end();
    return rows;
}

async function deleteUser(id) {
    const sql = "UPDATE usuarios SET ativo = 0, data_bloqueio = current_timestamp WHERE id = ?";

    const conn = await database.connectDB();
    await conn.query(sql, id);
    conn.end();
}
export default {createUser, updateUser, listUserSU, listUserByTypeLU, updateUserSenha, listUser, listUserByType, deleteUser};

