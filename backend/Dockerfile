FROM node:24.22.0-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
COPY scripts/copy-sql.mjs ./scripts/copy-sql.mjs
RUN npm run build && npm prune --omit=dev

FROM node:24.22.0-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN mkdir uploads && chown node:node uploads
USER node
EXPOSE 8000
CMD ["node", "dist/server.js"]
