FROM node:20-alpine
WORKDIR /auth
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8081
CMD ["npm","start"]