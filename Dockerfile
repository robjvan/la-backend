# Stage 1: Build the application
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./secretAccountKey.json /usr/src/app

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node","dist/main.js"]
