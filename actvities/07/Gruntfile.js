module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            wscn: {
                options: {
                    strictMath: true
                },
                files: {
                    'css/style.css': 'less/style.less'
                }
            }
        },
        watch: {
            less: {
                files: 'less/*.less',
                tasks: ['less']
            },
            livereload: {
                options: { livereload: true },
                files: ['js/**/*.js','css/**/*']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};