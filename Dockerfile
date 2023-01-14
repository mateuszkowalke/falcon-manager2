# Use NodeJS server for the app.
FROM node:18 
RUN npm install -g npm@latest
# Copy files as a non-root user. The `node` user is built in the Node image.
WORKDIR /usr/src/app
RUN chown node:node ./
USER node
# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
# Install dependencies first, as they change less often than code.
COPY package*.json ./
RUN npm ci --ignore-scripts && npm cache clean --force
COPY --chown=node:node . .
RUN npm run postinstall
# Execute NodeJS (not NPM script) to handle SIGTERM and SIGINT signals.
# ^^ Can't do that for keystone as it has it's proprietary way of starting.
CMD ["./start_prod.sh"]
