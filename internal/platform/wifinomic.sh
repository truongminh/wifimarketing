#!/bin/sh
app=wifinomic
repo=truongminh/wifinomic
key=$HOME/.ssh/$app-rsa
host=github.com

echo Add key for $app in $key
ssh-keygen -t rsa -C "Deploy key for wifinomic" -f $key
echo -e "\nHost $app $host \n\tHostname $host \n\tIdentityFile $key" >> $HOME/.ssh/config
chmod 644 $HOME/.ssh/config

echo The deploy key is
cat $key.pub
read -p "Add the deploy key. Press enter to continue"
git clone git@$app:$repo
