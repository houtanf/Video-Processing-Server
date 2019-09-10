FROM node:11.4

WORKDIR /app

COPY . /app

#CMD ["npm", "run", "manager"]


#when you run, the docker using this, just specify api or manager at the end
ENTRYPOINT ["npm", "run"]
