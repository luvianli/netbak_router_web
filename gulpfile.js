const gulp = require('gulp');
const gutil = require('gulp-util');
// If you just want to run a command, just run the command, don't use this plugin:
// plugin: gulp-exec 
const paths = {
  build: 'build',
  src: 'src',
  public:'public',
  config:'config',
}
const theme={
  '4G300-H001-HY02':'#268082',
  '4G300-H002-HY03':'#268082',
  '4G300-H002-HY04':'#268082',
  '4G300-H002-HY05':'#268082',
  '4G1200-H002-HY06':'#268082',
  'DEFAULT':'#268082',
}
gulp.paths = paths;
gulp.theme = theme;


require('./tools/gulp/config');
require('./tools/gulp/build');

gulp.task('default', async() => {
  gutil.log(gutil.colors.green('先切换到产品目录:gulp config --pro productname'));
  gutil.log(gutil.colors.green('编译代码:yarn build'));
  gutil.log(gutil.colors.green('启动web:yarn start'));
  gutil.log(gutil.colors.yellow('\nmake RA1201-P2-03 -- for Router Store Device AC29'));
  await console.log('You will be better!');
});