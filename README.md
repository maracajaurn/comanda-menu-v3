# 🍽️ Comanda Menu - Frontend

Aplicação **React** desenvolvida para gerenciar comandas e pedidos em bares e restaurantes de pequeno porte. Esta interface se comunica com uma API Express para autenticação, controle de produtos, pedidos e notificações em tempo real.

---

## 📦 Sobre o Projeto

- Interface web para bares e restaurantes de pequeno porte.
- Desenvolvido com React.js e estilizado com Tailwind CSS.
- Navegação fluida com React Router DOM.
- Suporte a múltiplos perfis de acesso (Admin, Garçom, Cozinha, Cliente).
- Comunicação com a API via Axios e autenticação com JWT.
- Atualizações em tempo real com Socket.IO.
- Integração com Mercado Pago para pagamentos online.
- Experiência do cliente otimizada para dispositivos móveis.

---

## 🧪 Tecnologias Utilizadas

- **React 18**
- **React Router DOM v6**
- **Tailwind CSS** (estilização)
- **Axios** (requisições HTTP)
- **Socket.io Client** (comunicação em tempo real)
- **Firebase Cloud Messaging** (notificações push)
- **React Hot Toast** (feedback de ações)
- **HTML2Canvas** (captura de tela para impressão ou download)

## 👷‍♂️ Configuração do Ambiente
1. Clone este repositório:
```bash
git clone https://github.com/JackSSads/comanda-menu-v3
```

2. Navegue até o diretório do projeto:
```bash
cd comanda-menu-v3
```

3. Instale as dependências:
```bash
npm install
```

4. Crie um arquivo `.env` 
```bash
REACT_APP_BASE_URL_BACK=http://localhost:3001
REACT_APP_BASE_URL_FRONT=http://localhost:3000
REACT_APP_NODE_ENV=development
REACT_APP_VAPID_KEY_PUBLICA=
REACT_APP_FAVICON_URL=
```

5. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 📁 Estrutura de Pastas
```
src/
├── components/
    ├── calc/index.jsx
    ├── cardCheck/index.jsx
    ├── cardProduct/index.jsx
    ├── cardProductPreparation/index.jsx
    ├── categories/index.jsx
    ├── check/index.jsx
    ├── clnput/index.jsx
    ├── filter/index.jsx
    ├── footer/index.jsx
    ├── listinProductsForCheck/index.jsx
    ├── loader/index.jsx
    ├── loadingItem/index.jsx
    ├── managerUser/index.jsx
    ├── modalProduct/index.jsx
    ├── modalUser/index.jsx
    ├── navbar/index.jsx
    ├── newCheck/index.jsx
    ├── settings/index.jsx
    ├── sidebar/index.jsx
    └── index.js
├── contexts/
    ├── LoaderContext.jsx
    ├── ToggleSidebar.jsx
    ├── ToggleViewNote.jsx
    └── index.js 
├── hooks/
    ├── ConnectionMonitor.js
    ├── Notifications.js
    ├── UseAlert.js
    ├── UseDebounce.js
    ├── UseFCM.js
    ├── UseSocketEvents.js
    ├── UseVerifyIfClientId.js
├── layouts/
    └── index.js 
├── libs/
    └── icons.js 
├── pages/
    ├── admin/index.jsx
    ├── clientMenu/index.jsx
    ├── closeCheck/index.jsx
    ├── closedChecks/index.jsx
    ├── error/
        ├── 401.jsx
        ├── 404.jsx
        └── index.js 
    ├── firstAccess/index.jsx
    ├── home0/index.jsx
    ├── listingChecks/index.jsx
    ├── listingProducts/index.jsx
    ├── login/index.jsx
    ├── manageUser/index.jsx
    ├── onlineOrders/index.jsx
    ├── preparation/
        ├── bartender.jsx
        └── cuisine.jsx
    ├── salesHistory/index.jsx
    ├── showEditProducts/index.jsx
    ├── waiter/index.jsx
    └── index.js
├── routes/index.jsx
├── service/
    ├── axiosConfig/index.js
    ├── cashier/CashierService.js
    ├── category/CategoryService.js
    ├── check/CheckService.js
    ├── login/LoginService.js
    ├── logout/LogoutService.js
    ├── notification/NotificationService.js
    ├── order/OrderService.js
    ├── payment/PaymentService.js
    ├── product/ProductService.js
    ├── setting/SettingService.js
    ├── socket/SocketService.js
    └── user/UserService.js
├── App.jsx
├── firebase.js
├── index.css
└── index.jsx
```

### 📡 Endpoints Principais

| Rota                                          | Acesso  | Descrição                             |
| --------------------------------------------- | ------- | ------------------------------------- |
| `/`                                           | Público | Página inicial                        |
| `/login`                                      | Público | Tela de login                         |
| `/first_access`                               | Público | Primeiro acesso / cadastro inicial    |
| `/401`                                        | Público | Página de não autorizado              |
| `/usuarios`                                   | Admin   | Gerenciamento de usuários             |
| `/sales_history`                              | Admin   | Histórico de vendas                   |
| `/comandasFinalizadas`                        | Admin   | Comandas encerradas                   |
| `/produtos`                                   | Admin   | Edição de produtos                    |
| `/:user_id/admin`                             | Admin   | Painel do administrador               |
| `/:user_id/garcom/comandas`                   | Garçom  | Lista de comandas                     |
| `/:user_id/garcom/comanda/:id`                | Garçom  | Visualizar comanda                    |
| `/:user_id/garcom/comanda/:id/add-product`    | Garçom  | Adicionar produtos à comanda          |
| `/:user_id/garcom/comanda/:id/fechar-comanda` | Garçom  | Finalizar comanda                     |
| `/:user_id/cozinha/producao`                  | Cozinha | Tela de produção de pedidos (cozinha) |
| `/:user_id/barmen/producao`                   | Barman  | Tela de produção de pedidos (bar)     |
| `/register_client`                            | Público | Registro de nova comanda pelo cliente |
| `/:id/products`                               | Cliente | Cardápio do cliente                   |
| `/:id/cart`                                   | Cliente | Carrinho do cliente                   |
| `/:id/to-pay`                                 | Cliente | Tela de pagamento                     |
| `/:id/payment_approved`                       | Cliente | Confirmação de pagamento aprovado     |
| `/:id/payment_failure`                        | Cliente | Falha no pagamento                    |
| `/:id/wait_for_product`                       | Cliente | Aguardando preparo do pedido          |
| `/:id/created_online`                         | Cliente | Resumo do pedido online criado        |
| `*`                                           | Público | Página 404 - Não encontrado           |


### 🔐 Autenticação
A autenticação é baseada em JWT. Os tokens são gerados no login e devem ser enviados via `Authorization: Bearer <token>` nas rotas protegidas.

### 🧾 Pagamentos
Integração com Mercado Pago para gerar links de pagamento e receber notificações de retorno via webhook.

### 📲 Notificações Push 
- Usa o Firebase Cloud Messaging.
- Cada usuário pode registrar um `notify_id` para receber alertas personalizados.

### 🧑‍💻 Autor
[Jackson Souza da Silva](https://github.com/JackSSads)

## Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

[API do projeto](https://github.com/JackSSads/comanda-api-v3)
