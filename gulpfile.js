'use strict';

// =========================================
// Variables of gulp pluggins for clarity
// edit these variables to suit your project
// =========================================

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    notify = require("gulp-notify"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

// =========================================
// Variables of project's path
// edit these path to suit your project
// =========================================

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        sass: 'src/sass/main.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        sass: 'src/sass/*.sass',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

// =========================================
// Local server configuration
// =========================================

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9898,
    logPrefix: "PROJECT"
};

// =========================================
// Gulp tasks
// =========================================

gulp.task('html', function(done) {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true }));
    done();
});

gulp.task('js', function(done) {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true }));
    done();
});

gulp.task('sass', function(done) {
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", notify.onError()))
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true }));
    done();
});

gulp.task('image', function(done) {
    gulp.src(path.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true, arithmetic: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({ stream: true }));
    done();
});

gulp.task('fonts', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({ stream: true }));
    done();
});

gulp.task('build', gulp.series(
    'html',
    'js',
    'sass',
    'fonts',
    'image'
));

// =========================================
//  Use time delay for 'style:build'
// =========================================

gulp.task('watch', function(done) {
    watch([path.watch.html], gulp.parallel('html'));
    watch([path.watch.sass], gulp.parallel('sass'));
    watch([path.watch.js], gulp.parallel('js'));
    watch([path.watch.img], gulp.parallel('image'));
    watch([path.watch.fonts], gulp.parallel('fonts'));
    done();
});

gulp.task('webserver', function(done) {
    browserSync(config);
    done();
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', gulp.series('build', 'webserver', 'watch'));