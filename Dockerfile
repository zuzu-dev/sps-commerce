# FROM node:14.10 As production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /

# COPY package*.json ./

# RUN npm install rimraf nest


# RUN npm install --only=production

# COPY . .

# RUN npm run build

# CMD ["node", "dist/main"]


FROM node:14.10 As development

WORKDIR /

COPY package*.json ./

RUN npm install rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14.10 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /

COPY package*.json ./

# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#       --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*
    
RUN npm install --only=production

COPY . .

COPY --from=development . ./

CMD ["node", "dist/main"]