// controllers/relatorioController.js
import RelatorioService from '../services/relatorioService.js';

class RelatorioController {
  static async gerarRelatorio(req, res) {
    try {
      const { tipo, periodo, empresaId } = req.query;
      const dados = await RelatorioService.gerarDados(tipo, periodo, empresaId);
      res.json(dados);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  }

  static async exportarPDF(req, res) {
    try {
      const { tipo, periodo, empresaId, usuarioId } = req.query;

      // Agora aceitamos também "Clientes" e "Geral"
      if (!['Vendas','Ganhos','Gastos','Estoque','Clientes','Geral'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de relatório inválido' });
      }

      const pdfBuffer = await RelatorioService.gerarPDF(tipo, periodo, empresaId, usuarioId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${tipo}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao gerar PDF' });
    }
  }
}

export default RelatorioController;


// URL	                                                                    Legenda
// /relatorio/pdf?tipo=Vendas&periodo=Hoje&empresaId=1&usuarioId=1	        PDF com vendas realizadas hoje
// /relatorio/pdf?tipo=Vendas&periodo=Semana&empresaId=1&usuarioId=1	    PDF com vendas realizadas na última semana
// /relatorio/pdf?tipo=Vendas&periodo=Mês&empresaId=1&usuarioId=1	        PDF com vendas realizadas no último mês
// /relatorio/pdf?tipo=Vendas&periodo=Ano&empresaId=1&usuarioId=1	        PDF com vendas realizadas no último ano
// /relatorio/pdf?tipo=Ganhos&periodo=Hoje&empresaId=1&usuarioId=1	        PDF com ganhos pagos hoje
// /relatorio/pdf?tipo=Ganhos&periodo=Semana&empresaId=1&usuarioId=1	    PDF com ganhos pagos na última semana
// /relatorio/pdf?tipo=Ganhos&periodo=Mês&empresaId=1&usuarioId=1	        PDF com ganhos pagos no último mês
// /relatorio/pdf?tipo=Ganhos&periodo=Ano&empresaId=1&usuarioId=1	        PDF com ganhos pagos no último ano
// /relatorio/pdf?tipo=Gastos&periodo=Hoje&empresaId=1&usuarioId=1	        PDF com gastos registrados hoje
// /relatorio/pdf?tipo=Gastos&periodo=Semana&empresaId=1&usuarioId=1	    PDF com gastos registrados na última semana
// /relatorio/pdf?tipo=Gastos&periodo=Mês&empresaId=1&usuarioId=1	        PDF com gastos registrados no último mês
// /relatorio/pdf?tipo=Gastos&periodo=Ano&empresaId=1&usuarioId=1	        PDF com gastos registrados no último ano
// /relatorio/pdf?tipo=Estoque&periodo=Hoje&empresaId=1&usuarioId=1	        PDF com movimentações de estoque hoje
// /relatorio/pdf?tipo=Estoque&periodo=Semana&empresaId=1&usuarioId=1	    PDF com movimentações de estoque na última semana
// /relatorio/pdf?tipo=Estoque&periodo=Mês&empresaId=1&usuarioId=1	        PDF com movimentações de estoque no último mês
// /relatorio/pdf?tipo=Estoque&periodo=Ano&empresaId=1&usuarioId=1	        PDF com movimentações de estoque no último ano
// /relatorio/pdf?tipo=Clientes&periodo=Semana&empresaId=1&usuarioId=1    PDF com clientes cadastrados na última semana
// /relatorio/pdf?tipo=Clientes&periodo=Mês&empresaId=1&usuarioId=1       PDF com clientes cadastrados no último mês
// /relatorio/pdf?tipo=Clientes&periodo=Ano&empresaId=1&usuarioId=1       PDF com clientes cadastrados no último ano

// /relatorio/pdf?tipo=Geral&periodo=Hoje&empresaId=1&usuarioId=1         PDF com resumo geral de vendas, ganhos, gastos e clientes
// /relatorio/pdf?tipo=Geral&periodo=Semana&empresaId=1&usuarioId=1       PDF com resumo geral da última semana
// /relatorio/pdf?tipo=Geral&periodo=Mês&empresaId=1&usuarioId=1          PDF com resumo geral do último mês
// /relatorio/pdf?tipo=Geral&periodo=Ano&empresaId=1&usuarioId=1          PDF com resumo geral do último ano
