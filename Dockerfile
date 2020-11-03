FROM node:12 
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
ADD index.js .
CMD [ "sh", "-c", "node index.js" ]

