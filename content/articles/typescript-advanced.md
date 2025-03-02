---
title:
  zh: "TypeScript 高级类型与模式"
  en: "Advanced TypeScript Types and Patterns"
description:
  zh: "探索TypeScript的高级类型系统，学习如何利用类型操作、条件类型和类型推断优化你的代码库。"
  en: "Explore TypeScript's advanced type system and learn how to leverage type manipulations, conditional types and type inference to optimize your codebase."
date: 2023-08-05
originalUrl: https://juejin.cn/user/3702810894152983/posts
---

# TypeScript 高级类型与模式

## 引言

TypeScript 为 JavaScript 添加了强大的类型系统，使开发人员能够编写更加健壮和可维护的代码。大多数 TypeScript 初学者熟悉基本类型（如 `string`、`number`、`boolean`）和简单的接口，但 TypeScript 的类型系统远比这些基础内容更加强大和灵活。本文将深入探讨 TypeScript 的高级类型特性和常用模式，帮助你充分利用 TypeScript 的类型系统。

## 联合类型与交叉类型

### 联合类型 (Union Types)

联合类型表示一个值可以是几种类型之一：

```typescript
type ID = string | number;

function printID(id: ID) {
  console.log(id);
}

printID(101);      // 有效
printID("202");    // 有效
printID({ id: 303 }); // 错误：对象不是 string 或 number
```

### 交叉类型 (Intersection Types)

交叉类型将多种类型合并为一个类型：

```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "张三",
  age: 30,
  employeeId: 123,
  department: "技术部"
};
```

## 类型别名与接口

类型别名和接口都可以定义对象类型，但有一些关键区别：

```typescript
// 类型别名
type Point = {
  x: number;
  y: number;
};

// 接口
interface Point {
  x: number;
  y: number;
}
```

主要区别：
- 接口可以被扩展和实现，类型别名不能
- 类型别名可以为任何类型命名，包括原始类型、联合类型和元组
- 接口可以合并声明，类型别名不能

## 泛型

泛型允许我们创建可重用的组件，这些组件可以适用于多种类型：

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 显式指定类型
let output1 = identity<string>("myString");

// 类型推断
let output2 = identity(42); // 类型为 number
```

### 泛型约束

我们可以限制泛型参数必须包含特定属性：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 现在我们知道 arg 有 length 属性
  return arg;
}

loggingIdentity([1, 2, 3]); // 有效，数组有 length 属性
loggingIdentity("hello"); // 有效，字符串有 length 属性
loggingIdentity(3); // 错误，数字没有 length 属性
```

## 条件类型

条件类型根据类型关系选择一种类型：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

### infer 关键字

`infer` 关键字允许我们从条件类型中推断和提取类型：

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function add(a: number, b: number): number {
  return a + b;
}

type AddReturnType = ReturnType<typeof add>; // number
```

## 映射类型

映射类型基于旧类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Person {
  name: string;
  age: number;
}

type ReadonlyPerson = Readonly<Person>;
// 等价于：
// {
//   readonly name: string;
//   readonly age: number;
// }

type PartialPerson = Partial<Person>;
// 等价于：
// {
//   name?: string;
//   age?: number;
// }
```

### 键重映射

TypeScript 4.1 引入了键重映射特性：

```typescript
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// 等价于：
// {
//   radius: number;
// }
```

## 类型工具

TypeScript 内置了多种实用的类型工具：

### keyof 操作符

`keyof` 获取对象类型的所有键：

```typescript
interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof Person; // 'name' | 'age'
```

### typeof 操作符

在类型上下文中，`typeof` 获取值的类型：

```typescript
const person = {
  name: "张三",
  age: 30
};

type Person = typeof person;
// 等价于：
// {
//   name: string;
//   age: number;
// }
```

### 索引访问类型

使用索引访问类型来查找特定属性的类型：

```typescript
interface Person {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
}

type AddressType = Person["address"]; // { street: string; city: string; }
type CityType = Person["address"]["city"]; // string
```

## 实用类型技术

### 字面量类型

字面量类型代表一个具体的值：

```typescript
type Direction = "north" | "south" | "east" | "west";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function move(direction: Direction, distance: number) {
  // ...
}

move("north", 10); // 有效
move("up", 10);    // 错误：'up' 不是有效的 Direction
```

### 模板字面量类型

TypeScript 4.1 引入了模板字面量类型，与模板字符串类似：

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// 等价于：
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

### 递归类型

递归类型可以引用自身：

```typescript
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const data: JSONValue = {
  name: "张三",
  age: 30,
  isActive: true,
  skills: ["TypeScript", "JavaScript"],
  address: {
    city: "北京",
    postalCode: null
  }
};
```

## 实际应用模式

### 类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number };
  focus: undefined;
  input: { value: string };
};

class EventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(eventName: K, handler: (data: T[K]) => void) {
    // 实现...
  }
  
  emit<K extends keyof T>(eventName: K, data: T[K]) {
    // 实现...
  }
}

const emitter = new EventEmitter<EventMap>();

// 类型安全的事件监听
emitter.on("click", (data) => {
  console.log(data.x, data.y);
});

// 错误：类型不匹配
emitter.emit("click", { value: "test" });

// 正确
emitter.emit("click", { x: 10, y: 20 });
```

### 属性访问器类型

```typescript
function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: "张三",
  age: 30
};

const name = prop(person, "name"); // 类型为 string
const age = prop(person, "age");   // 类型为 number
```

### 类型安全的Redux Actions

```typescript
type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

type AddTodoAction = Action<"ADD_TODO", { text: string }>;
type RemoveTodoAction = Action<"REMOVE_TODO", { id: number }>;
type ToggleTodoAction = Action<"TOGGLE_TODO", { id: number }>;

type TodoActions = AddTodoAction | RemoveTodoAction | ToggleTodoAction;

function reducer(state: any, action: TodoActions) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, { text: action.payload.text }] };
    case "REMOVE_TODO":
      return { ...state, todos: state.todos.filter((todo: any) => todo.id !== action.payload.id) };
    case "TOGGLE_TODO":
      return { ...state, todos: state.todos.map((todo: any) => 
        todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo
      ) };
  }
}
```

## 高级类型挑战

以下是一些高级类型实现的挑战，用于测试你对 TypeScript 类型系统的理解：

### 类型版本的深度对比

```typescript
type DeepEquals<X, Y> = 
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

type A = DeepEquals<{ a: string; b: number }, { a: string; b: number }>; // true
type B = DeepEquals<{ a: string }, { a: string; b: number }>; // false
```

### 字符串操作类型

```typescript
// 移除字符串中的空格
type TrimSpace<S extends string> = S extends ` ${infer R}` 
  ? TrimSpace<R> 
  : S extends `${infer L} ` 
    ? TrimSpace<L> 
    : S;

type Trimmed = TrimSpace<"  Hello World  ">; // "HelloWorld"
```

## 结论

TypeScript 的高级类型系统提供了强大的工具，让我们能够用类型捕获和表达复杂的程序设计。掌握这些高级类型特性和模式，可以帮助你编写更加类型安全和自描述的代码，减少运行时错误，提高代码质量。

随着TypeScript不断发展，我们期待看到更多强大的类型特性，进一步增强JavaScript生态系统的安全性和开发体验。持续学习和实践是掌握TypeScript高级类型的关键，希望本文能为你的TypeScript之旅提供一些有价值的见解。 