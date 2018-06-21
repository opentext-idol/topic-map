# Micro Focus IDOL Topic Map

[![Build Status](https://travis-ci.org/microfocus-idol/topic-map.svg?branch=master)](https://travis-ci.org/microfocus-idol/topic-map)

A JQuery plugin for displaying information in a topic map.

Documentation can be found [here](http://microfocus-idol.github.io/topic-map).

This repo uses git-flow. develop is the development branch. master is the last known good branch.

## Usage
    bower install hp-autonomy-topic-map

## Grunt tasks

* grunt doc : Generates project documentation
* grunt watch-doc : Watches for changes and regenerates the documentation
* grunt test : Run the jasmine specs and print the results to the console
* grunt browser-test : Start a web server for running the jasmine specs in the browser
* grunt lint : Run the JSHint checks and print the ersults to the console

## Known Issues
* Topic Map depends on Raphael version 2.1.2 because of a bug in Raphael 2.1.3+ this will be fixed when the bug in Raphael is closed.

## Is it any good?
Yes

## License
Copyright 2016-2017 Hewlett Packard Enterprise Development LP
Copyright 2017-2018 Micro Focus International plc.

Licensed under the MIT License (the "License"); you may not use this project except in compliance with the License.
