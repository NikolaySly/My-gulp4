const gulp = require("gulp");
const sass = require('gulp-sass'); //Подключаем Sass пакет,
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const  uglify = require('gulp-uglify');
const imagemin = require("gulp-imagemin");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const del = require('del');



function js() {
  return gulp
  .src('app/js/**/*')
    .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest('./dist/js')) // Выгружаем в папку app/js
    .pipe(browserSync.stream());
}



function images() {
  return gulp
    .src("./app/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./dist/img"));
};


// CSS task
function css() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(concat('all.css'))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
};


	function buildHtml() { 
		return gulp
	.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());
}

// чистим папку
function clean() {
  return del(["./app/"]);
}

function watch() {
	 browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
	gulp.watch('app/scss/**/*.scss', css);
	gulp.watch('app/*.html', buildHtml);
  gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
};


const build = gulp.series(clean, gulp.parallel(js, images, css, buildHtml));
exports.css  = css;
exports.js  = js;
exports.watch  = watch;
exports.images  = images;
exports.clean = clean;
exports.buildHtml = buildHtml;
exports.build = build;
exports.default = watch;
