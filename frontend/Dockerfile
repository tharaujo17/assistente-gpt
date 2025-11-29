# Stage 1: Builder
# Usamos Node alpine (versão leve) para construir o projeto
FROM node:20 AS builder

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package.json package-lock.json ./

# Instala as dependências (npm ci é mais rápido e seguro para builds automatizados)
RUN npm ci

# Copia o resto do código fonte
COPY . .

# Executa o build do Vite (Isso cria a pasta /dist com os arquivos otimizados)
RUN npm run build

# Stage 2: Final
# Usamos Nginx Alpine para servir os arquivos estáticos (Muito leve)
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove a página padrão do Nginx
RUN rm -rf ./*

# Copia os arquivos estáticos gerados no Stage 1 (builder) para a pasta do Nginx
COPY --from=builder /app/dist .

# Expõe a porta 80 (Porta padrão para servidor web)
EXPOSE 80

# Inicia o Nginx em primeiro plano
ENTRYPOINT ["nginx", "-g", "daemon off;"]