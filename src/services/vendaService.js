import db from '../repository/mysql.js';

export const getHistoricoVendas = async (empresaId) => {
  const connection = await db.connectDB();
  const [vendas] = await connection.query(`
    SELECT v.id AS venda_id, v.data_venda, v.valor_total,
           c.nome_completo AS nomeCliente, c.cpf,
           COUNT(iv.id) AS totalItens
    FROM venda v
    JOIN cliente c ON c.id = v.usuario_id
    JOIN item_venda iv ON iv.venda_id = v.id
    WHERE v.empresa_id = ?   -- filtro por empresa
    GROUP BY v.id, v.data_venda, c.nome_completo, c.cpf
    ORDER BY v.data_venda DESC
  `, [empresaId]);

  connection.end();

  const historico = {};
  vendas.forEach(v => {
    const data = v.data_venda.toISOString().split("T")[0];
    if (!historico[data]) historico[data] = [];
    historico[data].push({
      vendaId: v.venda_id,
      nomeCliente: v.nomeCliente,
      cpf: v.cpf,
      totalItens: v.totalItens,
      valorTotal: v.valor_total
    });
  });

  return historico;
};

