FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# Копируем всё приложение
COPY . .

# Указываем переменную окружения с абсолютным путём
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Генерируем Prisma Client (в ../generated/prisma, как в schema.prisma)
RUN npx prisma generate

# Открываем порт
ENV PORT=3001
EXPOSE 3001

# Запуск
CMD ["node", "server.js"]