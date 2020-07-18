FROM node:10

RUN mkdir /src
WORKDIR /src

ADD ./package.json /src/
RUN npm install

ADD . /src

ENV NODE_PATH /src

CMD node ./server.js
