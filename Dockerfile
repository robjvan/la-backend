# Stage 1: Build the application
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY secretAccountKey.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node","dist/main.js"]
