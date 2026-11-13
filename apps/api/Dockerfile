FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

COPY apps/api/package.json ./
COPY apps/api/prisma ./prisma

RUN npm install --legacy-peer-deps

COPY apps/api ./

RUN npx prisma generate && npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed:js && node dist/main"]
