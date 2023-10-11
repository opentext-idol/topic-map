module.exports = (grunt) ->
  jasmineRequireTemplate = require 'grunt-template-jasmine-requirejs'

  documentation = 'doc'
  jasmineSpecRunner = 'spec-runner.html'

  specs = 'test/spec/**/*.js'
  source = 'src/js/**/*.js'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    clean: [
      'bin'
      '.grunt'
      documentation
      jasmineSpecRunner
    ]
    connect:
      server:
        options:
          port: 8000
          useAvailablePort: true
    jasmine:
      test:
        src: source
        options:
          keepRunner: false
          outfile: jasmineSpecRunner
          specs: specs
          template: jasmineRequireTemplate
          templateOptions:
            requireConfigFile: 'test/require-config.js'
    jsdoc:
      dist:
        src: ['src/js/topicmap.js', 'README.md']
        options:
          destination: documentation
          template: 'node_modules/ink-docstrap/template'
          configure: 'jsdoc.conf.json'
    jshint:
      all: [
        source
        specs
      ],
      options:
        asi: true
        bitwise: true
        browser: true
        camelcase: true
        curly: true
        devel: true
        eqeqeq: true
        es3: true
        expr: true
        forin: true
        freeze: true
        jquery: true
        latedef: true
        newcap: true
        noarg: true
        noempty: true
        nonbsp: true
        undef: true
        unused: true
        globals:
          define: false
          expect: false
          it: false
          require: false
          describe: false
          beforeEach: false
          afterEach: false
          jasmine: false
          autn: false
      travis:
        src: '**/*'
        options:
          base: 'doc'
          message: 'Update documentation'
          repo: 'git@github.com:' + process.env.TRAVIS_REPO_SLUG


  grunt.loadNpmTasks 'grunt-jsdoc'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'doc', ['jsdoc']
  grunt.registerTask 'lint', ['jshint']
  grunt.registerTask 'test', ['jasmine:test']
  grunt.registerTask 'browser-test', ['jasmine:test:build', 'connect:server:keepalive']
