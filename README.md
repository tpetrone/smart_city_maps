# Smart Parking Maps

## Setup

This section covers steps necessary to get the application running locally.
It assumes you're using **Ubuntu**. You may need to adapt some commands if this
is not true.

### Dependencies

- Ruby 2.3.1
- npm
- PhantomJS
- CasperJS

### Dependencies installation

```bash
# Install the latest npm
# See: https://github.com/nodesource/distributions#debinstall
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install npm packages
sudo npm install -g csslint
sudo npm install -g jshint

# Install PhantomJS
# See: http://phantomjs.org/download.html
sudo apt-get install libfreetype6 libfontconfig bzip2
wget -q --no-check-certificate -O /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
tar -xjf /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2 -C /tmp
rm -f /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2
mkdir /opt/phantomjs
mv /tmp/phantomjs-2.1.1-linux-x86_64 /opt/phantomjs/phantomjs-2.1.1-linux-x86_64
ln -s /opt/phantomjs/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

# Install CasperJS
git clone https://github.com/n1k0/casperjs.git /opt/casperjs
ln -s /opt/casperjs/bin/casperjs /usr/bin/casperjs
```

### Project setup

- Clone the project from GitLab
- Run the following commands:

```
overcommit --install
overcommit --sign
```

### Tests

```
bundle exec rspec
bundle exec rake teaspoon
bundle exec rake spec:casperjs
```

## TODO:

* How to run the test suite
* Services (job queues, cache servers, search engines, etc.)
* Deployment instructions
