FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY /src ./src

RUN npm run build

FROM gcr.io/distroless/nodejs24-debian12 AS runner

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/

EXPOSE 8080

CMD ["dist/main.js"]
