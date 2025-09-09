
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies that might be needed for builds
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci --only=production --silent || npm install --silent

COPY . .

# Increase Node.js memory limit for the build
ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
