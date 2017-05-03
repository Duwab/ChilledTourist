
# react 14.4 app

FROM node:7.9
MAINTAINER Antoine Duwab <antoine.duwab@gmail.com>

ENV NODE_ENV production
ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package.json package.json
RUN npm install
# RUN npm install --unsafe-perm  # See https://github.com/npm/npm/issues/2984

COPY . $INSTALL_PATH
# RUN npm run build # not necessary in dev mode, but could be used later
# RUN rm -rf .git # dockerignore

EXPOSE 3000

# CMD ["npm", "start"]

# docker build -t test/backoffice .
# docker run -p 3000:3000 <image_id>
