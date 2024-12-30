# Projeto React

Aplicação React desenvolvida para gerenciar comandas e pedidos de bares e restaurantes de pequeno porte. Abaixo está a estrutura do projeto e uma descrição de cada componente e serviço.

## Dependências do projeto
    • React
    • Axios
    • Tailwindcss
    • Socket.io Client

## Configuração do Ambiente

1. Clone este repositório:
    ```bash
    git clone https://github.com/JackSSads/comanda-v2.git
    ```

2. Navegue até o diretório do projeto:
    ```bash
    cd comanda-v2
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Crie um arquivo `.env` 

```bash
    REACT_APP_BASE_NAME_SISTEM = 'nome do seu estabelecimento'
    REACT_APP_BASE_URL_BACK = 'url_base_da_api'
```

5. Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
### Caso queira criar uma imagem Docker desse projeto:

1. Criando imagem Docker
   ```bash
   docker build -t <nome_para_a_imagem>
   ```

2. Iniciando o container
   ```bash
   docker run -p <porta_do_host>:<porta_do_container> <nome_da_imagem>
   ```
    Use a flag `-d` para executar o container em background.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### [Link da api do projeto](https://github.com/JackSSads/comanda-api-v2)
