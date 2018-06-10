const gulp = require('gulp'),
	gcmq = require('gulp-group-css-media-queries'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync').create(),
	fs = require("fs"),
	replace = require('gulp-replace'),
	environments = require('gulp-environments'),
	argv = require('yargs').argv,
	gulpif = require('gulp-if'),
	path = require('path'),
	reload = browserSync.reload,
	plumber = require('gulp-plumber'),
	runSequence = require('run-sequence');

//.pipe(gulpif(argv.production, replace('/images/', imagePath)))

gulp.task('default', function(callback){
	runSequence('compile', 'server', 'watch', callback)
});

gulp.task('compile', ['templates','styles', 'scripts', 'images']);      

gulp.task('templates', function(){
	gulp.src('sources/templates/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('build'));
});

gulp.task('styles', function(){
		gulp.src('sources/sass/styles.scss')
			.pipe(plumber())
			.pipe(sass())
			.pipe(autoprefixer({
		            browsers: ['last 2 versions'],
		            cascade: false
		        }))
			.pipe(gcmq())
			.pipe(cssnano())
		.pipe(gulp.dest('build/css/'));
});

gulp.task('scripts', function(){
		gulp.src("sources/js/*")
		.pipe(plumber())
		.pipe(gulp.dest("build/js"));
})

gulp.task('images', function(){
		gulp.src("sources/img/**/*")
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest("build/img"));
})

gulp.task('watch', function(){
	gulp.watch('./sources/sass/**/*.scss', ["styles"]);
	gulp.watch('./sources/templates/*.html', ["templates"]);
	gulp.watch('./sources//img/**/*', ["images"]);
})

gulp.task('server', function () {
  return browserSync.init(["./build/*", "./build/css/*", "./build/js/*"], {
    server: {
      baseDir: './build/'
    }
  });
});