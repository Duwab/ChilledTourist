FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Zouhir Chahoud <zouhir@zouhir.org>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install
RUN npm install -g sequelize-cli
RUN npm install -g pg

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

# start command as per package.json
CMD ["npm", "run", "dev"]
# CMD ["npm", "start"]
