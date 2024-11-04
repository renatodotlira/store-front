FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build /app/dist/store-front /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]