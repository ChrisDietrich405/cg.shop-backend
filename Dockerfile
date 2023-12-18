FROM node:18

RUN npm install -g firebase-tools

WORKDIR /app

COPY . .

COPY firebase-credentials.json .

RUN npm install 

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-credentials.json

EXPOSE 5000 5001 9005

CMD ["firebase", "serve", "--only", "functions"]