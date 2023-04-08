# node js image
FROM node:18.13.0-alpine AS node

# golang image
FROM golang:1.19-alpine as golang

# build moedb server
FROM golang AS moedb-server
RUN apk add --no-cache gcc make g++
WORKDIR /
COPY ./nijika .
RUN go mod download
RUN CGO_ENABLED=1 go build -o moedb-server

# install moedb client dependencies
FROM node AS moedb-client-deps
RUN apk add --no-cache libc6-compat
COPY ./kita/package.json ./kita/package-lock.json* /
RUN npm ci

# build moedb client
FROM node AS moedb-client
COPY --from=moedb-client-deps /node_modules ./node_modules
COPY ./kita /
RUN npm run build

# final stage
FROM node AS runner
ENV NODE_ENV production
WORKDIR /app

# copy client build
COPY --from=moedb-client ./public ./moedb-client/
COPY --from=moedb-client ./.next/standalone ./momoedb-client/
COPY --from=moedb-client ./.next/static ./moedb-client/

# copy server build
copy --from=moedb-server ./moedb-server ./moedb-server/moedb