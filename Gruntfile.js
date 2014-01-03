module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
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

        uglify: {
            all: {
                files: {
                    'dist/galry.min.js': 'src/galry.js'
                }
            }
        },

        watch: {
            js: {
                files: ['src/*.js', 'demo/*.html'],
                tasks: ['jshint', 'uglify']
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

    grunt.registerTask('default', ['jshint', 'uglify', 'watch']);

};