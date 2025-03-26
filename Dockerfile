FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh ./

COPY startup.sh ./

RUN if [ ! -f .env ]; then cp .env.example .env; fi

RUN npm run build

FROM node:latest AS prod

WORKDIR /app

COPY package*.json .

RUN npm install --only=production

COPY --from=build /app/dist ./dist

COPY --from=build /app/.env ./

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY startup.sh ./
RUN chmod +x startup.sh

EXPOSE ${APP_PORT} ${DATABASE_PORT}

CMD ["npm", "run", "start:prod"]
