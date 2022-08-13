# TypeScript

### 计算机词汇
- implict 隐式
- explict 显式
- contexture 上下文
- assertion 断言
- primitive 原始的
- interface 接口
- inheritance 继承
- generics 泛型

### 字面类型的一个问题
```ts
function handleRequest(url: string, method: 'GET' | 'POST') {

}

const req = { url: 'http://example.com', method: 'GET' };
handleRequest(req.url, req.method);
// Error: Argumemt of type 'string' is not assignable to parameter of type 'GET' | 'POST'

// solution 1
const const req = { url: 'http://example.com', method: 'GET' as 'GET' | 'POST' };

// solution 2
handleRequest(req.url, req.method as 'GET');

// solution 3
const req = { url: 'http://example.com', method: 'GET' } as const;
```

### 泛型
对共性的提取
允许类型作为其他类型的参数

- `Array<T>` 分离的是数据可以被线性访问、存储的共性
- `Stream<T>` 分离的是数据可以随着时间产生的共性
- `Promise<T>` 分离的是数据可以被异步计算的共性

### 实例化泛型
```ts
function create<T>(C: { new (): T }): T {
  return new C()
}
```

### 类型窄化(Type Narrowing)

- 类型守卫
  - `typeof` 窄化
- 真值窄化
  - `if (a && b)`
- 相等性窄化
  ```ts
  function example(x: string | number, y: string | boolean) {
      if (x === y) {
          // x & y is string
      } else {

      }
  }
  ```
- in窄化
  `'toString' in Object.prototype`
- instance of 窄化

### 组合类型推导
```ts
let x = Math.random() < 0.5 ? 10 : 'hello world';
// typeof x = number | string
```

### 类型断言(Type Assertions/Predicate)

- Assertions
  断言某个表达式是 `true` or `false`
- Predicate
  通常是一个函数，返回 `true` or `false`，比如 `[0, 1, 2].filter(x => x === 0)`

### 断言符
- as
  属于 `Assertions`
- is
  属于 `Predicate`

### 非null断言符
```ts
a.b! + 1
```

### Never类型
- 代表不应该出现的情况
```ts
type A = string & number; // never 代表永远不可能
```

### infer
```ts
// 嵌套数组
type Atom = string | number | boolean | bigint;
type Nested<T> = (T | (T | T[])[])[];
type Nested = Array<Atom | Nested>;

const oo: Nested = [1, 2, 3, [[]], 4, [[[5, 6]]]];
```

```ts
// 如果T是数组就递归解构，非则就取本身
type Flatterned<T> = T extends Array<infer V> ? Flatterned<V> : T;
```

```ts
type Unwrapped<T> = T extends Promise<infer U> ? U : T;
type T0 = Unwrapped<Promise<string>>; // string
```

```ts
type Unwrap<T> = T extends Promise<infer U>
  ? Unwrap<U> // !!!
  : T extends Array<infer V>
    ? UnwrapArray<T>
    : T;

type UnwrapArray<T> = T extends Array<infer U>
    ? { [P in keyof T]: Unwarp<T[P]> }
    : T;

type T0 = Unwrap<Promise<string>[]>; // string[]
type T1 = Unwrap<Promise<Promise<number>>[]>; // number[]
```

### declare
declare的作用就是告诉ts编译器 `declare` 的部分在源代码之外提供，不需要编译器处理。

### 构造函数的表示
```ts
type SomeConstructor<T> = {
  new (num: number): T
};

function fn<T>(ctor: SomeConstructor<T>, n: number) {
  return new ctor(n);
}

const arr = fn<Array<string>>(Array, 100);
```

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  }
  
  return { length: minimum }; // ts error 
}

// 如果传入的是Array，但{ length: minimum }不能代表Array
minimumLength<Array<string>>(new Array(100), 100);
```

### 泛型的使用规范
- 尽可能减少泛型参数

### 函数重载(overload)
```ts
function isSet<T>(x: any): x is Set<T> {
  return x instanceof Set;
}

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add<T>(a: Set<T>, b: Set<T>): Set<T>;
function add<T>(a: T, b: T): T {
  if (isSet<T>(a) && isSet<T>(b)) {
    return new Set([...a, ...b]);
  }
  return (a as any) + (b as any);
}
```

### 操作符重载
- ts不支持
- babel-plugin-overload-operator

### 类型工具
- `Partial<Type>`
**实现**
```ts
type Partial<T> = {
  [P in T]?: T[P]
}
```

- `Required<Type>`
**实现**
```ts
type Partial<T> = {
  [P in T]-?: T[P]
}
```

- `Readonly<Type>`
**实现**
```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

- `Record<Keys, Type>`
**实现**
```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

- `Pick<Type, Keys>`
**实现**
```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
}
```

- `Omit<Type, Keys>`
**实现**
```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

- `Exclude<Type, ExcludedUnion>`
```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
     
//type T0 = "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
     
//type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;
     
//type T2 = string | number
```
**实现**
```ts
type Exclude<T, U> = T extends U ? never : T
```

- `Extract<Type, Union>`
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
     
// type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;
     
// type T1 = () => void
```
**实现**
```ts
type Extract<T, U> = T extends U ? T : never;
```

- `NonNullable<Type>`
```ts
type T0 = NonNullable<string | number | undefined>;
     
// type T0 = string | number
type T1 = NonNullable<string[] | null | undefined>;
     
// type T1 = string[]
```
**实现**
```ts
type NonNullable<T> = T extends undefined | null ? never : T;
```

- `Parameters<Type>`
```ts
declare function f1(arg: { a: number; b: string }): void;
 
type T0 = Parameters<() => string>;
     
//type T0 = []
type T1 = Parameters<(s: string) => void>;
     
//type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>;
     
//type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>
     
//type T3 = [arg: {
//    a: number;
//    b: string;
//}]                
```
**实现**
```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

- `ConstructorParameters<Type>`
```ts
type T0 = ConstructorParameters<ErrorConstructor>;
     
//type T0 = [message?: string]
type T1 = ConstructorParameters<FunctionConstructor>;
     
//type T1 = string[]
type T2 = ConstructorParameters<RegExpConstructor>;
     
//type T2 = [pattern: string | RegExp, flags?: string]
type T3 = ConstructorParameters<any>;
     
//type T3 = unknown[]
type T4 = ConstructorParameters<Function>;
// Error : Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
//  Type 'Function' provides no match for the signature 'new (...args: any): any'.     
//type T4 = never
```

```tsx
interface ErrorConstructor {
  new(message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}
    
interface FunctionConstructor {
  /**
   * Creates a new function.
   * @param args A list of arguments the function accepts.
   */
  new(...args: string[]): Function;
  (...args: string[]): Function;
  readonly prototype: Function;
}

    
interface RegExpConstructor {
  new(pattern: RegExp | string): RegExp;
  new(pattern: string, flags?: string): RegExp;
  (pattern: RegExp | string): RegExp;
  (pattern: string, flags?: string): RegExp;
  readonly prototype: RegExp;

  // Non-standard extensions
  $1: string;
  $2: string;
  $3: string;
  $4: string;
  $5: string;
  $6: string;
  $7: string;
  $8: string;
  $9: string;
  lastMatch: string;
}
```

**实现**
```ts
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;
```

- `ReturnType<Type>`
**实现**
```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

- `InstanceType<Type>`
```ts
class C {
  x = 0;
  y = 0;
}
 
type T0 = InstanceType<typeof C>;

// type T0 = C
                       
type T1 = InstanceType<any>;
     
// type T1 = any
type T2 = InstanceType<never>;
     
// type T2 = never
type T3 = InstanceType<string>;
// Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.     
//type T3 = any
                       
type T4 = InstanceType<Function>;
// Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
//  Type 'Function' provides no match for the signature 'new (...args: any): any'.
     
// type T4 = any
```
**实现**
```ts
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```

- `ThisParameterType<Type>`
```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```
**实现**
```ts
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
```

- `OmitThisParameter<Type>`
```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
                                   
// typeof toHex 原本是 (this: number) => string
// const fiveToHex = () => string

 
console.log(fiveToHex());
```
**实现**
```ts
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

- `ThisType<Type>`
```ts
// 需要配合 tsconfig.json "noImplicitThis": true
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M; // Type of 'this' in methods is D & M
};
 
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}


let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});
 
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```
**实现**
```ts
interface ThisType<T> { }
```

- `Intrinsic String Manipulation Types`
**内部实现**

- `Uppercase<StringType>`
```ts

type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
           
// type ShoutyGreeting = "HELLO, WORLD"
 
type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">

// type MainID = "ID-MY_APP"
```

- `Lowercase<StringType>`
- `Capitalize<StringType>`
- `Uncapitalize<StringType>`

### keyof
```ts
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;

// type M = string | number
// js认为 a[0] 和 a['0'] 是一回事

type K = keyof any // string number symbol
```

### 类型计算方式
- infer
- -
- ?
- &
- |
- ...

### 装饰器
```ts
function decorate(target, property, descriptor) {
  const oldValue = descriptor.value;
  descriptor.value = (message) => {
    oldValue.call(null, `this message from decorate: ${message}`)      
  }
}
```

### interface 与 type的区别
```ts
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

```ts
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}

// Error: Duplicate identifier 'Window'.
```
### never类型
代表绝对不可能发生
可以将`never`类型赋值给任意类型，但是没有类型可以被赋值给`never`类型，除了`never`类型本身。
```ts
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
这种情况会报错
```ts
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape; // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

### 具有属性的函数
```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```
