FROM node:22-alpine AS build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
ARG ICASE_AUDIT_NONCE=manual
RUN test -n "$ICASE_AUDIT_NONCE" && npm audit --omit=dev --audit-level=high
COPY backend/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm install --omit=dev
ARG ICASE_AUDIT_NONCE=manual
RUN test -n "$ICASE_AUDIT_NONCE" && npm audit --omit=dev --audit-level=high
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm","start"]
