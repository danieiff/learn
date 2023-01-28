### Snippets
```ts
type OrderID = string & { readonly brand: unique symbol }
type UserID = string & { readonly brand: unique symbol }
type ID = OrderID | UserID

function isOrderID(id: string): id is OrderID {
  return true
}
const isUserID = (id: string): id is UserID => {
  return true
}

function orderid(id: string): OrderID {
  return id as OrderID
}

function userid(id: string): UserID {
  return id as UserID
}

const id: ID = userid('a7')
```

<script>
- type NonNullable<T> = T extends null | undefined ? never : T;
+ type NonNullable<T> = T & {};


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
      const _exhaustiveCheck: never = shape;
Type 'Triangle' is not assignable to type 'never'.
// assignable: never -> every type, (cannot assign <- way)
      return _exhaustiveCheck;
  }
}
</script>

### Declaration Files
- Folder redirects
package.json
{
  ...
  "typesVersions": { //semver ranges. versions are order-specific(first match will be used??)
    ">=3.1": { "*": ["ts3.1/*"] },  
  }
}
When importing from "package-name", TypeScript will try to resolve from `/node_modules/package-name/ts3.1/index.d.ts` (and other relevant paths). With TypeScript is 3.1, when importing from "package-name/foo", `node_modules/package-name/ts3.1/foo.d.ts` and `/node_modules/package-name/ts3.1/foo/index.d.ts`
No match -> `package.json>types` field or (root)/index.d.ts

- File redirects
"<4.0": { "index.d.ts": ["index.v3.d.ts"] }
>=4.0 -> "./index.d.ts", <4.0 -> "index.v3.d.ts"
<script>
// Object
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;

declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
// Organize types using namespace
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });

declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
  }
}
// or
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
  }
}

declare class Foo {
  constructor(bar: string);
  var1: string;
  method1(): void;
}

// Reusable Types -> not using `declare`
greet({
  greeting: "hello world",
});

interface GreetingSettings { // can be `type` alias
  greeting: string;
  duration?: number;
}

// Global variables (const: read-only,  let: block-scoped)
declare var foo: number;

// Don't separate overloads only for params of passed callback. TS ignores params of passed callback??
declare function beforeAll(action: () => void): void;
declare function beforeAll(action: (done: DoneFn) => void): void;
// Do maximum params for passed callback
declare function beforeAll(action: (done: DoneFn) => void):void

// Sort overloads by specificity because only first match is used 
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: unknown): unknown;

var myElem: HTMLDivElement;
var x = fn(myElem); // x: string, :)

// type for optional arguments
interface Example { // incor. can't pass undefined to optional argument position
  diff(one: string): number;
  diff(one: string, two: string): number;
}
interface Example { // correct in most cases
  diff(one: string, two?: string): number;
}
function fn(x: (a: string, b: number) => void) {}
var x: Example;
// When written with overloads, OK -- used first overload
// When written with optionals, correctly an error
fn(x.diff);

// Don't use `path="..."` instead of `types="..."` in .d.ts
/// <reference types="typescript" />

// When `esModuleInterop` true, `export default` work but with false,  use `export=` like below
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}

</script>

Folder structure of d.ts files in `@types/myLib`: mirror the layout of the library
Test types
- Create a new folder in node_modules/@types/[libname]
- Create an index.d.ts in that folder, and copy the example in
- See where your usage of the module breaks, and start to fill out the index.d.ts
- Clone DefinitelyTyped/DefinitelyTyped and follow the instructions in the README.
or
- Create a new file in the root of your source tree: [libname].d.ts
- Add declare module "[libname]" { }
- Add the template inside the braces of the declare module, and see where your usage breaks

### DOM
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;
const div = document.getElementsByTagName("div")[0];
div.children;
// HTMLCollection(1) [p]
div.childNodes;
// NodeList(2) [p, text]/:

### JSDoc
Generate .d.ts by JSDoc 
- npm i -D typescript
- npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
- (Edit package.json to reference the types)
  - .d.ts file resolution: (package.json) `types`(`typings`) > `main` > index.d.ts file in the root

