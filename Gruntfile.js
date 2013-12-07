module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },

        uglify: {
            all: {
                files: {
                    'dist/galry.min.js': 'src/galry.js'
                }
            }
        },

        watch: {
            all: {
                files: ['src/*.js', 'demo/*.html'],
                tasks: ['jshint', 'uglify'],
                options: {
                    livereload: 35729
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('default', ['jshint', 'uglify', 'watch']);

};