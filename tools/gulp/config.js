const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;
//check for reg
const configReg = /'\.\/proconfig\/([\w.-]+)\/App'/g;  
const mainPath = [`${paths.src}/index.js`];

const colorReg = /primarycolor='#([\w.-]+)'\;/g; 
const webpackProPath = [`${paths.config}/webpack.config.production.js`];
const webpackDevPath = [`${paths.config}/webpack.config.dev.js`];

function configTheme1(name) {
  let color = gulp.theme[name];
  if (name) {
    gulp.appName = name;
  }
  if(gulp.theme[name]===undefined){
    color = gulp.theme['DEFAULT'];
  }
  
  return gulp.src(webpackProPath)
    .pipe(replace(colorReg,  `primarycolor='${color}';`))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.config))
}

function configTheme2(name) {
  let color = gulp.theme[name];
  if (name) {
    gulp.appName = name;
  }
  if(gulp.theme[name]===undefined){
    color = gulp.theme['DEFAULT'];
  }
  
  return gulp.src(webpackDevPath)
    .pipe(replace(colorReg,  `primarycolor='${color}';`))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.config))
}

function configProduct(name) {
  if (name) {
    gulp.appName = name;
  }
  return gulp.src(mainPath)
    .pipe(replace(configReg,  `'./proconfig/${name}/App'`))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.src))
}
/**拷贝相应产品的ico */
// function copyico(name) {
//   const publicPaths = [`${paths.public}/`];
//   if (name) {
//     gulp.appName = name;
//   }
//   return gulp.src(`${paths.src}/proconfig/${name}/favicon/favicon.ico`)
//     .pipe(gulp.dest(publicPaths))
// }

/**拷贝相应产品的logo,theme.less */
function copytheme(name) {
  if (name) {
    gulp.appName = name;
  }  
  return gulp.src([`${paths.src}/proconfig/${name}/favicon/logo.png`, 
        `${paths.src}/proconfig/${name}/layout/theme.less`])
        .pipe(gulp.dest(`${paths.src}/`))
}
/**拷贝相应产品的logo,theme.less */
function copyHYID(name) {
  if (name) {
    gulp.appName = name;
  }  
  return gulp.src([`${paths.src}/proconfig/${name}/HYID.js`])
        .pipe(gulp.dest(`${paths.src}/share/`))
}

function changeConfig(name,callback) {
  configTheme1(name);  
  configTheme2(name);  
  configProduct(name);  
  // copyico(name);
  copytheme(name);
  copyHYID(name);
  callback();
}
  
gulp.task('config', (callback) => {
  let ret = callback;
  if (argv.pro) {
    ret = changeConfig(argv.pro,callback);
  } else {
    ret = callback();
  }
  return ret;
});