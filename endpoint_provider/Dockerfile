FROM ubuntu:14.04
RUN apt-get update && apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs
COPY . /src
WORKDIR /src
RUN npm install
CMD ["node", "server.js"]
