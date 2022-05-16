FROM node:15.13-alpine
WORKDIR /order-service
ADD package*.json ./
RUN npm install
ADD . .
CMD ["npm", "start"]