#!/bin/bash

# use KU mirror
sed -ie 's/us\.archive\.ubuntu\.com/mirror1.ku.ac.th/' /etc/apt/sources.list

# update APT
apt-get update
apt-get install -y cowsay

# installing build tools
/usr/games/cowsay Installing Build Tools
apt-get install -y build-essential git-core

# install MySQL
# http://unix.stackexchange.com/questions/147261/installing-mysql-server-in-vagrant-bootstrap-shell-script-how-to-skip-setup
/usr/games/cowsay Installing MySQL
debconf-set-selections <<< 'mysql-server mysql-server/root_password password MySuperPassword'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password MySuperPassword'
apt-get install -y mysql-server

# installing io.js
/usr/games/cowsay Installing io.js
mkdir -p /opt/iojs
wget https://iojs.org/dist/v1.5.1/iojs-v1.5.1-linux-x64.tar.gz -Oiojs.tar.gz
tar xzf iojs.tar.gz --strip=1 -C /opt/iojs
echo 'export PATH="/opt/iojs/bin:$PATH"' > /etc/profile.d/iojs.sh

# setup database
/usr/games/cowsay Creating Database User
(
  echo 'CREATE DATABASE legacy;'
  echo 'GRANT ALL ON legacy.* TO legacy@"%" IDENTIFIED BY "legacy_project";'
) | mysql -uroot -pMySuperPassword

# done
(
  echo 'Hopefully, the environment has been set up!'
  echo 'To use, type in "vagrant ssh" and then "cd /vagrant".'
  echo 'Type in "npm install" to install Node.js packages.'
) | /usr/games/cowsay -f stegosaurus
