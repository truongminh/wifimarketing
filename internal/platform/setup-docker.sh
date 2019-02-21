#!/bin/sh

# add user wifi 
useradd wifi
usermod -aG wheel wifi

# install docker
#curl https://get.docker.com | sh
curl https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-18.06.2.ce-3.el7.x86_64.rpm -o docker-ce-18.06.2.ce-3.el7.x86_64.rpm
yum install docker-ce-18.06.2.ce-3.el7.x86_64.rpm
usermod -aG docker wifi
systemctl enable docker
systemctl start docker

# install docker-compose
curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose
chmod +x /usr/bin/docker-compose
