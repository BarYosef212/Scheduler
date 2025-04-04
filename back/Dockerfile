FROM node:22.12

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx","ts-node", "server.ts"]
