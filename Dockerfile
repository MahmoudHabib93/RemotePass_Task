FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default command to run tests in mock mode
CMD ["npx", "playwright", "test"]
