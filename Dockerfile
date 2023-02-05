# To build docker image:
# docker image build -t nextjs-showcase .

# To run docker container:
# docker container run -p 3000:3000 -it --name nextjs-showcase-container nextjs-showcase

FROM node:alpine
COPY . /app
WORKDIR /app
RUN npm install

# Setting Environment Variables
ARG COMMENTSERVICE_HOST="http://localhost:8002"
ARG PROJECTSERVICE_HOST="http://localhost:8001"
ARG USERSERVICE_HOST="http://localhost:8000"
ARG FRONTEND_HOST="http://localhost:3000"
ARG IMAGE_HOST="http://localhost"
ENV COMMENTSERVICE_HOST=${COMMENTSERVICE_HOST}
ENV PROJECTSERVICE_HOST=${PROJECTSERVICE_HOST}
ENV USERSERVICE_HOST=${USERSERVICE_HOST}
ENV FRONTEND_HOST=${FRONTEND_HOST}
ENV IMAGE_HOST=${IMAGE_HOST}


RUN npm run build
CMD npm run start