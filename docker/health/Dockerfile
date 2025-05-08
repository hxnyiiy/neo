# Step 1:Base Images
FROM ubuntu:latest

#Step 2:nginx install
RUN apt -y update; apt -y upgrade; apt -y install nginx curl
RUN echo "\ndaemon off">> /etc/nginx/nginx.conf

#Step 3:
COPY index.html /var/www/html

#Step4:
HEALTHCHECK --interval=10s --timeout=3s CMD curl -f http://localhost || exit 1

#Step5:
CMD ["nginx"]
