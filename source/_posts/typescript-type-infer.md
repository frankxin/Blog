---
title: Typescript 常用类型推断
date: 2019-09-06 14:09:30
tags: Typescript
---

## 函数重载
函数重载对代码的可读性和类型安全都有很多帮助。

多参数重载：
```Typescript
// 重载
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
// Actual implementation that is a true representation of all the cases the function body needs to handle
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```

对象参数重载：
```Typescript
function padding(x: {all: number});
function padding(x: {topAndBottom: number, leftAndRight: number});
function padding(x: {top: number, right: number, bottom: number, left: number});
function padding(x: {all: number} | {topAndBottom: number, leftAndRight: number} | {top: number, right: number, bottom: number, left: number}) {
  let a,b,c,d
  if('all' in x) {
    b = c = d = a = x.all
  }else if('topAndBottom' in x) {
    c = a = x.topAndBottom
    d = b = x.leftAndRight
  }else {
    a = x.top
    b = x.right
    c = x.bottom
    d = x.left
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}

padding({topAndBottom: 12, leftAndRight: 14})
```

## 使用interface注解可调用的函数

普通函数：
```Typescript
interface ReturnString {
  (): string;
}

const foo: ReturnString;
const bar = foo();
```

实例化：
```Typescript
interface CallMeWithNewToGetString {
  new (): string;
}

// 使用
declare const Foo: CallMeWithNewToGetString;
const bar = new Foo(); // bar 被推断为 string 类型
```

## 类型断言
我们经常会遇到先定义了一个对象然后经过一些判断给对象的属性赋值的场景

```Typescript
let submitParams = {}
if(name){
   submitParams.name = name
}
```

这时因为submitParams在定义时没有属性，所以编译器认为name不存在于submitParams。
对于这种情况，除了在定义时我们就给submitParams赋正确的值，我们还可以用类型断言。
```Typescript
interface ISubmitParams {
    name: string
}
let submitParams = {} as ISubmitParams
if(name){
   submitParams.name = name
}
```

## 类型保护
类型保护作为一种判断过滤可以让我们通过缩小范围，更精准的确认类型
常见的类型保护包括以下几种：
- typeof
- instanceof
- in
- 字面量类型保护
- 自定义类型保护

### typeof
typeof 可以用来分辨**原始类型**的不同
```Typescript
function toNumber(s: number | string){
    if (typeof s === 'string') {
        return Number(s)
    }else{
        return s
    }
}
```

### instanceof 
instanceof 可以用来分辨**实例对象**的不同
```Typescript
class Foo {
  foo = 123;
}

class Bar {
  bar = 123;
}

function doStuff(arg: Foo | Bar) {
  if (arg instanceof Foo) {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 这个块中，一定是 'Bar'
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}

doStuff(new Foo());
doStuff(new Bar());
```

### in 
in 可以通过**对象上是否存在某个属性**来分辨不同的对象
```Typescript
interface A {
  x: number;
}

interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ('x' in q) {
    // q: A
  } else {
    // q: B
  }
}
```

### 字面量类型保护
字面量类型保护跟 in 很相似是通过某个属性来分别不同的对象
```Typescript
type Foo = {
  kind: 'foo'; // 字面量类型
  foo: number;
};

type Bar = {
  kind: 'bar'; // 字面量类型
  bar: number;
};

function doStuff(arg: Foo | Bar) {
  if (arg.kind === 'foo') {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    // 一定是 Bar
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```

### 自定义类型保护
自定义类型保护就是你**写个函数**告诉他你是嘛类型
```Typescript
interface TCE {
  name: 'tce'
  deploy: () => void
}
interface SCM {
  name: 'scm'
  build: () => void
}

function Process(system: TCE | SCM){
    if(isTCE(system)){
        system.deploy()
    }else{
        system.build()
    }
}

function isTCE(s: TCE | SCM): s is TCE{
    return s.name === 'tce'
}
```

## 枚举字面量

把枚举或者对象里的key拎出来
```Typescript
enum SubmitStatus {
    approve = 2, // 通过
    refuse = 3, // 拒绝
}
function submit(status: keyof typeof SubmitStatus){} // status 类型是 'approve' | 'refuse'
```

## 获取变量或键值的类型

typeof 获取变量类型 （类型用的typeof和JS的typeof不是一回事儿）
再用 keyof 获取键值

```Typescript
const colors = {
  red: 'red',
  blue: 'blue'
};

type Colors = keyof typeof colors;
```

## Conditinal Situation（条件类型）
> `T extends U ? X : Y`  

条件类型一般跟泛型一起用，要根据不同参数有不同类型的返回值时，条件类型特别管用。下面就是要**根据不同值返回各自类型**的例子
```typescript
type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<"a">;  // "string"
type T2 = TypeName<true>;  // "boolean"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<string[]>;  // "object"
```

## Index types 和 Mapped types

### Index types（索引类型）
索引类型经常以 `K extends keyof T` 这样的语法描述出现在代码中，表示：K 是 T 的键值的集合中的1个。
举个具体的例子：
我想写一个获取对象中某个值的函数，实例来自官方的文档
```Typescript
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}
const obj = {name: 'r'}
const name = getProperty(obj, 'name')
```
T 表示我们要取值的对象，K 是 T 的键值的集合中的1个。所以 `getProperty` 函数的返回值是 `T[K]`

### Mapped types（映射类型）
映射类型经常以 `P in keyof T` 这样的语法描述出现在代码中，表示：P 是 所有 T 的键值的映射，经常被形容为 “T 中所有的 P 都怎么样”。
再举一个官方文档中的例子：Partial
```Typescript
type Partial<T> = { [P in keyof T]?: T[P] }

interface Person = {
  name: string
  age: number
}
// 可以没有 age
const person: Partial<Persion> = {
  name: 'xx'
}
```
以上可以描述为所有 T 中的值都变为可选的

## Infer

`infer` 表示条件语句中待推断的变量。
让我们看个**获取函数返回值类型**的例子。
```Typescript
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```
用语言描述就是：T 如果是个（extends）函数，那返回 P 否则是any。
P 可以理解为一个变量定义或者占位。

## 本文参考
- https://www.typescriptlang.org
- https://jkchao.github.io/typescript-book-chinese/
