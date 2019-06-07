'use strict';

//Define dependencies
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const babel = require('gulp-babel')
const responsive = require('gulp-responsive');
const traceur = require('gulp-traceur');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');

//Define Compilers

//Combine all defined admin and theme route objects
const allJs = [
  {
    name : 'backendJs',
    src : './src/server/*.js',
    dest : './dist/server/'
  },
  {
    name : 'reactClientJs',
    src : './src/client/*.js',
    dest : './dist/client/'
  },
  {
    name : 'reactSharedJs',
    src : './src/shared/*.js',
    dest : './dist/shared/'
  },
  {
    name : 'reactCompJs',
    src : './src/shared/components/*.js',
    dest : './dist/shared/components/'
  }
];
const allCss = [
  {
    name : 'reactCss',
    src : './src/client/*.css',
    dest : './dist/client/'
  },
  {
    name : 'reactSharedCss',
    src : './src/shared/*.css',
    dest : './dist/shared/'
  }
];
const allTransfers = [
  {
    name : 'views',
    src : './src/views/*.ejs',
    dest : './dist/views/'
  },
  {
    name : 'public',
    src : './src/public/*.{ico, html, json, png, jpg, svg}',
    dest : './dist/public/'
  },
  {
    name : 'reactTransfer',
    src : './src/client/*.{ico, json, png, jpg, svg}',
    dest : './dist/client/'
  }
];

const allImg = [];

//Define Watch Routes, to be generated at task generation
const watchCssRoutes = [];
const watchJsRoutes = [];
const watchImgRoutes = [];
const watchTransferRoutes = [];

//Define build array
const buildArr = [];

// compile sass to css, prefix it, minify it, and rename to min file

allCss.forEach( (option) =>{
  gulp.task(option.name, ()=> {
    return gulp.src(option.src)
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(csso())
      .pipe(gulp.dest(option.dest))
  });
  watchCssRoutes.push({name : option.name, route : option.src });
  buildArr.push(option.name);
});

//build all images to responsive sizes
//TODO: Fix image tasks... currently not working.
//Maybe transfer main images from a theme and use this for all uploaded images?
allImg.forEach( (option) =>{
  gulp.task(option.name, ()=> {
    return gulp.src(option.src)
      .pipe(responsive({
        '*': [{
          width: 200,
          rename: { suffix: '-200' },
        }, {
          width: 400,
          rename: { suffix: '-400' },
        }, {
          width: 600,
          rename: { suffix: '-600' },
        },{
          width: 800,
          rename: { suffix: '-800' },
        },{
          width: 1000,
          rename: { suffix: '-1000' },
        },{
          width: 1200,
          rename: { suffix: '-1200' },
        }]
      }, {
        // Global configuration for all images
        quality: 85,
        progressive: true,
        withoutEnlargement: false
      }))
      .pipe(gulp.dest(option.dest));
  });
  watchImgRoutes.push({name : option.name, route : option.src });
  // buildArr.push(option.name);
});

//uglify all javascript that has been compiled from our tsconfig.json
allJs.forEach( (option) =>{
  gulp.task(option.name, ()=> {
    return gulp.src(option.src)
//    .pipe(traceur())
    .pipe(babel())
    // .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(option.dest))
  });
  watchJsRoutes.push({name : option.name, route : option.src });
  buildArr.push(option.name);
});

//copy over all files that will not need to be changed
allTransfers.forEach( (option) =>{
  gulp.task(option.name, ()=>{
    return gulp.src(option.src)
      .pipe(gulp.dest(option.dest))
  });
  watchTransferRoutes.push({name : option.name, route : option.src });
  buildArr.push(option.name);
});


gulp.task('watch', function () {
  //Build watch tasks for every destination
  watchJsRoutes.forEach( (option) =>{
    gulp.watch(option.route, gulp.series(option.name));
  });
  watchCssRoutes.forEach( (option) =>{
    gulp.watch(option.route, gulp.series(option.name));
  });
  watchTransferRoutes.forEach( (option) =>{
    gulp.watch(option.route, gulp.series(option.name));
  });
});

gulp.task('build', gulp.series(buildArr));