/**
 * Build instructions for grunt.
 *
 * Structure seen in [rprtr](https://github.com/mrmrs/rprtr)
 * by [aputinski](https://github.com/aputinski)
 *
 * @param  {Object} grunt
 * @return {void}
 */
module.exports = function(grunt) {
  'use strict';

  var Helpers = require('./tasks/helpers');
  var config  = Helpers.config;
  var _       = grunt.util._;

  config = _.extend(config, Helpers.loadConfig('./tasks/options/'));

  /* Load grunt tasks from NPM packages */
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  /* "Helper" Tasks */
  grunt.registerTask('_test:beforeEach', ['jshint', 'ngtemplates']);
  grunt.registerTask('_build:less', [
    'less:dist',
    'less:distmin',
    'concat:bannerToDistStyle',
    'concat:bannerToDistStyleMin'
  ]);

  /* "Public" Tasks */

  /* Watch source and test files and execute karma unit tests on change. */
  grunt.registerTask('tdd', ['karma:watch:start', 'http-server:test', 'shell:startsilenium', 'watch:andtestboth']);
  grunt.registerTask('tdd:e2e', ['http-server:test', 'shell:startsilenium', 'watch:andteste2e']);
  grunt.registerTask('tdd:unit', ['karma:watch:start', 'watch:andtestunit']);

  /* Alias for starting the demo server */
  grunt.registerTask('demo', ['http-server:demo']);

  /* Execute all tests. */
  grunt.registerTask('test', ['_test:beforeEach', 'karma:all', '_protractor:start']);
  /* Execute e2e tests. */
  grunt.registerTask('test:e2e', ['_test:beforeEach', 'http-server:test', 'protractor:single']);
  /* Execute karma tests with Firefox and PhantomJS. */
  grunt.registerTask('test:travis', ['_test:beforeEach', 'karma:travis']);
  grunt.registerTask('test:sauce', ['_test:beforeEach', 'http-server:test', 'protractor:sauce']);

  /* Build dist files. */
  grunt.registerTask('build', ['ngtemplates', '_build:less', 'concat:dist', 'uglify']);

  /* Distribute a new version. */
  grunt.registerTask('release', 'Test, bump, build and release.', function(type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'bump-commit'
    ]);
  });

  /* test and build by default. */
  grunt.registerTask('default', ['test', 'build']);

  grunt.initConfig(config);
};
