FROM redis:4.0.2-alpine
COPY ./redis.conf /usr/local/etc/redis/redis.conf
RUN mkdir dir /usr/redisDB/
EXPOSE 6379 6379
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
