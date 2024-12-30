# Use uma imagem do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o arquivo de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o código da aplicação
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Instala o pacote `serve` globalmente para servir o build
RUN npm install -g serve

# Expõe a porta que será usada pelo `serve`
EXPOSE 3000

# Comando para iniciar o servidor `serve`
CMD ["serve", "-s", "build", "-l", "3000"]
