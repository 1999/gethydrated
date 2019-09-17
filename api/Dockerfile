FROM node:12-alpine
WORKDIR /var/service

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY wait-for.sh wait-for.sh
COPY src src

RUN npm install && \
  npm run build

CMD ["npm", "start"]
