FROM nginx:alpine
RUN apk add --no-cache tzdata
RUN rm -rf /etc/nginx/conf.d/default.conf
ENV TZ=Europe/Moscow
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && rm -rf /var/cache/apl/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY app/ /usr/share/nginx/html/
CMD nginx -g 'daemon off;'