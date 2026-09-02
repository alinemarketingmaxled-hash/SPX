<?php
/**
 * Para arquitetos: /para-arquitetos
 */

if (!defined('ABSPATH')) { exit; }

$perguntas = [
  ['A SPX executa projeto desenvolvido por outro arquiteto?',
   'Sim. A SPX lê, compatibiliza e executa projeto de terceiros, devolvendo as divergências ao '
   . 'autor do projeto antes do início da obra.'],
  ['Vocês alteram o meu projeto?',
   'Não sem falar com você. Quando alguma solução não é construtível ou conflita com norma, a '
   . 'alternativa é proposta ao autor do projeto, que decide.'],
  ['O escritório continua acompanhando a obra?',
   'Sim. A visita do autor é bem-vinda em qualquer etapa, e o relatório semanal mantém o '
   . 'acompanhamento entre uma visita e outra.'],
  ['Vocês indicam a SPX para o meu cliente ou eu contrato?',
   'As duas formas funcionam: a SPX pode ser contratada pelo cliente final com o escritório '
   . 'coordenando o projeto, ou diretamente pelo escritório.'],
];

$spx = [
  'title'     => 'Execução de projeto para arquitetos | SPX Engenharia',
  'descricao' => 'A SPX executa o projeto do arquiteto: leitura, compatibilização, orçamento '
    . 'discriminado, planejamento, execução e acompanhamento, em São Paulo e região.',
  'h1'        => 'Você cria o projeto. A SPX cuida da execução.',
  /* A foto vira o fundo da primeira tela e o texto encurta: cabeçalho é para
     dizer o que é e abrir caminho, não para explicar tudo. A pergunta continua
     sendo um h2 com a resposta na primeira frase — é o que o Google recorta em
     destaque — e os três fatos que estavam aqui não sumiram da página: a
     compatibilização está no fluxo do projeto e a proposta discriminada, nos
     cartões logo abaixo. */
  'fundo'      => 'mesa-vista-sp',
  'fundoCheio' => true,
  'topoExtra'  => '
    <h2 class="topo-pergunta">A SPX executa projeto de outro arquiteto?</h2>
    <p class="lead topo-lead">Sim. A SPX lê, compatibiliza e executa projeto de terceiros em
    São Paulo e região, e devolve as divergências ao autor antes de a equipe subir.</p>
    <p class="topo-acoes"><a class="btn btn-acc" href="' . esc_url(home_url('/contato')) . '">Falar com a SPX sobre um projeto&nbsp;↗</a></p>',
  'visual'    => 'pag-arquitetos',
  'trilha'    => [['nome' => 'Início', 'url' => '/'], ['nome' => 'Para arquitetos', 'url' => '/para-arquitetos']],
  /* o FAQPage do schema leva as duas perguntas que o Google mostra em
     destaque; a lista visível abaixo é maior */
  'schema'    => [spx_schema_perguntas([
    ['A SPX executa projeto desenvolvido por outro arquiteto?',
     'Sim. A SPX lê, compatibiliza e executa projeto de terceiros, devolvendo as divergências '
     . 'ao autor do projeto antes do início da obra.'],
    ['O arquiteto continua acompanhando a obra?',
     'Sim. O acompanhamento do autor do projeto é bem-vindo e a comunicação é direta com a '
     . 'engenharia da obra.'],
  ])],
];
spx_cabecalho($spx);

echo '
<section class="sec wrap cc-secao" data-reveal>
  <h2>O que a SPX executa <em>lá dentro</em></h2>
  <p class="sub-secao">Escolha o tipo de ambiente e abra os alfinetes: em cada pavimento está
  o que costuma decidir a obra, e não o que fica bonito na apresentação.</p>
  ' . spx_casa_corte(spx('ambientes')) . '
</section>';

echo spx_secao('O que a SPX faz com o seu projeto', spx_fluxo_serpente([
  ['icone' => 'leitura', 'n' => '01', 'nome' => 'Leitura',
   'texto' => 'Estudo do projeto e das intenções de detalhe, para entender o que não pode ser negociado no acabamento.'],
  ['icone' => 'compat', 'n' => '02', 'nome' => 'Compatibilização',
   'texto' => 'Cruzamento com estrutura, elétrica, hidráulica, climatização e incêndio. As divergências voltam para você antes de virarem improviso em campo.'],
  ['icone' => 'orcamento', 'n' => '03', 'nome' => 'Orçamento',
   'texto' => 'Proposta discriminada por serviço, com quantidade e critério de medição, então dá para comparar linha a linha.'],
  ['icone' => 'planejamento', 'n' => '04', 'nome' => 'Planejamento',
   'texto' => 'Cronograma físico-financeiro com o caminho crítico identificado e as entregas de fornecedor amarradas.'],
  ['icone' => 'execucao', 'n' => '05', 'nome' => 'Execução',
   'texto' => 'Equipe coordenada pela mesma engenharia que orçou, com responsável técnico nomeado.'],
  ['icone' => 'acompanha', 'n' => '06', 'nome' => 'Acompanhamento',
   'texto' => 'Visita do autor do projeto sempre bem-vinda, com relatório semanal e registro fotográfico entre uma visita e outra.'],
  ['icone' => 'entrega', 'n' => '07', 'nome' => 'Entrega',
   'texto' => 'Vistoria conjunta, pendências fechadas e as built do que foi construído.'],
]), 'claro');

echo spx_secao('O que muda para o escritório', spx_cartoes_icone([
  ['icone' => 'conversa', 'titulo' => 'Interlocução única', 'texto' => 'Em obra, em vez de coordenar cinco fornecedores.'],
  ['icone' => 'compat', 'titulo' => 'Divergência identificada', 'texto' => 'No papel, não na parede levantada.'],
  ['icone' => 'orcamento', 'titulo' => 'Orçamento que defende você', 'texto' => 'Item por item, alinhado com o cliente.'],
  ['icone' => 'projeto', 'titulo' => 'O detalhe desenhado', 'texto' => 'Chega até a entrega, porque tem engenheiro conferindo.'],
  ['icone' => 'art', 'titulo' => 'Responsabilidade técnica', 'texto' => 'Da execução, é da SPX.'],
], 3, spx_cartao_chamada('Precisa de agilidade e segurança no projeto?',
  'Fale com um engenheiro da SPX sobre o seu.', 'Falar com a SPX')));

echo spx_secao('Dúvidas de quem projeta',
  spx_perguntas($perguntas) .
  spx_cartao_chamada('Ainda tem dúvida?', 'Fale diretamente com um engenheiro da SPX.',
    'Enviar pergunta', '/contato', 'conversa'), 'claro');

get_footer();
