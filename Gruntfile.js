// Generated on 2015-03-01 using generator-jhipster 2.0.0
'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

// usemin custom step
var path = require('path');

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    watch: {
      styles: {
        files: ['src/main/assets/styles/**/*.css']
      },
      livereload: {
        options: {
          livereload: 35729
        },
        files: [
          'src/main/**/*.html',
          'src/main/**/*.json',
          '{.tmp/,}src/main/assets/styles/**/*.css',
          '{.tmp/,}src/main/scripts/**/*.js',
          'src/main/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      proxies: [
        {
          context: '/uaa',
          host: 'localhost',
          port: 9999,
          https: false,
          changeOrigin: false
        },
        {
          context: '/resource',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/metrics',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/dump',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/health',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/configprops',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/beans',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/api-docs',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/oauth/token',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        }
      ],
      options: {
        port: 9005,
        // Change this to 'localhost' to deny access to the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'src/main'
          ],
          middleware: function (connect) {
            return [
              proxySnippet,
              connect.static('.tmp'),
              connect.static('src/main'),
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            'src/main'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: 'dist',
          middleware: function (connect) {
            return [
              proxySnippet,
              connect.static('dist')
            ];
          }
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist',
            '.tmp',
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/main/scripts/app.js',
        'src/main/scripts/app/**/*.js',
        'src/main/scripts/components/**/*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/main/scripts',
          src: ['scripts/app/**/*.coffee', 'scripts/components/**/*.coffee'],
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '**/*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    concat: {
      // not used since Uglify task does concat,
      // but still available if needed
      //    dist: {}
    },
    rev: {
      dist: {
        files: {
          src: [
            '/src/main/scripts/**/*.js',
            '/src/main/assets/styles/**/*.css',
            '/src/main/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '/src/main/assets/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: 'src/main/**/*.html',
      options: {
        dest: '',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['concat', 'cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['/src/main/**/*.html'],
      css: ['/src/main/assets/styles/**/*.css'],
      js: ['/src/main/scripts/**/*.js'],
      options: {
        assetsDirs: ['/src/main', '/src/main/assets/styles', '/src/main/assets/images', '/src/main/assets/fonts'],
        patterns: {
          js: [
            [/(src\/main\/assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        },
        dirs: ['']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/main/assets/images',
          src: '**/*.{jpg,jpeg}', // we don't optimize PNG files as it doesn't work on Linux. If you are not on Linux, feel free to use '**/*.{png,jpg,jpeg}'
          dest: 'dist/assets/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/main/assets/images',
          src: '**/*.svg',
          dest: 'dist/assets/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //     files: {
      //         '/styles/main.css': [
      //             '.tmp/styles/**/*.css',
      //             'styles/**/*.css'
      //         ]
      //     }
      // }
    },
    ngtemplates: {
      dist: {
        cwd: 'src/main',
        src: ['views/**/*.html'],
        dest: '.tmp/templates/templates.js',
        options: {
          module: 'casksandbottlesApp',
          usemin: 'scripts/app.js',
          htmlmin: {
            removeCommentsFromCDATA: true,
            // https://github.com/yeoman/grunt-usemin/issues/44
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            conservativeCollapse: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true
          }
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          keepClosingSlash: true
        },
        files: [{
          expand: true,
          cwd: 'src/main',
          src: ['*.html'],
          dest: 'dist'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/main',
          dest: 'dist',
          src: [
            'src/main/*.html',
            'src/main/i18n/**/*.json',
            'src/main/assets/images/**/*.{png,gif,webp}',
            'src/main/assets/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/assets/images',
          dest: '/assets/images',
          src: [
            'generated/*'
          ]
        }]
      },
      generateOpenshiftDirectory: {
        expand: true,
        dest: 'deploy/openshift',
        src: [
          'pom.xml',
          'src/main/**'
        ]
      }
    },
    concurrent: {
      server: [],
      test: [],
      dist: [
        'imagemin',
        'svgmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'src/test/javascript/karma.conf.js',
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['/*.html']
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    replace: {
      dist: {
        src: ['/index.html'],
        overwrite: true,                                 // overwrite matched source files
        replacements: [{
          from: '<div class="development"></div>',
          to: ''
        }]
      }
    },
    uglify: {
      // not used since Uglify task does uglify
      //    dist: {
      //     files: {
      //            '/scripts/scripts.js': [
      //                '/scripts/scripts.js'
      //            ]
      //        }
      //    }
    },
    buildcontrol: {
      options: {
        commit: true,
        push: false,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      openshift: {
        options: {
          dir: 'deploy/openshift',
          remote: 'openshift',
          branch: 'master'
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      grunt.task.run(['build', 'replace', 'configureProxies', 'connect:dist:keepalive']);
    } else {
      grunt.task.run([
        'clean:server',
        'concurrent:server',
        'configureProxies',
        'connect:livereload',
        'watch'
      ]);
    }


  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'ngtemplates',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'ngAnnotate',
    'cssmin',
    'replace',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('buildHeroku', [
    'test',
    'build',
    'copy:generateHerokuDirectory',
  ]);

  grunt.registerTask('deployHeroku', [
    'test',
    'build',
    'copy:generateHerokuDirectory',
    'buildcontrol:heroku'
  ]);

  grunt.registerTask('buildOpenshift', [
    'test',
    'build',
    'copy:generateOpenshiftDirectory',
  ]);

  grunt.registerTask('deployOpenshift', [
    'test',
    'build',
    'copy:generateOpenshiftDirectory',
    'buildcontrol:openshift'
  ]);

  grunt.registerTask('default', [
    //'test',
    'build'
  ]);
};
