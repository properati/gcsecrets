FROM node:12 
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm install
ADD index.js .
ADD script.sh .
RUN chmod +x /app/script.sh 
ENTRYPOINT ["/app/script.sh"]
