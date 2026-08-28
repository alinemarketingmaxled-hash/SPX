<?php
/**
 * Ícones do site: traço de 1,6, sem preenchimento, 24x24 — o mesmo desenho
 * técnico do resto das páginas. Ficam aqui porque são conteúdo, não decoração
 * de CSS. Gerado a partir de gerar.mjs.
 */

if (!defined('ABSPATH')) { exit; }

function spx_icones() {
  return [
    'visita' => '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    'proposta' => '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    'cronograma' => '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h5M7 17h8"/>',
    'art' => '<path d="M12 3 4 6v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    'relatorio' => '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    'asbuilt' => '<path d="M3 20h18M5 20V9l7-5 7 5v11"/><path d="M10 20v-6h4v6"/>',
    'corporativa' => '<path d="M3 21h18M5 21V6h9v15M14 21V10h5v11"/><path d="M8 9h3M8 13h3M8 17h3"/>',
    'varejo' => '<path d="M3 9h18l-1.4-4.2a1 1 0 0 0-1-.8H5.4a1 1 0 0 0-1 .8L3 9Z"/><path d="M5 9v11h14V9M10 20v-6h4v6"/>',
    'retrofit' => '<path d="M4 21h16M6 21V8l6-4 6 4v13"/><path d="M9 21v-5h6v5M9 11h2M13 11h2"/>',
    'reforma' => '<path d="m14.5 6.5 3 3M3 21l3.5-1 11-11-2.5-2.5-11 11L3 21Z"/><path d="M17 3.5 20.5 7"/>',
    'gerencia' => '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    'manutencao' => '<path d="M14.7 6.3a4 4 0 0 1 5 5l-9 9-5-5 9-9Z"/><path d="m5 19 2-2"/>',
    'projeto' => '<path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11M13 13h7M13 17h7"/>',
    'laudo' => '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5M9 11h4M11 9v4"/>',
    'leitura' => '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
    'compat' => '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    'orcamento' => '<path d="M12 3v18M8 7h6a2.5 2.5 0 0 1 0 5h-4a2.5 2.5 0 0 0 0 5h6"/>',
    'planejamento' => '<path d="M4 19V5M4 19h16"/><path d="M8 15h3v4H8zM13 9h3v10h-3z"/>',
    'execucao' => '<path d="M3 21h18M6 21v-8h4v8M14 21V7h4v14"/><path d="m6 13 4-4 4 4"/>',
    'acompanha' => '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    'entrega' => '<path d="M4 12.5 9 17.5 20 6.5"/>',
    'anos' => '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 1.8"/>',
    'obras' => '<path d="M3 21h18M6 21V10l6-4 6 4v11"/><path d="m4 10 8-6 8 6"/>',
    'area' => '<path d="M4 4h16v16H4z"/><path d="M4 9h5v5H4zM15 9h5M15 13h5M15 17h5"/>',
    'foco' => '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    'telefone' => '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4Z"/>',
    'email' => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
    'local' => '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/>',
    'relogio' => '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4.5"/>',
    'empresa' => '<path d="M3 21h18M5 21V4h10v17M15 21V10h4v11"/><path d="M8 8h4M8 12h4M8 16h4"/>',
    'sigilo' => '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    'conversa' => '<path d="M20 14a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/>',
  ];
}

/** Devolve o SVG de um ícone. Nome desconhecido cai no 'foco'. */
function spx_icone($nome) {
  $ic = spx_icones();
  $d = isset($ic[$nome]) ? $ic[$nome] : $ic['foco'];
  return '<svg class="ico-tec" viewBox="0 0 24 24" aria-hidden="true">' . $d . '</svg>';
}
