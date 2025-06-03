# Projeto React

Aplicação React desenvolvida para gerenciar comandas e pedidos de bares e restaurantes de pequeno porte. Abaixo está a estrutura do projeto e uma descrição de cada componente e serviço.

## Dependências do projeto
    • React
    • Axios
    • Tailwindcss
    • Socket.io Client
    • Firebase Cloud Messaging

## Configuração do Ambiente

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
REACT_APP_BASE_URL_BACK=
REACT_APP_BASE_URL_FRONT=
REACT_APP_NODE_ENV=
REACT_APP_VAPID_KEY_PUBLICA=
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

### [Link da api do projeto](https://github.com/JackSSads/comanda-api-v3)


## Extra:

se quiser gerar um sertificado para testar a aplicação em produção, pode usar o seguinte comando:

Instalar o chocolatey:

::cmd
```bash
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

:: Powershell
```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Instalar o mkcert:

```bash
choco install mkcert
```

Gerar o certificado:

```bash
mkcert -install
mkcert localhost
```

Isso vai gerar dois arquivos:

localhost.pem (certificado)
localhost-key.pem (chave)

Coloque esses arquivos na raiz do seu projeto.

Atualize o .env:
```bash
HTTPS=true
SSL_CRT_FILE=./localhost.pem
SSL_KEY_FILE=./localhost-key.pem
```

Rode o app normalmente:

```bash
npm run start
```