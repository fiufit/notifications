FROM node:19-alpine as base

WORKDIR /usr/fiufit/notifications
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
RUN npm run build
CMD npm run start
