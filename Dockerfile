FROM node:20.9.0

WORKDIR /adopt-spot-backend
COPY . .

ENV PATH=/adopt-spot-backendnode_modules/.bin:$PATH

RUN npm install && npm cache clean --force

CMD npm run dev:docker
