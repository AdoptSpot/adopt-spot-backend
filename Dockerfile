FROM node:20.9.0

WORKDIR /home/adopt-spot-backend
COPY . .

RUN npm install

CMD ["npm", "start"]