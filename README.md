# Smart Parking Maps

## Description

This repository contains the code for the single-page application (SPA) that
helps users find spots around the city to park.

It is a Rails application because we wanted to take advantage of the Rails
[asset pipeline](http://guides.rubyonrails.org/asset_pipeline.html) to organize
our code and make testing and deploying easier, but there is back-end code. It is just
HTML, CSS, JavaScript and our testing infrastructure.

All data used in the app is provided by the
[Smart Parking API](https://gitlab.com/smart-city-platform/smart_parking_api),
so be sure to check that one too!

## Development setup

This section covers the necessary steps to get the application running on a
local development machine. It assumes you're using **Ubuntu**, so you may need
to adapt some of the commands if this is not true.

### Dependencies

- Ruby 2.3.1
- npm
- [PhantomJS](http://phantomjs.org/)
- [CasperJS](http://casperjs.org/)

### Dependencies installation

#### npm (node package manager)

```bash
# Install the latest npm
# Source: https://github.com/nodesource/distributions#debinstall
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install npm packages we use
sudo npm install -g istanbul
sudo npm install -g csslint
sudo npm install -g jshint
```

#### PhantomJS (headless WebKit-based browser)

```bash
# Source: http://phantomjs.org/download.html

sudo apt-get install libfreetype6 libfontconfig bzip2
wget -q --no-check-certificate -O /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
tar -xjf /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2 -C /tmp
rm -f /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2
mkdir /opt/phantomjs
mv /tmp/phantomjs-2.1.1-linux-x86_64 /opt/phantomjs/phantomjs-2.1.1-linux-x86_64
ln -s /opt/phantomjs/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
```

#### CasperJS (testing framework built on top of PhantomJS)

```bash
git clone https://github.com/n1k0/casperjs.git /opt/casperjs
ln -s /opt/casperjs/bin/casperjs /usr/bin/casperjs
```

### Project setup

Now that you have all dependencies installed, you can setup the project with
the following steps:

- Clone the project from GitLab
  ```bash
  # You can also clone using the SSH URL.
  git clone https://gitlab.com/smart-city-platform/smart_parking_maps.git
  ``` 

- Install Rails and all other gems
  ```bash
  bundle install
  ```

- Setup [overcommit](https://github.com/brigade/overcommit) (Git hooks for code quality)
  ```bash
  overcommit --install
  overcommit --sign
  ```

- Start the server
  ```bash
  bundle exec rails server
  ```
  
- Open http://localhost:3000 on your brower!

## Testing

We have an integration test suite that is run with CasperJS. To run all
tests, use the following commands:

```
./script/casper-bundle.sh
```

**Note:** the `prepare` and `restore` steps are needed to make sure we also
get coverage results (for that, we use [istanbul](https://github.com/gotwarlost/istanbul)).

## Project phases

### Phase 1 (due May 20)

- **Goal**: lay the groundwork for the next phases. The goal of this phase was
mainly to familiarize ourselves with the tools that we chose to adopt in the
project, and test drive each one.

- **Issues**: see all issues that were planned (and delivered) for this phase [here](https://gitlab.com/smart-city-platform/smart_parking_maps/issues?assignee_id=&author_id=&milestone_title=Phase+1&scope=all&sort=id_desc&state=all&issue_search=&).
