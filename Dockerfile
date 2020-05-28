FROM nginx:1.18
# remove default config
RUN rm /etc/nginx/nginx.conf

# copy config
COPY nginx.conf /etc/nginx/nginx.conf

# create dir for app data
RUN mkdir -p /data/app

# copy app data
COPY dist /data/app/
COPY docker-entrypoint.sh /data/app/

ENTRYPOINT ["/data/app/docker-entrypoint.sh"]
EXPOSE 80