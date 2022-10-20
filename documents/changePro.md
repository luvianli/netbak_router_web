# 产品切换原理

#### 添加新产品

例添加一个产品名为RA1201-P2-03为例：

- 在src/proconfig中， 复制其中一个产品并粘贴成为新产品即可
- 新加产品后，要注意src/proconfig/RA1201-P2-03/favicon中，切换成新产品的favicon.icon 和 logo.png
- 菜单和主题的修改在src/proconfig/RA1201-P2-03/layout中修改

#### 切换产品使用命令

```shell
命令： gulp config --pro 产品名
例： gulp config --pro RA1201-P2-03
```

> 在命令行输入此命令即可切换产品

#### 产品入口

~~~javascript
// 路径 src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './proconfig/RA1201-P2-03/App';

ReactDOM.render(<App/>, document.getElementById('root'));

~~~

> 通过引入APP路径进入不同产品页面
>
> ** 如何改变APP引入路径见下文 【GULP切换路径】



~~~
通过APP引入路径， 我们可以知道， 产品的入口就在'./proconfig/产品名/App'
不同产品内容看src/proconfig/xxx代码
~~~



#### GULP切换路径

代码路径：src/tools/gulp/config.js

+ 执行命令： gulp config --pro RA1201-P2-03 后， 会进入产品切换中

~~~javascript

gulp.task('config', (callback) => {
  let ret = callback;
  if (argv.pro) {
    ret = changeConfig(argv.pro,callback);
  } else {
    ret = callback();
  }
  return ret;
});
~~~

+ 然后调用函数 changeConfig（name,callback），函数接收产品名

~~~javascript

function changeConfig(name,callback) {
  configTheme1(name);  
  configTheme2(name);  
  configProduct(name);  
  copyico(name);
  copytheme(name);
  copyCgid(name);
  callback();
}
~~~

   通过此函数可以切换主题， 切换产品名， 还有切换LOGO

+ 切换产品名函数

~~~javascript

const configReg = /'\.\/proconfig\/([\w.-]+)\/App'/g;  

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

~~~

​     此函数就是将src/index文件里的APP路径中的产品名切换成输入命令的产品名

