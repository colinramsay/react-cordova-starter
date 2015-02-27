var gulp = require('gulp'),
    glp = require('gulp-load-plugins')(),
    del = require('del'),
    debug = require('gulp-debug'),
    path = require('path'),
    webpack = require('gulp-webpack-build');


const SOURCE_DIR = 'src/';
const BUILD_DIR = 'www';
const CONFIG_FILENAME = 'webpack.config.js';

gulp.task('clean', del.bind(
    null, ['www/*', '!www/.keep', '!build/.git'], {dot: true}
));

gulp.task('deploy', function() {

    var assets = [
        'src/index.html',
        'src/dist/bundle.js'
    ];

    return gulp.src(assets, { base: SOURCE_DIR })
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('webpack', [], function() {
    return gulp.src(CONFIG_FILENAME)
        .pipe(webpack.compile())
        .pipe(webpack.format({ version: true, timings: true }));
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
                        }));
                }));
        }
    });
});
