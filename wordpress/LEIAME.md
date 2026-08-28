# Site da SPX Engenharia no WordPress

Esta pasta tem o site inteiro convertido em tema do WordPress. São 19 páginas,
o formulário de visita técnica, os dados estruturados e um painel de edição —
tudo sem depender de nenhum plugin.

---

## Instalar

**1. Contrate uma hospedagem com WordPress.** Qualquer uma que ofereça PHP 7.4
ou mais novo serve.

**2. Envie a pasta do tema.** Copie `spx-tema` inteira para
`wp-content/themes/` do seu site. Pelo painel: **Aparência → Temas → Adicionar
novo → Enviar tema** (compacte a pasta em .zip antes).

**3. Ative.** Em **Aparência → Temas**, ative "SPX Engenharia".

Na ativação o tema cria sozinho as dez páginas com os endereços certos, os oito
serviços, define a home e ajusta os links permanentes. Você não precisa criar
nada à mão — e não deve: um endereço digitado errado quebra o menu e a URL que
o Google já conhece.

**4. Confira os links permanentes.** Em **Configurações → Links permanentes**,
deixe em "Nome do post" e salve uma vez. Isso é o que faz `/servicos/retrofit`
funcionar em vez de `/?p=42`.

**5. Ajuste o endereço do site.** Em **Configurações → Geral**, o "Endereço do
site" precisa ser o domínio oficial, com `https://` e sem barra no fim. É de
lá que sai a tag canônica de todas as páginas.

---

## Editar o conteúdo

Menu **SPX**, na barra lateral do painel:

| Tela | O que dá para mudar |
|---|---|
| **Empresa** | Nome, telefone, WhatsApp, e-mail, CNPJ, razão social, endereço, horário, Instagram, LinkedIn e os dois textos que o site repete em toda página |
| **Responsável** | Nome, formação e resumo do engenheiro |
| **Serviços** | Os oito tipos de obra e tudo o que aparece em cada página deles |
| **Dúvidas** | As perguntas e respostas da página `/duvidas` |
| **Solicitações** | Tudo o que chegou pelo formulário |
| **O que falta** | A lista de informações que ainda não foram confirmadas |

**Campo em branco significa "não mexi".** O texto que já está no ar continua
valendo. Isso evita o acidente mais comum: apagar sem querer um texto do site
ao salvar um formulário.

### Sobre a tela "O que falta"

O site **não publica informação que ninguém confirmou**. Não há CNPJ inventado,
não há endereço chutado, não há número de obra estimado. Onde falta o dado, o
bloco inteiro deixa de aparecer — e a tela "O que falta" lista o que está de
fora e por quê.

O item mais importante hoje é o **nome completo do engenheiro responsável**.
Enquanto ele estiver em branco, o site não publica a seção do responsável nem
declara a autoridade técnica nos dados estruturados. Não é limitação técnica: é
que "engenheiro responsável" sem nome não vale nada nem para o Google nem para
quem vai contratar.

---

## Domínio: canônica e redirecionamento

São duas coisas diferentes.

**A tag canônica** já existe em todas as páginas e cada uma aponta para si
mesma. Essa é a forma correta. Canônica fixa mandando o site inteiro para a
home é um erro caro: tira todas as páginas internas do índice do Google,
porque cada uma passa a declarar que a versão boa dela é outra.

O tema também remove a canônica que o próprio WordPress publica — duas
canônicas na mesma página fazem o Google ignorar as duas.

**O redirecionamento 301** resolve o caso de o mesmo site responder em mais de
um endereço: com e sem `www`, dois domínios, o endereço da hospedagem junto do
domínio próprio. Sem ele o Google vê duas cópias do site e divide a autoridade
entre elas.

O tema já redireciona sozinho (`inc/dominio.php`): quem chegar por um host que
não seja o oficial é mandado para o oficial, com 301, mantendo o caminho. Para
ficar mais rápido, cole também o trecho de `spx-tema/htaccess-exemplo.txt` no
`.htaccess` da hospedagem — assim o redirect acontece no servidor e nem chega a
rodar PHP.

> 301 e não 302. O 302 diz ao Google que a mudança é temporária, e ele mantém o
> endereço antigo no índice.

---

## Formulário de visita técnica

Funciona assim que o tema é ativado, sem configurar nada e sem plugin.

1. A solicitação é **gravada no banco antes** de o e-mail ser enviado. Se o
   servidor de e-mail estiver fora do ar, o contato fica registrado em
   **SPX → Solicitações** em vez de sumir.
2. O e-mail vai para o endereço configurado em **SPX → Empresa**.
3. Se o envio falhar, a página oferece WhatsApp e e-mail já preenchidos com o
   que a pessoa digitou.

Proteções: campo isca contra robô, verificação de origem do envio e teto de
cinco envios por hora por IP. Sem captcha — quem só quer marcar uma visita não
deveria ter que provar que é humano.

---

## O que muda em relação ao site estático

**O que continua igual:** o desenho inteiro, todas as 19 páginas, os dados
estruturados, o formulário, o comportamento no celular.

**O que fica diferente:**

- O site passa a ter banco de dados, painel de login e atualizações. Isso é o
  que dá a edição pelo painel, e é também o que precisa de manutenção: cada
  atualização do WordPress tem que ser aplicada.
- Fica mais lento. Não muito, porque o tema não carrega plugin nenhum, mas PHP
  gerando página a cada visita é mais lento que arquivo pronto.
- Passa a ter superfície de ataque: login, banco, atualizações. Site estático
  não tem o que invadir.
- Passa a ter custo de hospedagem.

**O que exige atenção:** manter o WordPress atualizado, usar senha forte no
login e fazer backup. Nenhuma dessas três coisas era necessária antes.

---

## Arquivos

```
spx-tema/
├── functions.php          liga tudo, carrega CSS e JavaScript
├── header.php             <head>, menu e a abertura com foto
├── footer.php             rodapé e botão do WhatsApp
├── front-page.php         home
├── page.php               despacha cada endereço para paginas/
├── 404.php                página de erro
├── single-spx_servico.php página de cada tipo de serviço
├── single-spx_projeto.php página de cada obra
├── paginas/               uma por endereço fixo do site
├── inc/
│   ├── dados.php          todo o conteúdo do site
│   ├── ajuda.php          leitura dos dados e imagens responsivas
│   ├── componentes.php    blocos de página
│   ├── componentes-2.php  blocos que dependem de dados editáveis
│   ├── arte.php           prédio, mapa e faixa da marca
│   ├── icones.php         os ícones em SVG
│   ├── schema.php         dados estruturados
│   ├── dominio.php        canônica e redirect 301
│   ├── formulario.php     recebimento do formulário
│   ├── admin.php          o painel SPX
│   └── instalar.php       o que roda ao ativar o tema
├── assets/                CSS, JavaScript e fontes
├── img/                   as fotos e a logo
└── htaccess-exemplo.txt   redirect 301 no servidor
```

`inc/dados.php` é gerado a partir de `conteudo/dados.mjs`, na raiz do
repositório. Não edite esse arquivo à mão: use o painel.
