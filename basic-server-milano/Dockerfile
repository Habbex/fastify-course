FROM node:16.17.0

#Create app directory 
WORKDIR /usr/src/app

# Install app dependencies 
# A wildcard 
COPY package*.json ./

RUN npm install

# Bundle app source code 
COPY . .

EXPOSE 8080

CMD [ "node", "src/server.js" ]