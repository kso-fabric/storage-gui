FROM nginx:alpine

LABEL authors="Jakub Anderle"
LABEL org.opencontainers.image.source="https://github.com/kso-fabric/storage-gui"

COPY dist/ /usr/share/nginx/html/

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80