FROM node:alpine
WORKDIR /linkedin-auth
COPY . .
RUN npm i
EXPOSE 3000
CMD ["npm", "run", "dev" ]
