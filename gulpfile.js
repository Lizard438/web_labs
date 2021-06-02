const { src, dest, watch, parallel, series } = require('gulp');

const scss    = require('gulp-sass');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');


function browsersync(params) {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    port: 3000,
    notify: false
  })
}

function html(){
  return src('src/*.html', '!src/_*.html')
    .pipe(fileinclude())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
}

function images(){
  return src('src/img/**/*.{jpg,png,svg,gif,ico,webp}')
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox:false}],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest('dist/img/'))
    .pipe(browserSync.stream())
}

function styles(){
  return src('src/scss/style.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream())
}

function watching (params){
  watch(['src/**/*.html'],html);
  watch(['src/scss/**/*.scss'],styles);
  watch(['src/img/**/*'],images);
}

function cleanDist(params){
  return del('./dist/');
}


exports.images = images;
exports.styles = styles;
exports.watching = watching;
exports.html = html;
exports.browsersync = browsersync;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, styles,html);
exports.default = parallel(styles, browsersync, watching);
