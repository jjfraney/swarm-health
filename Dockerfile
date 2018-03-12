FROM node:alpine

ADD app.js healthcheck.js healthcheck.sh health.txt package.json /app/
WORKDIR /app
RUN npm install
HEALTHCHECK CMD /app/healthcheck.sh
ENTRYPOINT node /app/app.js

