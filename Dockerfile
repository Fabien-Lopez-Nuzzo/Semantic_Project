FROM node:16-alpine

COPY ./semantic_web /semantic_web

WORKDIR /semantic_web

RUN npm install

RUN npm run build

CMD [ "npm", "run", "start" ]