ARG env
FROM mhart/alpine-node:8.12 AS base
WORKDIR /usr/src/server
# install build-essentials,
RUN apk add --no-cache --virtual build-deps alpine-sdk && \
  apk add --no-cache vips-dev fftw-dev --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ && \
  adduser -D -g 'www' www && mkdir /run/nginx && apk add --no-cache nginx && \
  mkdir /etc/nginx/sites-available && mkdir /etc/nginx/sites-enabled && \
  apk add --no-cache certbot

#prepare dev build
FROM base AS build-development
RUN npm install --global nodemon && npm install --global ts-node

#prepare prod build
FROM base AS build-production
RUN npm install --global pm2 && pm2 install typescript

#final env specific build
FROM build-${env} AS final-build
ARG env
ENV env=${env}
COPY ["package.json", "./"]
RUN npm install --$env && apk del build-deps

#copy source code
COPY . .

#final build
FROM final-build
COPY ["./default", "./nginx.conf", "./"]
RUN rm /etc/nginx/conf.d/default.conf && \
  yes | cp -rf ./nginx.conf /etc/nginx/ && cp ./default /etc/nginx/sites-available && \
  ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default && \
  apk add --no-cache certbot && mkdir /var/www/newsapi
ARG env
ENTRYPOINT [ "./run.sh" ]