FROM node:18

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --force

RUN npm run build

EXPOSE 8080
CMD ["node", "index.js"]
