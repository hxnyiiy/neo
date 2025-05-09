# Step1:
FROM node:16

#Step2:
WORKDIR /usr/src/app

#Step3:
COPY package*.json .
RUN npm install

# Step 4:
COPY server.js .

#Step 5:
EXPOSE 8000

#Step6:
CMD ["node","server.js"]
