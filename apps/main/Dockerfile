# Stage 1: Build the application
FROM node:22 AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN --mount=type=secret,id=github_token \
    bash -c '\
        export GITHUB_TOKEN="$(cat /run/secrets/github_token)" && \
        echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc && \
        npm install --legacy-peer-deps \
    '

COPY . .

# Cache key = ENVIRONMENT + IMAGE_TAG
# prod and staging never share cache
# Every new commit busts this layer automatically
ARG ENVIRONMENT
ARG IMAGE_TAG
RUN --mount=type=secret,id=env \
    bash -c '\
        echo "Building ${ENVIRONMENT} - ${IMAGE_TAG}" && \
        cat /run/secrets/env > .env && \
        npm run build && \
        rm .env \
    '

# Stage 2: Final runtime image
FROM node:22-alpine AS runtime

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built application from build stage
COPY --from=build --chown=appuser:appgroup /app/.next/static ./.next/static

COPY --from=build --chown=appuser:appgroup /app/.next/standalone ./

COPY --from=build --chown=appuser:appgroup /app/public ./public

# Add permissions after copying
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set the port environment variable
ENV PORT=40293

# Expose port
EXPOSE 40293

CMD ["node", "server.js"]