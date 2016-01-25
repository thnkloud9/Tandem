# TODO: check for python
sudo apt-get update
sudo apt-get install nginx
sudo apt-get install python3
sudo apt-get install python3-dev
sudo apt-get install python-pip build-essential
sudo apt-get install libffi-dev

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sudo pip install virtualenv

sudo apt-get install npm
sudo ln -s `which nodejs` /usr/bin/node
sudo npm install bower -g

sudo api-get install git
