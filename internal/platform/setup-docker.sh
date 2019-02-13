#!/bin/sh

useradd wifi
curl https://get.docker.com | sh
usermod -aG docker wifi
systemctl enable docker
systemctl start docker

curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose
chmod +x /usr/bin/docker-compose
