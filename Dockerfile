FROM node:12 
WORKDIR /app
ADD package.json .
ADD package-lock.json .
ADD script.sh /app/
RUN chmod +x /app/script.sh 
RUN npm install
ADD index.js .
ENTRYPOINT /app/script.sh
