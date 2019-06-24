var gulp = require('gulp');
var bs = require ('browser-sync');
var sass = require('gulp-sass');
var gutil = require( 'gulp-util');
var ftp = require( 'vinyl-ftp');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');


	// Static Server + watching scss/html files
	gulp.task('serve', ['sass'], function() {

	    bs.init({
	        server: "./src"
	    });

	    gulp.watch("src/sass/*.sass", ['sass']);
	    gulp.watch("src/*.html").on('change', bs.reload);
	});

	// Compile sass into CSS & auto-inject into browsers
	gulp.task('sass', function() {
	    return gulp.src("src/sass/*.sass")
	        .pipe(sass().on('error', sass.logError))
	        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
       		 }))
	        .pipe(concatCss("main.css"))
	        .pipe(gulp.dest("src/css"))
	        .pipe(bs.stream());
	});

	gulp.task('default', ['serve']);


gulp.task( 'deploy', function () {

	var conn = ftp.create( {
		host:     '89.108.85.65',
		user:     'inveg210',
		password: 'hQeT37jXrq',
		log:      gutil.log
	} );

	var globs = [
		'dist/.**',
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: '.', buffer: false } )
		.pipe( conn.newer( '/www/vshtumpf.ru/good-carton/' ) ) // only upload newer files
		.pipe( conn.dest( '/www/vshtumpf.ru/good-carton/' ) );

} );

gulp.task('dist', function() {
	return gulp.src('./src/**')
		.pipe(gulp.dest('dist'));
	});

gulp.task('minify-css', function() {
	return gulp.src('src/css/*.css')
				.pipe(cleanCSS({compatibility: 'ie8'}))
				.pipe(gulp.dest('dist/css'));
	});

gulp.task('minify', ['minify-css'], function() {
	return gulp.src('src/*.html')
				.pipe(htmlmin({ collapseWhitespace: true }))
				.pipe(gulp.dest('dist'));
	});