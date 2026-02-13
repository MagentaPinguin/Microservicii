FROM node:20-alpine
WORKDIR /post
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
EXPOSE 8082
CMD ["npm","start"]