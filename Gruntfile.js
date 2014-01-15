module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['src/**/*.js', 'test/**/*.js']
        },

        compass: {
            dev: {
                options: {
                    sassDir: 'src',
                    cssDir: 'dist',
                    outputStyle: 'compressed'
                }
            }
        },

        concat: {
            options: {
                banner: '(function(root, factory) {\n'
                        + '    if (typeof define === \'function\' && define.amd) define(factory);\n'
                        + '    else if (typeof exports === \'object\') module.exports = factory();\n'
                        + '    else root.galry = factory()\n'
                        + '}(this, function() {\n'
                        + '\n\'use strict\';\n\n',
                footer: '\n\nreturn galry;\n'
                        +'}));'
            },
            dist: {
                src : ['src/*.js'],
                dest: 'dist/galry.js'
            }
        },

        uglify: {
            all: {
                files: {
                    'dist/galry.min.js': 'dist/galry.js'
                }
            }
        },

        watch: {
            js: {
                files: ['src/*.js', 'demo/*.html'],
                tasks: ['jshint', 'concat', 'uglify']
            },
            css: {
                files: ['src/*scss'],
                tasks: ['compass']
            },
            options: {
                livereload: 35729
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'watch']);

};