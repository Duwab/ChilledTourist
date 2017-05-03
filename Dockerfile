FROM python:2.7-slim
MAINTAINER Nick Janetakis <nick.janetakis@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential libpq-dev postgresql-client-9.4 --fix-missing --no-install-recommends

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

VOLUME ["static"]

# CMD unicorn -b 0.0.0.0:8000 "app.app:create_app()"


# De base, il n'y a rien dans le container
# D'abord, on installe la distribution et les programmes
# ici python:2.7-slim amène également debian, etc
# COPY récupère les fichiers pour les placer dans le container
# COPY <real-host-device> <virtual-docker-container>
