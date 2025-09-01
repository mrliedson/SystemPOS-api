import { getHistoricoVendas } from "../services/vendaService.js";

export const listarHistorico = async (req, res) => {
  try {
    const historico = await getHistoricoVendas();
    res.json(historico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar histórico de vendas" });
  }
};
