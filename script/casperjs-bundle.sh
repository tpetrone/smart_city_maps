#!/bin/bash

bundle exec rake spec:casperjs:prepare
bundle exec rake spec:casperjs:run
bundle exec rake spec:casperjs:restore
