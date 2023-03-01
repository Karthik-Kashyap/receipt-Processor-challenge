FROM node:19.7.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
# ENV PORT 8081
# ENV NODE_ENV production
CMD [ "npm", "start" ]