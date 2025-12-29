# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci

# Copy source code and config files
COPY . .

# Generate Drizzle migrations
RUN npm run db:generate

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy drizzle migrations
COPY --from=builder /app/drizzle ./drizzle

# Copy drizzle config (needed for migrations)
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Copy environment example
COPY .env.example .env

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 3031

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3031/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the app
CMD ["node", "dist/server.js"]