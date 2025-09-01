// src/services/relatorioService.js
import db from '../repository/mysql.js';
import { jsPDF } from 'jspdf';

class RelatorioService {
  static async gerarDados(tipo, periodo, empresaId) {
    const conn = await db.connectDB();
    let query = '';
    let dias = 1;

    switch (periodo) {
      case 'Semana': dias = 7; break;
      case 'Mês': dias = 30; break;
      case 'Ano': dias = 365; break;
      default: dias = 1;
    }

    switch (tipo) {
      case 'Vendas':
        query = `
          SELECT DATE(data_venda) as dia, COUNT(*) as total_vendas
          FROM venda
          WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia`;
        break;

      case 'Ganhos':
        query = `
          SELECT DATE(data_venda) as dia, SUM(valor_total) as total_ganhos
          FROM venda
          WHERE empresa_id = ? AND data_venda >= DATE_SUB(NOW(), INTERVAL ? DAY) AND status='pago'
          GROUP BY dia
          ORDER BY dia`;
        break;

      case 'Gastos':
        query = `
          SELECT DATE(data_gasto) as dia, SUM(valor) as total_gasto
          FROM gastos
          WHERE empresa_id = ? AND data_gasto >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY dia
          ORDER BY dia`;
        break;

      case 'Estoque':
        query = `
          SELECT c.nome as produto, SUM(h.quantidade) as total_movimentado
          FROM historico_estoque h
          JOIN cadastro_produto c ON h.codigo_produto = c.id
          WHERE c.empresa_id = ? AND h.data_movimentacao >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY h.codigo_produto`;
        break;

      default:
        throw new Error('Tipo de relatório inválido');
    }

    const [rows] = await conn.execute(query, [empresaId, dias]);
    await conn.end();

    const categorias = rows.map(r => r.dia ? r.dia.toISOString().split('T')[0] : r.produto);
    const valores = rows.map(r => r.total_vendas || r.total_ganhos || r.total_gasto || r.total_movimentado);

    return { categorias, valores };
  }

  // ========== GERAR PDF ==========
  static async gerarPDF(tipo, periodo, empresaId, usuarioId) {
  const dados = await this.gerarDados(tipo, periodo, empresaId);
  const doc = new jsPDF('p', 'mm', 'a4');

  const pageHeight = doc.internal.pageSize.height;
  const marginTop = 20;
  const marginLeft = 15;
  const rowHeight = 8;

  const formatValor = (valor) => {
    const num = Number(valor);
    if (isNaN(num)) return String(valor || "0");

    if (['Vendas', 'Ganhos', 'Gastos'].includes(tipo)) {
      return `R$ ${num.toFixed(2).replace('.', ',')}`;
    }
    return String(num);
  };

  // Cabeçalho do Relatório
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 204);
  doc.text(`Relatório de ${tipo}`, 105, marginTop, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(50);
  doc.text(`Período: ${periodo} | Empresa ID: ${empresaId}`, 105, marginTop + 8, { align: 'center' });

  if (!dados.categorias.length) {
    // Sem dados
    doc.setFontSize(16);
    doc.setTextColor(150);
    doc.text("Não há dados disponíveis para este relatório.", 105, 100, { align: 'center' });
  } else {
    // Cabeçalho da tabela
    let startY = marginTop + 20;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFillColor(200, 200, 200);
    doc.rect(10, startY, 190, rowHeight, 'F');
    doc.text('Categoria', marginLeft, startY + 6);
    doc.text('Valor', 150, startY + 6);
    startY += rowHeight;

    let total = 0, min = Infinity, max = -Infinity;

    dados.categorias.forEach((cat, i) => {
      const valor = dados.valores[i];
      total += valor;
      if (valor < min) min = valor;
      if (valor > max) max = valor;

      if (startY + rowHeight > pageHeight - 20) {
        doc.addPage();
        startY = marginTop + 20;
      }

      doc.setFillColor(i % 2 === 0 ? 240 : 255);
      doc.rect(10, startY, 190, rowHeight, 'F');

      doc.setTextColor(0);
      doc.text(cat.toString(), marginLeft, startY + 6);
      doc.text(formatValor(valor), 150, startY + 6);

      startY += rowHeight;
    });

    const media = total / dados.valores.length || 0;

    if (startY + 50 > pageHeight - 20) {
      doc.addPage();
      startY = marginTop;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text('Estatísticas:', marginLeft, startY + 10);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total: ${formatValor(total)}`, marginLeft, startY + 20);
    doc.text(`Média: ${formatValor(media)}`, marginLeft, startY + 30);
    doc.text(`Máximo: ${formatValor(max)}`, marginLeft, startY + 40);
    doc.text(`Mínimo: ${formatValor(min)}`, marginLeft, startY + 50);
    doc.text(`Registros: ${dados.categorias.length}`, marginLeft, startY + 60);
  }

  // Salvar log no banco
  const conn = await db.connectDB();
  const tipoBancoMap = { Vendas: 'venda', Ganhos: 'ganhos', Gastos: 'gastos', Estoque: 'estoque' };
  await conn.execute(
    'INSERT INTO relatorio_exportado (usuario_id, tipo_relatorio) VALUES (?, ?)',
    [usuarioId, tipoBancoMap[tipo]]
  );
  await conn.end();

  return Buffer.from(doc.output('arraybuffer'));
}

}

export default RelatorioService;
