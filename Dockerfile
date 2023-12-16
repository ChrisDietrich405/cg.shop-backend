FROM node:18

RUN npm install -g firebase-tools

WORKDIR /app

COPY . .

COPY firebase-credentials.json .

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-credentials.json



CMD ["firebase", "serve", "--only", "functions"]