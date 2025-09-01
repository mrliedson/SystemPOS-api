import db from '../repository/mysql.js';

async function createPadroes(adicionarUsuario, adicionarProduto, relatorios, reporEstoque, gerenciarPermissoes, adicionarPromocao, cadastrarEmpresa, prestesAVencer, iniciarExpediente) {
    const sql = `INSERT INTO padroes (
    adicionarUsuario, adicionarProduto, relatorios, reporEstoque, 
    gerenciarPermissoes, adicionarPromocao, cadastrarEmpresa, 
    prestesAVencer, iniciarExpediente
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const infoUser = [adicionarUsuario, adicionarProduto, relatorios, reporEstoque, gerenciarPermissoes, adicionarPromocao, cadastrarEmpresa, prestesAVencer, iniciarExpediente];

    const conn = await db.connectDB();
    await conn.query(sql, infoUser);
    conn.end();
}

async function listPadroes() {
    const sql = "SELECT * FROM padroes p WHERE ativo = 1 ORDER BY p.id DESC";

    const conn = await db.connectDB();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function buscarPadraoPorId(id) {
  const sql = "SELECT * FROM padroes WHERE id = ?";
  const conn = await db.connectDB();
  const [rows] = await conn.query(sql, [id]);
  conn.end();
  return rows[0] || null;
}

async function listUserByType(Email) {
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    const conn = await db.connectDB();
    const [rows] = await conn.query(sql, Email);
    conn.end();
    return rows;
}

async function buscarPadraoPorEmail(email) {
  const sql = `SELECT p.*
               FROM usuarios u
               JOIN padroes p ON u.acesso = p.id
               WHERE u.email = ?
               `;
  const conn = await db.connectDB();
  const [rows] = await conn.query(sql, email);
  conn.end();
  return rows[0] || null;
}

async function deleteUser(id) {
    const sql = `UPDATE padroes p
                 JOIN usuarios u ON p.id = u.id
                 SET p.ativo = 0
                 WHERE u.id = ?
                 `;

    const conn = await db.connectDB();
    await conn.query(sql, id);
    conn.end();
}

async function atualizarPadrao(id, dados) {
  const campos = Object.keys(dados);
  const valores = Object.values(dados);
  
  if(campos.length === 0) {
    throw new Error('Nenhum dado para atualizar.');
  }

  const setClause = campos.map(campo => `${campo} = ?`).join(', ');
  const sql = `UPDATE padroes SET ${setClause} WHERE id = ?`;

  const conn = await db.connectDB();
  const [resultado] = await conn.query(sql, [...valores, id]);
  conn.end();

  return resultado;
}

export default {
  createPadroes,
  deleteUser,
  atualizarPadrao,
  buscarPadraoPorId,
  buscarPadraoPorEmail,
  listPadroes,
  listUserByType
};
