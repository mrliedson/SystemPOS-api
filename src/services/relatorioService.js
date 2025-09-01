// src/services/relatorioService.js
import db from '../repository/mysql.js';
import { jsPDF } from 'jspdf';
const categoria = ''

// Função para formatar a categoria dependendo do período
function formatarCategoria(data, periodo) {
  const d = new Date(data);
  
  if (periodo === 'Semana') {
    return d.toLocaleDateString('pt-BR', { weekday: 'long' }); // segunda, terça...
  }
  if (periodo === 'Mês') {
    return d.getDate().toString(); // 1, 2, 3...
  }
  if (periodo === 'Ano') {
    return d.toLocaleDateString('pt-BR', { month: 'long' }); // janeiro, fevereiro...
  }

  // padrão
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

class RelatorioService {
  static async gerarDados(tipo, periodo, empresaId) {
    const conn = await db.connectDB();
    let query = '';
    let dias = 1;

    switch (periodo) {
      case 'Semana': dias = 7; break;
      case 'Mês': dias = 30; break;
      case 'Ano': dias = 365; break;
    }

    switch (tipo) {
      case 'Vendas':
        query = `
          SELECT DATE(data_venda) as dia, COUNT(*) as total_vendas
          FROM venda
          WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia;
        `;
        break;

      case 'Ganhos':
        query = `
          SELECT DATE(data_venda) as dia, SUM(valor_total) as total_ganhos
          FROM venda
          WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia;
        `;
        break;

      case 'Gastos':
        query = `
          SELECT DATE(data_gasto) as dia, SUM(valor) as total_gasto
          FROM gastos
          WHERE empresa_id = ? AND data_gasto >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia;
        `;
        break;

      case 'Estoque':
        query = `
          SELECT c.nome AS produto, SUM(h.quantidade) AS total_movimentado
          FROM historico_estoque h
          JOIN cadastro_produto c ON h.codigo_produto = c.id
          WHERE c.empresa_id = ? AND h.data_movimentacao >= DATE_SUB(NOW(), INTERVAL CAST(? AS SIGNED) DAY)
          GROUP BY h.codigo_produto, c.nome
          ORDER BY c.nome
        `;
        break;

      case 'Clientes':
        query = `
          SELECT DATE(data_cadastro) as dia, COUNT(*) as total_clientes
          FROM cliente
          WHERE empresa_id = ? AND data_cadastro >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia;
        `;
        break;

      case 'Geral':
        query = `
          SELECT 
            (SELECT COUNT(*) FROM venda WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY)) as total_vendas,
            (SELECT SUM(valor_total) FROM venda WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY)) as total_ganhos,
            (SELECT SUM(valor) FROM gastos WHERE empresa_id = ? AND data_gasto >= DATE_SUB(NOW(), INTERVAL ? DAY)) as total_gastos,
            (SELECT COUNT(*) FROM cliente WHERE empresa_id = ? AND data_cadastro >= DATE_SUB(NOW(), INTERVAL ? DAY)) as total_clientes
        `;
        break;
    }

    let rows;
    if (tipo === 'Estoque') {
      [rows] = await conn.execute(query, [empresaId, dias]);
    } else if (tipo === 'Geral') {
      const [geralRows] = await conn.execute(query, [
        empresaId, dias,
        empresaId, dias,
        empresaId, dias,
        empresaId, dias
      ]);

      const resumo = geralRows[0] || {};
      await conn.end();

      return {
        categorias: ['Vendas', 'Ganhos', 'Gastos', 'Clientes'],
        valores: [
          resumo.total_vendas || 0,
          resumo.total_ganhos || 0,
          resumo.total_gastos || 0,
          resumo.total_clientes || 0
        ]
      };
    } else {
      [rows] = await conn.execute(query, [empresaId, dias]);
    }

    await conn.end();

    // Formata categorias e valores
    const categorias = rows.length > 0 ? rows.map(r => {
      if (r.dia) return formatarCategoria(r.dia, periodo);
      return r.produto || 'N/D';
    }) : [];

    const valores = rows.length > 0 ? rows.map(r =>
      r.total_vendas || r.total_ganhos || r.total_gasto || r.total_movimentado || r.total_clientes
    ) : [];

    return { categorias, valores };
  }

  static async gerarPDF(tipo, periodo, empresaId, usuarioId) {
    const dados = await this.gerarDados(tipo, periodo, empresaId);

    const doc = new jsPDF();
    // Cabeçalho centralizado
    doc.setFillColor(8, 14, 53); // azul escuro #080E35
    doc.rect(0, 0, 210, 30, 'F'); // fundo
    doc.setTextColor(255, 127, 38); // laranja
    doc.setFontSize(18);
    doc.text(`Relatório de ${tipo}`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Período: ${periodo}`, 105, 28, { align: 'center' });

    let y = 45;
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);

    if (dados.valores.length === 0) {
      doc.text("Nenhum registro disponível para este período.", 105, y, { align: 'center' });
    } else {
      // Estatísticas
      const total = dados.valores.reduce((a,b)=>a+(Number(b)||0),0);
      const media = total / (dados.valores.length || 1);
      const max = Math.max(...dados.valores,0);
      const min = Math.min(...dados.valores,0);

      doc.text(`Total: ${formatValor(tipo, total)}`, 14, y); y+=8;
      doc.text(`Média: ${formatValor(tipo, media)}`, 14, y); y+=8;
      doc.text(`Máximo: ${formatValor(tipo, max)}`, 14, y); y+=8;
      doc.text(`Mínimo: ${formatValor(tipo, min)}`, 14, y); y+=8;
      doc.text(`Registros: ${dados.valores.length}`, 14, y); y+=12;

      // Cabeçalho da tabela
      doc.setFillColor(8, 14, 53); // azul escuro
      doc.rect(10, y-6, 190, 8, "F");
      doc.setTextColor(255, 127, 38); // laranja
      if (periodo === 'Semana') {
        doc.text(`Dias`, 14, y);
      }
      if (periodo === 'Mês') {
        doc.text(`Dias`, 14, y);
      }
      if (periodo === 'Ano') {
        doc.text(`Mês`, 14, y);
      }
      doc.text("Valor", 100, y);
      y+=6;

      // Linhas zebrado
      dados.categorias.forEach((cat,i)=>{
        y+=8;
        if(i%2===0){
          doc.setFillColor(255,255,255); // branco
        } else {
          doc.setFillColor(245,245,245); // cinza bem claro
        }
        doc.rect(10, y-6, 190, 8, "F");
        doc.setTextColor(0,0,0);
        doc.text(String(cat), 14, y);
        doc.text(formatValor(tipo,dados.valores[i]), 100, y);
      });
    }

    // Registrar exportação
    const conn = await db.connectDB();
    const tipoBancoMap = {
      'Vendas':'venda','Ganhos':'ganhos','Gastos':'gastos',
      'Estoque':'estoque','Clientes':'clientes','Geral':'geral'
    };
    await conn.query(
      `INSERT INTO relatorio_exportado (tipo_relatorio, usuario_id, empresa_id) VALUES (?, ?, ?)` ,
      [tipoBancoMap[tipo], usuarioId, empresaId]
    );
    await conn.end();

    return Buffer.from(doc.output('arraybuffer'));
  }
}

function formatValor(tipo, valor) {
  if(tipo==='Ganhos'||tipo==='Gastos') return `R$ ${parseFloat(valor||0).toFixed(2)}`;
  return String(valor||0);
}

export default RelatorioService;
