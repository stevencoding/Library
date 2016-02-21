var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function () {
    return gulp.src(jsFiles)
        .pipe(gulpJshint({browser: true}))
        .pipe(gulpJshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(gulpJscs({disallowMultipleLineBreaks: true}))
        .pipe(gulpJscs.reporter());
});

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');
    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {read: false});
    var injectOptions = {
        ignorePath: '/public'
    };
    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public'
    };
    return gulp.src('./src/views/*.html')
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views'));
});

gulp.task('serve', ['style', 'inject'], function() {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env : {
            'PORT': 5000
        },
        watch: jsFiles
    };

    return nodemon(options).on('restart', function(event) {
            console.log('Restarting....');
        });
});