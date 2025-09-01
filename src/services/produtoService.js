import database from '../repository/mysql.js';

async function createProd(nome, marca, codBarras, codEmpresa, codProduto, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade) {
    const sql = `INSERT INTO cadastro_produto (
        nome, marca, codigo_barras, empresa_id, codigo_produto, tipo_produto, modelo, categoria, data_validade, preco, estoque_min, estoque_max, imagem, quantidade
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const infoUser = [nome, marca, codBarras, codEmpresa, codProduto, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade];

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();
}

async function updateProd(nome, marca, codBarras, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade, dataExclusao, ativo, id) {
    const sql = "UPDATE cadastro_produto SET nome = ?, marca = ?, codigo_barras = ?, tipo_produto = ?, modelo = ?, categoria = ?, data_validade = ?, preco = ?, estoque_min = ?, estoque_max = ?, imagem = ?, quantidade = ?, data_exclusao = ?, ativo = ?   WHERE codigo_produto = ?";

    const infoUser = [nome, marca, codBarras, tipo, modelo, categoria, dataValidade, preco, estMin, estMax, urlUpload, quantidade, dataExclusao, ativo, id]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function updateProdRE(quantidade, id) {
    const sql = "UPDATE cadastro_produto SET quantidade = ? WHERE id = ? AND ativo = 1";

    const infoUser = [quantidade, id]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function updateProdAP(preco, id) {
    const sql = "UPDATE cadastro_produto SET preco = ? WHERE id = ? AND ativo = 1";

    const infoUser = [preco, id]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function updateProdVE(quantidadeNova, id) {
    const sql = "UPDATE cadastro_produto SET quantidade = quantidade - ? WHERE id = ? AND ativo = 1";

    const infoUser = [quantidadeNova, id]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();    
}

async function listProd() {
    const sql = "SELECT * FROM cadastro_produto WHERE ativo = 1";

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

async function listProdVali(codEmpresa) {
    const sql = `
        SELECT codigo_barras, data_validade, quantidade, imagem
        FROM cadastro_produto 
        WHERE ativo = 1 AND quantidade > 0 AND empresa_id = ?
        ORDER BY data_validade ASC
    `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}

async function listProdRE(codEmpresa) {
    const sql = `
        SELECT *
        FROM cadastro_produto 
        WHERE ativo = 1 AND empresa_id = ?
        ORDER BY quantidade ASC
    `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}

async function listProdAP(codEmpresa) {
    const sql = `
        SELECT *
        FROM cadastro_produto 
        WHERE ativo = 1 AND empresa_id = ?
        ORDER BY nome ASC
    `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}

async function listProdCP(codEmpresa) {
    const sql = `
        SELECT 
        nome,
        marca,
        codigo_barras AS codBarras,
        empresa_id,
        codigo_produto AS codProduto,
        tipo_produto,
        modelo,
        categoria,
        data_validade,
        preco,
        estoque_min,
        estoque_max,
        imagem,
        quantidade
        FROM cadastro_produto
        WHERE ativo = 1
    AND empresa_id = ?
    ORDER BY nome ASC
    `;

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, codEmpresa);
    conn.end();
    return rows;
}

async function listProdByType(codBarras, codEmpresa) {
    const sql = "SELECT * FROM cadastro_produto WHERE ativo = 1 AND codigo_barras = ? AND empresa_id = ?";

    const infoUser = [codBarras, codEmpresa]

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, infoUser);
    conn.end();
    return rows;
}

async function listProdByTypeID(id, codEmpresa) {
    const sql = "SELECT * FROM cadastro_produto WHERE ativo = 1 AND codigo_barras = ? AND empresa_id = ?";

    const infoUser = [id, codEmpresa]

    const conn = await database.connectDB();
    const [rows] = await conn.query(sql, infoUser);
    conn.end();
    return rows;
}

async function deleteProd(id, codEmpresa) {
    const sql = "UPDATE cadastro_produto SET ativo = 0, data_exclusao = current_timestamp WHERE codigo_produto = ?";

    const infoUser = [id, codEmpresa]

    const conn = await database.connectDB();
    await conn.query(sql, infoUser);
    conn.end();
}
export default {createProd, listProdRE, updateProdVE, updateProdRE, updateProdAP, listProdAP, listProdCP, updateProd, listProd, listProdByType, deleteProd, listProdVali, listProdByTypeID};