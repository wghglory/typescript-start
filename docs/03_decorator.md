# Decorator

## What are decorators?

* Proposed feature for JavaScript
* Declarative programming
* Implemented as function
* Can attached to: Properties, Parameters, Accessors, Methods, Classes

## Decorator syntax

### Simple function decorator

```ts
function uiElement(target: Function) {
  // do ui stuff
}

function deprecated(t: any, p: string, d: PropertyDescriptor) {
  console.log('This method will go away soon.');
}

@uiElement
class ContactForm {
  @deprecated
  someOldMethod() {}
}
```

### decorator factory

```ts
function uiElement(element: string) {
  return function(target: Function) {
    console.log(`Creating new element: ${element}`);
  };
}

@uiElement('SimpleContactForm')
class ContactForm {
  @deprecated
  someOldMethod() {}
}
```

### Class Decorator

* Class constructor will be passed as parameter to decorator
* Constructor is replaced if there is a return value (`TFunction`)
* Return void if constructor is not to be replaced

```ts
<TFunction extends Function>(target: TFunction) => TFunction | void;
```

#### Creating class decorators that replace constructor functions

**Property Decorators**:

* First parameter `target` is either constructor function or class prototype
* Second parameter `propertyKey` is the name of the decorated member

```ts
function MyPropertyDecorator(target: Object, propertyKey: string) {
  // do decorator stuff
}
```

**Parameter Decorators**:

* First parameter is either constructor function or class prototype
* Second parameter is the name of the decorated member
* Third parameter is the ordinal index of the decorated parameter

```ts
function MyParameterDecorator(target: Object, propertyKey: string, parameterIndex: number) {
  // do decorator stuff
}
```

**Property Descriptors**:

* Object that describes a property and how it can be manipulated

```ts
interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any; // “value” property contains the function definition for class methods
  writable?: boolean; // “writable” property specifies if “value” is rea
  get?(): any;
  set?(v: any): void;
}
```

**Method and Accessor Decorators**:

* First parameter is either constructor function or class prototype
* Second parameter is the name of the decorated member
* Third parameter is the property descriptor of the decorated member

```ts
function MyMethodDecorator(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  // do decorator stuff
}
```

---

demo:

```ts
// decorators:

export function sealed(name: string) {
  return function(target: Function): void {
    console.log(`Sealing the constructor: ${name}`);
    Object.seal(target);
    Object.seal(target.prototype);
  };
}

export function logger<TFunction extends Function>(target: TFunction): TFunction {
  let newConstructor: Function = function() {
    console.log(`Creating new instance.`);
    console.log(target);
  };
  newConstructor.prototype = Object.create(target.prototype);
  newConstructor.prototype.constructor = target;
  return <TFunction>newConstructor;
}

export function writable(isWritable: boolean) {
  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`Setting ${propertyKey}.`);
    descriptor.writable = isWritable;
  };
}

// usage:

@logger
@sealed('UniversityLibrarian')
export class UniversityLibrarian implements Interfaces.Librarian, Employee, Researcher {
  name: string;
  email: string;
  department: string;

  assistCustomer(customerName: string) {
    console.log(this.name + ' is assisting ' + customerName);
  }

  @writable(true)
  assistFaculty() {
    console.log('Assisting faculty.');
  }

  // implementation of the following to be provided by the mixing function
  title: string;
  addToSchedule: () => void;
  logTitle: () => void;
  doResearch: (topic: string) => void;
}

@logger
export class PublicLibrarian implements Interfaces.Librarian {
  name: string;
  email: string;
  department: string;

  assistCustomer(customerName: string) {
    console.log('Assisting customer.');
  }

  @writable(false)
  teachCommunity() {
    console.log('Teaching community.');
  }
}

// test decorator:

let lib1 = new UniversityLibrarian();
let lib2 = new PublicLibrarian();

try {
  lib1.assistFaculty = () => console.log('assistFaculty replacement method');
  lib2.teachCommunity = () => console.log('teachCommunity replacement method');
} catch (error) {
  console.log(error.message);
}

lib1.assistFaculty();
lib2.teachCommunity();
```

---

```js
// 类装饰器
function annotationClass(id: number) {
  return (target: Function) => {
    console.log('annotationClass executed', id);
    // console.log(target); // [Function: Example]
  };
}
// 方法装饰器
function annotationMethods(id: number) {
  return (target: Object, property: string, descriptor: PropertyDescriptor) => {
    console.log('annotationMethods executed', id);
    // console.log(target); // Example {}
    // console.log(property); // getData
    // console.log(descriptor); // { value: [Function: getData], writable: true, enumerable: false, configurable: true }
  };
}

@annotationClass(4)
@annotationClass(3)
class Example {
  // method decorator executes earlier than class decorator
  // 同样都是 method/class decorator, 下面更近的执行的早
  @annotationMethods(2)
  @annotationMethods(1)
  getData() {}
}

// 日志应用和切面实现
console.log('日志应用和切面实现.....');
function log(target: Object, name: string, descriptor: PropertyDescriptor) {
  const oldValue = descriptor.value; // [Func: function that log attached]

  // 扩充原方法
  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);
    return oldValue.apply(null, arguments);
  };
  return descriptor;
}
class MathGod {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
const math = new MathGod();
math.add(2, 4);
```
