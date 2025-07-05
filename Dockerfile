FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG REACT_APP_BASE_URL_BACK
ARG REACT_APP_BASE_URL_FRONT

ENV REACT_APP_BASE_URL_BACK=${REACT_APP_BASE_URL_BACK}
ENV REACT_APP_BASE_URL_FRONT=${REACT_APP_BASE_URL_FRONT}

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
