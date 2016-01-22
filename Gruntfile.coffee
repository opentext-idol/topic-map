module.exports = (grunt) ->
  documentation = 'doc'
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    clean: [
      'bin'
      '.grunt'
      documentation
    ]
    jsdoc:
      dist:
        src: ['topicmap.js', 'README.md']
        options:
          destination: documentation
          template: 'node_modules/ink-docstrap/template'
          configure: 'jsdoc.conf.json'
    'gh-pages':
      'default':
        src: '**/*'
        options:
          base: 'doc'
          message: 'Update documentation'
      travis:
        src: '**/*'
        options:
          base: 'doc'
          message: 'Update documentation'
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/' + process.env.TRAVIS_REPO_SLUG
          user:
            name: 'Travis CI Server'
            email: 'will.byrne@hpe.com'
    watch:
      doc:
        files: [
          'src/**/*.js'
          'README.md'
        ]
        tasks: ['doc']

  grunt.loadNpmTasks 'grunt-gh-pages'
  grunt.loadNpmTasks 'grunt-jsdoc'

  grunt.registerTask 'doc', ['jsdoc']
  grunt.registerTask 'push-doc', ['doc', 'gh-pages:default']
  grunt.registerTask 'push-doc-travis', ['doc', 'gh-pages:travis']
  grunt.registerTask 'watch-doc', ['watch:doc']