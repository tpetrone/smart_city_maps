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

## Live demo

A demo version of the application has been deployed to Heroku, and you can
see it [here](http://smart-parking-maps.herokuapp.com/).

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

# Note: if you get an "ERROR 403: Forbidden." message from this command, please
# try again. This seems to be a Bitbucket issue.
wget -O phantomjs-2.1.1-linux-x86_64.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2

tar -xjf phantomjs-2.1.1-linux-x86_64.tar.bz2
rm -f /tmp/phantomjs-2.1.1-linux-x86_64.tar.bz2
sudo mkdir /opt/phantomjs
sudo mv ./phantomjs-2.1.1-linux-x86_64 /opt/phantomjs/phantomjs-2.1.1-linux-x86_64
sudo ln -s /opt/phantomjs/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
which phantomjs
```

#### CasperJS (testing framework built on top of PhantomJS)

```bash
sudo git clone https://github.com/n1k0/casperjs.git /opt/casperjs
sudo ln -s /opt/casperjs/bin/casperjs /usr/bin/casperjs
```

### Project setup

Now that you have all dependencies installed, you can setup the project with
the following steps:

- Clone the project from GitLab
  ```bash
  # You can also clone using the SSH URL.
  git clone https://gitlab.com/smart-city-platform/smart_parking_maps.git smart-city-platform/smart_parking_maps
  cd smart-city-platform/smart_parking_maps
  ``` 

- Install Rails and all other gems
  ```bash
  # This step is only necessary if you don't have Bundler installed.
  gem install bundler
  # This step is always necessary.
  bundle install
  ```

- Setup [overcommit](https://github.com/brigade/overcommit) (Git hooks for code quality)
  ```bash
  overcommit --install
  overcommit --sign
  ```
<br>
- Setup **Google API key**: the API key is not kept in the repository for security
  purposes. You will need to modify the contents of the file
  `RAILS_ROOT/config/keys/server_key_1` with the content of your Google
  API key.
  
    **NOTE:** if you are a Smart City platform member, you can use the API
    key available from the [project configuration](https://gitlab.com/smart-city-platform/smart_parking_maps/variables).

<br>
- Setup **Smart Parking API key**: the API key is not kept in the repository for
  security purposes. You will need to modify the contents of the file
  `RAILS_ROOT/config/keys/smart_parking_api_key` with the content of any
  valid API key from the [Smart Parking API](https://gitlab.com/smart-city-platform/smart_parking_api).
  If you don't have a key yet, please take a look at the Smart Parking API README.
<br><br>

- Make sure the [smart_parking_api](https://gitlab.com/smart-city-platform/smart_parking_api)
  server is running on port 3010 (refer to that project's README for how to do that).
<br><br>

- Start the server
  ```bash
  # Port 3011 is the port convention for this application within the Smart City
  # platform. Changing the port may cause other applications to fail.
  bundle exec rails server -p 3011 -b 0.0.0.0
  ```
  
- Open http://localhost:3011 on your browser!

## Testing

We have an integration test suite that is run with CasperJS. To run all
tests, use the following commands:

**IMPORTANT:** The application needs to be running on port 3011 for the test
suite to be able to run.

```
RAILS_ENV=test bundle exec rails s -p 3011 -b 0.0.0.0
export LC_ALL=C
./script/casperjs-bundle.sh
```

## Project phases

### Phase 1 (due May 20)

- **Goal**: lay the groundwork for the next phases. The goal of this phase was
mainly to familiarize ourselves with the tools that we chose to adopt in the
project, and test drive each one.

- **Issues**: see all issues that were planned (and delivered) for this phase [here](https://gitlab.com/smart-city-platform/smart_parking_maps/issues?assignee_id=&author_id=&milestone_title=Phase+1&scope=all&sort=id_desc&state=all&issue_search=&).

### Phase 2 (due June 8)

- **Goals**:
  - Integrate with the [smart\_parking\_api](https://gitlab.com/smart-city-platform/smart_parking_api) application.
  - Add more user-facing features.

- **Issues**: see all issues that were planned (and delivered) for this phase [here](https://gitlab.com/smart-city-platform/smart_parking_maps/issues?assignee_id=&author_id=&milestone_title=Phase+2&scope=all&sort=id_desc&state=all&issue_search=&).

### Phase 3 (due June 29)

- **Goals**:
  - Integrate with the [smart\_parking\_api](https://gitlab.com/smart-city-platform/smart_parking_api) application.
  - Add more user-facing features: checkin, incident reports, more UI filters, user registration & authentication.

- **Issues**: see all issues that were planned (and delivered) for this phase [here](https://gitlab.com/smart-city-platform/smart_parking_maps/issues?assignee_id=&author_id=&milestone_title=Phase+3&scope=all&sort=id_desc&state=all&issue_search=&).

