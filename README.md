<h1>Hortfruit Online: Marketplace</h1>

<h2>Descrição do projeto</h2>

<p>O Marketplace Local, denominado Hortfruit Online, é uma plataforma digital desenvolvida com o propósito de conectar empreendedores locais do ramo de alimentos, especificamente frutas, verduras e legumes, aos consumidores da região. Sua finalidade é promover o comércio justo e sustentável, incentivando a compra de produtos frescos diretamente de produtores locais, reduzindo intermediários e fortalecendo a economia regional.

O público-alvo do Hortfruit Online são os empreendedores locais que atuam na produção e venda de alimentos frescos, como agricultores familiares, pequenos produtores rurais e comerciantes de hortifrútis. Além disso, o marketplace também visa atender aos consumidores da região que buscam produtos frescos, de qualidade e com origem conhecida.</p>

As funcionalidades principais do Hortfruit Online incluem:

- Cadastro de Produtores: Os empreendedores locais podem se cadastrar na plataforma e criar seus perfis, incluindo informações sobre os produtos que oferecem, suas práticas agrícolas e métodos de produção.

- Catálogo de Produtos: Os produtos disponíveis para venda são listados em um catálogo online, onde os consumidores podem navegar, pesquisar e filtrar por categoria, preço e origem.

- Carrinho de Compras: Os consumidores podem adicionar produtos ao carrinho de compras e realizar pedidos online, escolhendo entre opções de entrega ou retirada em pontos específicos.

- Avaliações e Comentários: Os consumidores podem deixar avaliações e comentários sobre os produtos e os produtores, ajudando outros usuários a tomarem decisões de compra mais informadas.

- Sistema de Pagamento: O Hortfruit Online oferece um sistema de pagamento seguro, permitindo que os consumidores efetuem transações online de forma conveniente e confiável.

<h2>Layout</h2>
<div>
<img src="https://github.com/user-attachments/assets/fc64bb2e-fc0c-4a85-a96e-e2a7d65e5a5f" alt="hortfruit-online: Página Principal">
</div>
<h2>As tecnologias utilizadas</h2>

 - HTML
 - CSS
 - JavaScript 
-  Node.js 
 - MySQL 
-  Express.js
<h2>Instalação de Pré-requisitos e Dependências</h2>
<h3>Pré-requisitos</h3>
<ul>
<li>Node.js e npm (Node Package Manager) instalados. Você pode baixá-los <a href="https://nodejs.org/">aqui</a>.</li>
<li>MySQL instalado e em execução. Para instalação, veja as instruções <a href="https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/">aqui</a>.</li>
<li>Conta no MercadoPago para integração de pagamento, se necessário.</li>
</ul>
<h3>Instruções de Instalação</h3
 <ol>
<li>Clone o repositório do projeto:</li>
  
```bash
git clone https://github.com/Yeil-sr/Hortfruit-Online.git
```
<li>Navegue até o diretório do projeto:</li>

```bash
  cd Hortfruit-Online
```
<li>Instale as dependências do projeto:</li>

```bash
npm install
```
<li>Crie um arquivo `.env` na raiz do projeto e configure suas variáveis de ambiente conforme necessário. Exemplo:</li>

```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=sua-senha
DB_NAME=hortfruit
SESSION_SECRET=sua-chave-secreta
```
<li>Inicialize o servidor:</li>

```bash
npm start
```
<h2>API Endpoints</h2>
<h3>Usuário</h3>
<ul>
  <p><code>GET /user</code> - Retorna todos os usuários.</p>
  <p><code>GET /user/:id</code> - Retorna um usuário pelo ID.</p>
  <p><code>GET /user/email/:email</code> - Retorna um usuário pelo email.</p>
  <p><code>POST /</code> - Cria um novo usuário.</p>
  <p><code>POST /login</code> - Autentica um usuário.</p>
  <p><code>POST /logout</code> - Faz o logout do usuário.</p>
  <p><code>POST /recuperar-senha</code> - Inicia o processo de recuperação de senha.</p>
  <p><code>POST /redefinir-senha</code> - Redefine a senha do usuário.</p>
</ul>
<h3>Cliente</h3>
<ul>
  <p><code>POST /</code> - Cria um novo cliente. (Autenticado)</li>
  <p><code>PUT /:id</code> - Atualiza um cliente pelo ID. (Autenticado)</p>
  <p><code>DELETE /:id</code> - Deleta um cliente pelo ID. (Autenticado)</p>
  <p><code>GET /partials/cliente:partial</code> - Serve as partials da view de cliente.</p>
  <p><code>GET /</code> - Retorna a página de cliente.</p>
</ul>
<h3>Fornecedor</h3>
<ul>
  <p><code>POST /</code> - Cria um novo fornecedor. (Autenticado)</p>
  <p><code>GET /:id</code> - Retorna um fornecedor pelo ID. (Autenticado)</p>
  <p><code>PUT /:id</code> - Atualiza um fornecedor pelo ID. (Autenticado)</p>
  <p><code>DELETE /</code> - Deleta um fornecedor. (Autenticado)</p>
  <p><code>GET /</code> - Retorna a página de fornecedor. (Autenticado)</p>
  <p><code>GET /partials/fornecedor:partial</code> - Serve as partials da view de fornecedor. (Autenticado)</p>
</ul>
<h3>Endereço</h3>
<ul>
  <p><code>POST /</code> - Cria um novo endereço.</p>
  <p><code>GET /:id</code> - Retorna um endereço pelo ID.</p>
  <p><code>PUT /:id</code> - Atualiza um endereço pelo ID.</p>
  <p><code>DELETE /:id</code> - Deleta um endereço pelo ID.</p>
</ul>
<h3>Carrinho</h3>
<ul>
  <p><code>POST /add</code> - Adiciona um item ao carrinho.</p>
  <p><code>PUT /update</code> - Atualiza um item no carrinho.</p>
  <p><code>GET /total/:userId</code> - Calcula o total do carrinho de um usuário.</p>
  <p><code>POST /total/:userId</code> - Calcula o total do carrinho de um usuário.</p>
  <p><code>DELETE /clear/:userId</code> - Limpa o carrinho de um usuário.</p>
</ul>
<h3>Produto</h3>
<ul>
  <p><code>GET /</code> - Retorna todos os produtos.</p>
  <p><code>GET /fornecedor/:fornecedor_id</code> - Retorna produtos por fornecedor. (Autenticado)</p>
  <p><code>GET /editar/:id</code> - Retorna a página de edição de produto pelo ID. (Autenticado)</p>
  <p><code>GET /:id/</code> - Retorna um produto pelo ID. (Autenticado)</p>
  <p><code>GET /imagem/produto/:id</code> - Retorna a imagem de um produto pelo ID.</p>
  <p><code>POST /</code> - Adiciona um novo produto. (Autenticado, com upload de imagem)</p>
  <p><code>PUT /:id</code> - Atualiza um produto pelo ID. (Autenticado, com upload de imagem)</p>
  <p><code>DELETE /:id</code> - Deleta um produto pelo ID. (Autenticado)</p>
</ul>
<h3>Pagamento</h3>
<ul>
  <p><code>POST /criar-pix</code> - Cria um pagamento PIX.</p>
  <p><code>POST /processar</code> - Processa um pagamento.</p>
  <p><code>DELETE /cancelar/:pagamentoId</code> - Cancela um pagamento pelo ID.</p>
</ul>
<h3>Pedido</h3>
<ul>
  <p><code>POST /create</code> - Cria um novo pedido. (Autenticado)</p>
  <p><code>PUT /atualizar/:pedidoId</code> - Atualiza um pedido pelo ID. (Autenticado)</p>
  <p><code>DELETE /cancelar/:pedidoId</code> - Cancela um pedido pelo ID. (Autenticado)</p>
</ul>


  <h2> Licença </h2>
<p>Este projeto é disponibilizado apenas para visualização e inspiração. Não é permitida a modificação do código-fonte.</p>
   <h2>Autor</h2>

  <h3>Yale da Silva Souza</h3>
 Linkedin:
https://www.linkedin.com/in/yale-souza/
<br>
 e-mail: 
<a href="#!">yalesouzatwd@gmail.com</a>
