FROM node:13.10-alpine
# create folder for build files
RUN mkdir -p /data/app
WORKDIR /data/app
COPY . /data/app/
# make node user owener of data
RUN chown -R node:node /data/app
USER node
# expose port 8080
EXPOSE 8080
# install and run
RUN npm install
# CMD
CMD ["npm", "run", "serve"]
