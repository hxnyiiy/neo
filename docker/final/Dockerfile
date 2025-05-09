#Step 1
FROM node:16

#Step 2
WORKDIR /usr/src/app

#Step 3
RUN git clone https://github.com/hxnyiiy/docker-publish
WORKDIR /usr/src/app/docker-publish/worldcup
RUN npm install

#Step 4
EXPOSE 8000

#Step5
CMD ["node","app.js"]