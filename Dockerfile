FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build

RUN npm install -g serve

EXPOSE 8088

CMD ["serve", "-s", "build", "-l", "8088"]