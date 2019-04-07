FROM node:10-alpine
COPY . .
RUN yarn
EXPOSE 80
ENV PORT 80
CMD ["node", "server.js"]
