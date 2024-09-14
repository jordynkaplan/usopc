# pull official base image
FROM node:lts-alpine3.20 as build
# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
RUN npm run build

FROM nginx:stable-alpine
RUN mkdir -p /var/log/nginx/healthd
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
