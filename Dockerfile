FROM node:16 as base

WORKDIR /usr/src/app

COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json

FROM base as dev
COPY --chown=node:node . .
RUN npm ci
USER node
ENV DEBUG=playground:*
CMD ["npm", "run", "dev"]

# FROM base as prod
# COPY --chown=node:node . .
# RUN npm ci --only=production
# USER node
# ENV NODE_ENV=production
# CMD ["npm", "start"]