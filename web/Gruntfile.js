module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                report: "gzip"
            },
            my_target: {
                files: {
                    "public/javascripts/core.min.js": [
                        "public/javascripts/core/jquery.min.js",
                        "public/javascripts/core/bootstrap.min.js",
                        "public/javascripts/core/jquery.slimscroll.min.js",
                        "public/javascripts/core/jquery.scrollLock.min.js",
                        "public/javascripts/core/jquery.appear.min.js",
                        "public/javascripts/core/jquery.countTo.min.js",
                        "public/javascripts/core/jquery.placeholder.min.js",
                        "public/javascripts/core/js.cookie.min.js",
                        "public/javascripts/core/app.js",
                        "public/javascripts/plugins/datatables/jquery.dataTables.js"
                    ],
                    "public/javascripts/owstats.min.js": ["public/javascripts/owstats.js"]
                }
            }
        },
        cssmin: {
            options: {
                report: "gzip",
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    "public/stylesheets/owstats.min.css": [
                        "public/stylesheets/source-sans-pro.css",
                        "public/stylesheets/bootstrap.min.css",
                        "public/stylesheets/oneui.css",
                        "public/stylesheets/owstats.css",
                        "public/javascripts/plugins/datatables/jquery.dataTables.css"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("default", ["uglify", "cssmin"]);
};
