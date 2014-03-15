module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jshint:
      all: ["./src/js/*.js"]
    jsvalidate:
      options:
        globals: {}
        esprimaOptions: {}
        verbose: false
      all:
        files:
          src: ['<%=jshint.all%>']
    htmlmin:
      all:
        options:
          removeComments: true
          collapseWhitespace: true
        files:
          'dist/html/options.html': 'src/html/options.html'
    uncss:
      app:
        files:
          'dist/css/bootstrap.min.css': ['src/html/test.html']
    csscomb:
      app:
        files:
          'dist/css/bootstrap.min.css': ['dist/css/bootstrap.min.css']
    csso:
      app:
        files:
          'dist/css/bootstrap.min.css': ['dist/css/bootstrap.min.css']
    uglify:
      all:
        files:
          'dist/js/background.js': ['src/js/background.js']
          'dist/js/options.js': ['src/js/options.js']
    copy:
      lib:
        files: [{
          expand: true
          flatten: true
          src: 'src/js/lib/*.js'
          dest: 'dist/js/lib/'
        }]

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-jsvalidate'
  grunt.loadNpmTasks 'grunt-contrib-htmlmin'
  grunt.loadNpmTasks 'grunt-uncss'
  grunt.loadNpmTasks 'grunt-csscomb'
  grunt.loadNpmTasks 'grunt-csso'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'build', ['htmlmin', 'uncss', 'csscomb', 'csso', 'uglify', 'copy']
  grunt.registerTask 'test', ['jshint', 'jsvalidate']