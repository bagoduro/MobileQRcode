import { useState } from 'react';
import Scanner from '../components/Scanner';
import { Loading, EmptyState, Alert } from '../components/Feedback';
import { SectionCard, ListRow } from '../components/ui';
import { apiPost } from '../lib/api';
import { formatValor } from '../lib/format';

export default function LeitorTab() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [nota, setNota] = useState(null);

  async function consultarNota(targetUrl) {
    setLoading(true);
    setError(null);
    setInfoMsg(null);
    setNota(null);
    try {
      const data = await apiPost('/consulta-qrcode', { url: targetUrl });
      setNota(data);
    } catch (err) {
      if (err.message && err.message.includes('já registrada')) {
        setInfoMsg('Essa nota já foi registrada anteriormente.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleScanResult(decoded, scanError) {
    if (scanError) {
      setError(scanError);
      return;
    }
    setUrl(decoded);
    consultarNota(decoded);
  }

  function handleConsultarClick() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Cole o link da nota fiscal ou escaneie o QR code.');
      return;
    }
    consultarNota(trimmed);
  }

  return (
    <section className="panel active">
      <SectionCard icon="ti-scan" tone="leitor" title="Escanear cupom fiscal">
        <Scanner onResult={handleScanResult} />

        <div className="field">
          <label htmlFor="input-url">Ou cole o link da nota (URL do QR code)</label>
          <div className="input-row">
            <input
              type="text"
              id="input-url"
              placeholder="https://portalsped.fazenda.mg.gov.br/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConsultarClick(); }}
            />
            <button className="btn primary" onClick={handleConsultarClick}>
              <i className="ti ti-search" aria-hidden="true" /> Consultar
            </button>
          </div>
        </div>

        <div className="result-area">
          {loading && <Loading text="Nota registrada! Os itens estão sendo consolidados..." />}
          {!loading && error && <Alert tone="danger">{error}</Alert>}
          {!loading && infoMsg && <Alert tone="info">{infoMsg}</Alert>}
          {!loading && nota && <NotaResult nota={nota} />}
        </div>
      </SectionCard>
    </section>
  );
}

function NotaResult({ nota }) {
  const itens = nota.itens || [];
  return (
    <>
      <SectionCard
        icon="ti-building-store"
        tone="leitor"
        title={nota.emitente?.nome || 'Estabelecimento'}
        subtitle={`CNPJ: ${nota.emitente?.cnpj || '-'} • ${nota.emitente?.uf || ''}`}
        className="section-card--soft"
      >
        {itens.length === 0 ? (
          <EmptyState icon="ti-package-off" text="Nenhum item identificado" />
        ) : (
          <div className="list-stack">
            {itens.map((item, idx) => (
              <ListRow
                key={idx}
                tone="leitor"
                title={item.descricao || 'Item'}
                meta={`Cód: ${item.codigo || '-'} • Qtd: ${item.quantidade || '-'} ${item.unidade || ''}`}
                value={formatValor(item.valor_total)}
              />
            ))}
          </div>
        )}

        <div className="receipt-summary">
          <div className="row"><span>Data</span><span>{nota.nota?.data_emissao || '-'}</span></div>
          <div className="row"><span>Qtde de itens</span><span>{nota.totais?.quantidade_total_itens || '-'}</span></div>
          <div className="row"><span>Forma de pagamento</span><span>{nota.totais?.forma_pagamento || '-'}</span></div>
          <div className="row total"><span>Valor pago</span><span>{formatValor(nota.totais?.valor_pago)}</span></div>
        </div>
      </SectionCard>
      <Alert tone="success">Nota registrada com sucesso no seu histórico.</Alert>
    </>
  );
}
