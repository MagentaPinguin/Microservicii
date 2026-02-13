FROM node:20-alpine
WORKDIR /faas
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8083
CMD ["npm","start"]