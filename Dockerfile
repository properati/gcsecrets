FROM node:12-alpine3.10 
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
ADD index.js .
ENTRYPOINT exec node /app/index.js
