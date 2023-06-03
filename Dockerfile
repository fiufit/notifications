FROM node:19-alpine as base

WORKDIR /usr/fiufit/notifications
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run start
