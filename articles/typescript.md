---
title: 组织 Typescript 类型定义实践
date: 2018-10-30
tags: ["Typescript"]
---

# 组织 typescript 类型定义实践

[TOC]

Typescript 把类型系统引入 JS，让我们能用使用静态类型编写程序。外部模块需要引入类型定义，全局模块需要定义一些通用的变量，内部的模块也需要共享一些类型的定义。本文介绍了我们是如何在实际项目中组织类型定义。我们采用的TS版本为2.x 。

## 一、基本概念

### 1.1 `module`关键字

`module` 关键字可能是TS中最具有歧义的一个设计了，这个关键字**并不代表Javascript中真正的模块**
我们通常使用的ES module的 `import/export`等加载模块方式才是真正能管理模块的方式。
`module`在当前TS版本中，仅用作对模块的声明，不能包含具体实现。
例如：node 的声明文件对 `module`的使用
```javascript
//@types/node/index.d.ts 中的代码片段
declare module "tty" {
    import * as net from "net";

    export function isatty(fd: number): boolean;
    export class ReadStream extends net.Socket {
        isRaw: boolean;
        setRawMode(mode: boolean): void;
        isTTY: boolean;
    }
    export class WriteStream extends net.Socket {
        columns: number;
        rows: number;
        isTTY: boolean;
    }
}

//我们在自己的文件中一般这么使用
import * as tty from 'tty'
```

### 1.2 namespace
命名空间和ES module类似，都是一种**代码组织方式**。
`namespace`关键字和 `module`关键字不同，它不仅可以包含声明，还可以包含具体实现。
例如：
```javascript
namespace NS {
   export doSomething(a,b){
       return a + b
   }
   export class AClass {}
}

NS.doSomething()
new NS.AClass()
```
通过[声明合并](https://www.tslang.cn/docs/handbook/declaration-merging.html)，triple-slash指令声明依赖，TS 可以通过拆包的方式管理模块，正如 TS 文档中的[分离到多文件的实例](https://www.tslang.cn/docs/handbook/namespaces.html)
### 1.3 triple-slash指令
triple-slash指令表示一种依赖声明
## 二、对于不同模块如何组织类型定义

### 2.1 全局模块
有时候我们需要在全局定义一些通用的类型定义
在这里，我们使用namespace和triple-slash的方式管理全局的类型定义
例如：
```javascript
// global.d.ts
/// <reference path="./person/index.d.ts" />
interface Window {
    userInfo: any,
}

declare var window: Window

// ./person/index.d.ts
/// <reference path="./person/alice.d.ts" />
/// <reference path="./person/bob.d.ts" />
declare namespace Person {}

// ./person/alice.d.ts
declare namespace Person {
    export interface IAlice {}
}

// ./person/bob.d.ts
declare namespace Person {
    export interface IBob {}
}
```
这样定义的好处是，不需要维护复杂的`import/export`关系。全局定义一定要加命名空间，防止命名冲突。
### 2.2 外部模块
由于大多数的常用模块都已经写好声明文件，我们在开发项目中很少会涉及到外部模块（外部模块在这里特指第三方依赖）声明的编写。
但是当外部模块没有声明文件的时候，我们就需要在全局用`module`关键字来声明。
例如：
```javascript
// global.d.ts
// 声明中的字符串是你在使用中这个模块前 import 的路径，例子中的*为通配符
declare module '@vdian/hotpot/*';
```

## 三、总结
上面总结了一些，在开发中经常遇到，且在文档中不明确容易引起歧义的地方。
如何写，可以参考已有的方案，比如[node](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/index.d.ts), [lodash](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/lodash)

（完）
