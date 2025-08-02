FROM node:22.17-slim 

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
