var gulp = require('gulp'),
    glp = require('gulp-load-plugins')(),
    del = require('del'),
    debug = require('gulp-debug'),
    path = require('path'),
    webpack = require('gulp-webpack-build');

const SOURCE_DIR = 'src/';
const BUILD_DIR = 'www';
const CONFIG_FILENAME = 'webpack.config.js';

gulp.task('assets', function() {
  var assets = [
    'src/images/**',
    'src/index.html'
  ];

  return gulp.src(assets)
    .pipe(glp.changed(BUILD_DIR))
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(glp.size({title: 'assets'}));
});


gulp.task('webpack', [], function() {
    return gulp.src(CONFIG_FILENAME)
        .pipe(webpack.compile())
        .pipe(webpack.format({
            version: true,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest(BUILD_DIR));
});


gulp.task('watch', function() {
    gulp.watch(path.join(SOURCE_DIR, 'js/**/*.*')).on('change', function(event) {
        if (event.type === 'changed') {
            gulp.src(event.path, { base: path.resolve(SOURCE_DIR) })
                .pipe(webpack.closest(CONFIG_FILENAME))
                .pipe(webpack.watch(function(err, stats) {
                    gulp.src(this.path, { base: this.base })
                        .pipe(webpack.proxy(err, stats))
                        .pipe(webpack.format({
                            verbose: true,
                            version: false
                        }))
                        .pipe(gulp.dest(BUILD_DIR));
                }));
        }
    });
});
