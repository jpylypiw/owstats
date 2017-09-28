module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                report: 'gzip'
            },
            my_target: {
                files: {
                    'public/javascripts/core.min.js': [
                        'public/javascripts/core/jquery.min.js',
                        'public/javascripts/core/bootstrap.min.js',
                        'public/javascripts/core/jquery.slimscroll.min.js',
                        'public/javascripts/core/jquery.scrollLock.min.js',
                        'public/javascripts/core/jquery.appear.min.js',
                        'public/javascripts/core/jquery.countTo.min.js',
                        'public/javascripts/core/jquery.placeholder.min.js',
                        'public/javascripts/core/js.cookie.min.js',
                        'public/javascripts/core/app.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);
};