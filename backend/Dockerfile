FROM node:14.15.0

COPY . .

RUN npm install && npm run build

EXPOSE 8081

ENTRYPOINT ["node"]

CMD ["dist/main.js"]
