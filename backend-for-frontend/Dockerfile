FROM node:12-alpine
WORKDIR /var/service

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY src src

RUN npm install && \
  npm run build

COPY templates dist/templates

CMD ["npm", "start"]
