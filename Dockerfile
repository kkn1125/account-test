FROM ubuntu:22.04

ENV NODE_VERSION=18.11.0
RUN apt-get update && apt-get install -y curl apache2
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN npm install -g npm@9.1.1
RUN node --version
RUN npm --version

COPY . .

RUN npm install vite http-server -g
RUN npm install

RUN vite build --emptyOutDir

COPY ./dist/* /var/www/html/

# EXPOSE 80

CMD [ "/usr/sbin/apache2ctl", "-DFOREGROUND"]

# ENTRYPOINT ["http-server", "--cors", "-a", "--port", "5000"]

# ENTRYPOINT ["npm", "run", "dev"]