FROM node:18.19.1
WORKDIR /linkedin-auth
COPY . .
RUN npm ci
EXPOSE 3000
CMD ["node", "server.js" ]
