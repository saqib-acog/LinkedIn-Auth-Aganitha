FROM node:alpine
WORKDIR /linkedin-auth
COPY . .
RUN npm ci
EXPOSE 3000
CMD ["node", "server.js" ]
