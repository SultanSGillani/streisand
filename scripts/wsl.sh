#!/bin/bash
#
#This script assumes very little other than a fresh Ubuntu install (using the Windows store) on Win10 1609 newer with WSL installed already
#In Powershell, run the following to install WSL and Ubuntu
#
#Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
#Invoke-WebRequest -Uri https://aka.ms/wsl-ubuntu-1604 -OutFile ~/Ubuntu.zip -UseBasicParsing
#Expand-Archive ~/Ubuntu.zip ~/Ubuntu
#~/Ubuntu/ubuntu.exe
#
#See the DOCKER_CHANNEL and DOCKER_COMPOSE_VERSION variables below to update from 18.03-stable/1.21.0
#
## ***NOTE**** This does not give you a Docker HOST, just the client/tools and environment and tools to FULLY use a Docker host. If you need a host for Windows 1803, you'll want to see https://docs.docker.com/install/windows/docker-ee/#install-docker-ee

cp ~/.bashrc ~/.bashrc.backup
cp ~/.profile ~/.profile.backup

sudo apt -y update && sudo apt -y upgrade

#pre-cleanup
sudo apt-get purge -y docker.io  docker docker-ce && sudo apt-get autoremove -y --purge docker.io && sudo apt-get autoclean && sudo rm -rf /var/lib/docker && sudo rm /etc/apparmor.d/docker && sudo groupdel docker

sudo apt-get -y install build-essential checkinstall cvs subversion git-core mercurial && sudo chown $USER /usr/local/src && sudo chmod u+rwx /usr/local/src

# Add Docker's official GPG key.
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common && sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && sudo apt-get -y update

sudo mkdir /c;
sudo mount --bind /mnt/c /c


echo 'Add this to sudoers file in a sec: $USER ALL=(root) NOPASSWD: /bin/mount'
echo ''
#add via visudo nick ALL=(root) NOPASSWD: /bin/mount
sudo visudo

# Install packages to allow apt to use a repository over HTTPS then Verify the fingerprint.
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common && apt-key fingerprint 0EBFCD88


## Install Docker in WSL Pick the release channel and install docker-ce
export DOCKER_CHANNEL=stable && sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) ${DOCKER_CHANNEL}" && sudo apt-get -y update && sudo apt-get -y install docker-ce

# Allow your user to access the Docker CLI without needing root.
sudo usermod -aG docker $USER

# Install Docker Compose.
export DOCKER_COMPOSE_VERSION=1.21.2 && sudo curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose

#fix /mnt/c so it's not so public
sudo chmod 755 /mnt/c

# install golang
sudo apt install -y golang

#install Node.js and NPM
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

grep -q -F 'export GOPATH' ~/.bashrc || echo 'export GOPATH=/c/dev/go' >> ~/.bashrc
echo 'sudo mount --bind /mnt/c /c' >> ~/.bashrc
echo 'export DOCKER_HOST=tcp://0.0.0.0:2375' >> ~/.bashrc
echo 'cp -R ~/jumpcut /c/' >> ~/.bashrc
echo 'cd /c/jumpcut/' >> ~/.bashrc
echo 'NOTE: Bash configuration changes will not be applied until WSL Bash is closed and restarted'
echo ''
