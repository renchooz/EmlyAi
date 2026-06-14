FROM node:22-alpine as deps

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:22-alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache

ARG GIT_SHA=unknown
RUN echo "Building server commit: ${GIT_SHA}"

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

RUN mkdir -p uploads
EXPOSE 5000


CMD ["node","src/server.js"]