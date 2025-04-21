FROM node:22.12

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-l", "80", "dist", "--single"]
