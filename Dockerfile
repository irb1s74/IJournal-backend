FROM node:10 AS builder
WORKDIR /app
COPY ./package.json ./
RUN yarn install --ignore-engines
COPY . .
RUN yarn build



FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
CMD ["yarn", "start:prod"]