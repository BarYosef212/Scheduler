FROM node:22.12

WORKDIR /dist

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 443

CMD ["npm", "run", "start"]
