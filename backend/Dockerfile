FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app/
EXPOSE 5001
CMD ["node", "index.js"]