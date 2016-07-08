# JavaScript 注释指南
### 概述

这套指南，主要以JSDoc和google Javascript style guide作为主要依据，以标签（tag）和类型为注释主体内容。
Tag，形如`@type`|`@param`|`@constructor`|`@extends`, 是对一段代码的打标，给代码打上相应标签并添加描述。
类型，形如`{Object}`|`{String}`|`{null}`|`{Function}`|`{Array.<string>}`|`{(number|boolean)}`，代表某一事物的类型。

### Tag table

Tag | Description
----|------------
@author | 作者
@const | 常量
@constructor | 构造器
@define | 定义变量，属性
@deprecated | 被废除的方法
@extends | 从哪里扩展
@fileoverview | 文件整体描述
@interface | 接口
@override | 覆盖，重写
@param | 参数
@return | 返回值
@see | reference
@supported | 兼容性，支持程度
@this | 上下文环境
@sideeffects | 有副作用的函数

### Type table






### 1.文件的全局注释

`@fileoverview` ，作为对文件整体的描述

### 2.类注释

如代码段1-1
```Javascript
Code snippet 1-1

/**
 * Class 类名.
 * @param {string} 变量名1 变量名1是用来...
 * @param {Array.<number>} 变量名2 变量名2是用来...
 * @constructor
 * @extends {goog.Disposable}
 */
project.MyClass = function(arg1, arg2) {
  // ...
};
goog.inherits(project.MyClass, goog.Disposable);

```

### 3.方法和函数注释

```Javascript
/**
 * 对函数方法的描述.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
function PR_someMethod(obj) {
  // ...
}
```

### 4.属性（变量）注释
用`@type {String}`来指明变量，属性和表达式的具体类型
```JavaScript
/**
 * 获取字符串
 * @type {String}
 */
var s = this.getString();
/** @constructor */
var Car = function(){
	
}
```

### 参考：

[1]Google Javascript Style Guide: https://google.github.io/styleguide/javascriptguide.xml