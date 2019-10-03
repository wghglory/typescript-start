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

// ------------------------------------------------------------------

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
