# Prototypes, `this`, and Arrow Functions

## Prototypal inheritance

- Every object has an internal `[[Prototype]]` link. Property lookup walks the chain.
- `class` is syntactic sugar: methods go on `ClassName.prototype`; `extends` wires the chain.
- `Object.create(proto)` = direct prototype creation. `instanceof` walks the chain.

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

const dog = new Animal("Rex");
// dog -> Animal.prototype -> Object.prototype -> null
```

## `this` — the 5 bindings (interview staple)

| Call style              | `this` is                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `obj.method()`          | `obj`                                                                              |
| plain `fn()`            | `undefined` (strict) / globalThis                                                  |
| `fn.call/apply/bind(x)` | `x`                                                                                |
| `new Fn()`              | the new instance                                                                   |
| **arrow function**      | **lexical — inherited from enclosing scope at DEFINITION time, cannot be rebound** |

## Arrow vs standard function (the "execution context" question)

- Standard functions get their own `this`, `arguments`, and can be constructors.
- Arrow functions have NO own `this`/`arguments` — they close over the enclosing scope's. `bind/call/apply` cannot change it. Not constructable.
- Why React uses arrows in class components: handlers keep the component instance as `this`.
- Gotcha: arrow as an object method → `this` is NOT the object.

```js
const obj = {
  val: 42,
  arrow: () => this.val, // undefined — lexical `this` is module scope
  normal() {
    return this.val;
  }, // 42
};
```
