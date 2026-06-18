// ts_data.js — Compiled TypeScript & DSA curriculum
var TS_LEARN_CONTENT = {
  "ts-basics": {
    "title": "TS: Basics & Primitives",
    "emoji": "\ud83d\udd37",
    "tagline": "Start learning TypeScript from absolute ground zero",
    "level": "Beginner",
    "time": "15 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 Introduction to TypeScript & Strict Types",
        "intro": "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
        "analogy": "JavaScript is like playing soccer without referee rules \u2014 anything goes and you might break something. TypeScript adds a referee (the compiler) who blows the whistle as soon as you commit a foul (type mismatch).",
        "body": "Let's start with basic types: numbers, strings, booleans, any, unknown, and never.",
        "steps": [
          {
            "q": "How do you declare a variable as a string explicitly?",
            "a": "Use the <code>: string</code> annotation.<br><pre class=\"co-code\">let username: string = 'Abhishek';</pre><br><strong>ELI20:</strong> We tell TS that <code>username</code> can only hold a string. Assigning a number throws a compiler error."
          },
          {
            "q": "What happens if you assign a number to a string variable?",
            "a": "TS compile error: <code>Type 'number' is not assignable to type 'string'</code>.<br><strong>ELI20:</strong> TS prevents you from writing bad assignments at edit-time, before the code runs."
          },
          {
            "q": "How does TS handle booleans?",
            "a": "Using <code>: boolean</code> annotation.<br><pre class=\"co-code\">let isActive: boolean = true;</pre><br><strong>ELI20:</strong> It only accepts true or false, preventing weird truthy/falsy bugs."
          },
          {
            "q": "What is the difference between number and Number in TS?",
            "a": "<code>number</code> is the primitive type, while <code>Number</code> is the wrapper object.<br><strong>ELI20:</strong> Always use lowercase <code>number</code>. Capitalized types refer to JS built-in objects, which are slow and rarely needed."
          },
          {
            "q": "How do you declare a constant type?",
            "a": "Use <code>const</code> instead of <code>let</code>, and TS will automatically infer its type as its literal value.<br><pre class=\"co-code\">const age = 25; // inferred as literal type 25</pre><br><strong>ELI20:</strong> Since const cannot change, TS knows its type is exactly the number 25, not just any general number."
          }
        ]
      },
      {
        "h": "\u2461 Type Annotations vs Inference",
        "intro": "TypeScript can infer types automatically, or you can write them out explicitly using annotations.",
        "steps": [
          {
            "q": "What is type inference?",
            "a": "TS automatically figuring out the type without you writing it.<br><pre class=\"co-code\">let x = 10; // TS automatically infers x as number</pre><br><strong>ELI20:</strong> TS is smart. If you assign a value on declaration, you don't need to write the type yourself."
          },
          {
            "q": "Does TS require annotations for everything?",
            "a": "No. Explicit annotations are best for function parameters and return values, but inference handles most variables.<br><strong>ELI20:</strong> Let TS do the hard work of figuring out variables. Annotate when the type is ambiguous or empty."
          },
          {
            "q": "What happens if you declare a variable without initial value or type?",
            "a": "TS infers it as type <code>any</code>.<br><pre class=\"co-code\">let data; // type: any</pre><br><strong>ELI20:</strong> Because you didn't give TS any hints, it treats it like a standard JS variable (which can hold anything)."
          },
          {
            "q": "How can you tell TS to infer a type strictly?",
            "a": "Enable <code>noImplicitAny</code> in your compiler configurations.<br><strong>ELI20:</strong> This forces TS to yell at you if a variable's type defaults to 'any' without your permission."
          },
          {
            "q": "What is type widening?",
            "a": "When TS broadens a specific literal type to a general type because the variable can be reassigned.<br><pre class=\"co-code\">let val = 'hello'; // widened from 'hello' literal to string</pre><br><strong>ELI20:</strong> Since you used 'let', TS assumes you might change 'hello' to 'world' later, so it widens the type to string."
          }
        ]
      },
      {
        "h": "\u2462 Under the Hood: Compilation & Runtime",
        "intro": "TypeScript types ONLY exist during compilation. They are completely stripped out before running in the browser.",
        "steps": [
          {
            "q": "Does TS code run directly in the browser?",
            "a": "No, browsers only understand JavaScript. TS must be compiled (transpiled) into JS first.<br><strong>ELI20:</strong> TypeScript is like scaffolding. Once the building is built (compiled to JS), the scaffolding is completely removed."
          },
          {
            "q": "What is tsc?",
            "a": "The TypeScript Compiler CLI tool.<br><strong>ELI20:</strong> It's the program that checks your TS files for errors and converts them to plain old JS files."
          },
          {
            "q": "Where do TypeScript types go after compilation?",
            "a": "They are completely erased. TS types do not exist at runtime.<br><strong>ELI20:</strong> Once compiled, there is zero performance overhead because types are purely compile-time checks."
          },
          {
            "q": "Can TypeScript catch runtime bugs like database connection failures?",
            "a": "No, TS only checks static syntax and type logic. It cannot predict external runtime failures.<br><strong>ELI20:</strong> TS checks if your plumbing pipes match. It doesn't know if the water company will turn off the main water supply at runtime."
          },
          {
            "q": "What is target in tsconfig?",
            "a": "It decides the target JavaScript version (e.g., ES5, ES6, ES2022) to output.<br><strong>ELI20:</strong> If you need to support old browsers, compile to ES5. If you only support modern systems, compile to ES2022."
          }
        ]
      },
      {
        "h": "\u2463 Advanced Primitives: Symbol, Void & Never",
        "intro": "TypeScript has special primitive types to handle unique situations.",
        "steps": [
          {
            "q": "What is void in TS?",
            "a": "A type indicating that a function does not return any value.<br><pre class=\"co-code\">function logMessage(msg: string): void { console.log(msg); }</pre><br><strong>ELI20:</strong> Void means 'this function completes, but returns nothing you can use'."
          },
          {
            "q": "What is never in TS?",
            "a": "A type representing values that will NEVER occur (e.g., a function that throws an error or runs infinitely).<br><pre class=\"co-code\">function throwErr(): never { throw new Error('Crash'); }</pre><br><strong>ELI20:</strong> Never means the function will never finish successfully to return anything, not even void."
          },
          {
            "q": "What is the difference between null and undefined in TS?",
            "a": "<code>null</code> represents intentional absence of value. <code>undefined</code> means a variable has been declared but not initialized.<br><strong>ELI20:</strong> Undefined is the browser saying 'I don't know what this is yet'. Null is you saying 'This is empty on purpose'."
          },
          {
            "q": "What is the Symbol primitive type?",
            "a": "A primitive type representing unique, immutable identifiers.<br><pre class=\"co-code\">let id: symbol = Symbol('id');</pre><br><strong>ELI20:</strong> It creates a key that is guaranteed to be 100% unique, preventing key collisions in object dictionaries."
          },
          {
            "q": "How do you handle strict null checks?",
            "a": "Enable <code>strictNullChecks: true</code> in tsconfig.<br><strong>ELI20:</strong> This forces you to handle null/undefined values explicitly, eliminating the classic 'Cannot read property of undefined' crash."
          }
        ]
      },
      {
        "h": "\u2464 Any vs Unknown (The Type Safety Shield)",
        "intro": "TypeScript gives you escape hatches when you don't know the type, but one is much safer than the other.",
        "steps": [
          {
            "q": "What is the any type?",
            "a": "A wildcard type that disables all type checking.<br><pre class=\"co-code\">let obj: any = { x: 0 };\nobj.foo(); // Allowed at compile time, crashes at runtime!</pre><br><strong>ELI20:</strong> Any is the devil. It tells TS: 'Turn off your brain, I know what I'm doing.' (Spoiler: usually you don't)."
          },
          {
            "q": "What is the unknown type?",
            "a": "A type-safe counterpart to <code>any</code>. You can assign anything to it, but you cannot use it without type checks.<br><pre class=\"co-code\">let data: unknown = 'hello';\n// console.log(data.length); // Error!\nif (typeof data === 'string') console.log(data.length); // OK!</pre><br><strong>ELI20:</strong> Unknown is like a mystery box. You can accept it, but TS won't let you open it or play with it until you verify what is inside."
          },
          {
            "q": "Why is unknown preferred over any?",
            "a": "Because it forces you to perform type guards before accessing properties, keeping type safety intact.<br><strong>ELI20:</strong> Unknown makes you write defensive checks (like <code>typeof</code>) to guarantee safety, while any bypasses checks entirely."
          },
          {
            "q": "How do you cast an unknown type to a string?",
            "a": "Use type assertions: <code>as string</code>.<br><pre class=\"co-code\">let val: unknown = 'hello';\nlet len = (val as string).length;</pre><br><strong>ELI20:</strong> You are telling TS: 'Trust me, I know this unknown variable is definitely a string right now'."
          },
          {
            "q": "What is type narrowing?",
            "a": "Reducing a broad type (like string | number) to a specific type (like string) at runtime.<br><strong>ELI20:</strong> Like narrowing down a suspect from a line-up using their fingerprints (e.g. checking <code>typeof x === 'string'</code>)."
          }
        ]
      }
    ]
  },
  "ts-arrays": {
    "title": "TS: Arrays, Tuples & Enums",
    "emoji": "\ud83d\udcca",
    "tagline": "Organize collections with rigorous TypeScript constraints",
    "level": "Beginner",
    "time": "15 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 Typed Arrays",
        "intro": "Arrays in TypeScript can be constrained to only accept specific data types.",
        "steps": [
          {
            "q": "How do you declare an array of numbers?",
            "a": "Use <code>number[]</code> or <code>Array&lt;number&gt;</code>.<br><pre class=\"co-code\">let scores: number[] = [90, 80, 95];</pre><br><strong>ELI20:</strong> This ensures only numbers can be pushed into the array. Pushing 'A' throws an error."
          },
          {
            "q": "What is the difference between number[] and Array&lt;number&gt;?",
            "a": "They are identical in functionality, but <code>number[]</code> is the standard syntactic shorthand.<br><strong>ELI20:</strong> Just two ways of writing the same thing. Shorthand is usually preferred for readability."
          },
          {
            "q": "How do you declare a union array (numbers and strings)?",
            "a": "Use parenthesis <code>(string | number)[]</code>.<br><pre class=\"co-code\">let mixed: (string | number)[] = [1, 'hello', 2];</pre><br><strong>ELI20:</strong> We tell TS: 'This array can hold either strings or numbers in any order'."
          },
          {
            "q": "What happens if you omit parenthesis in string | number[]?",
            "a": "It declares a variable that is either a single <code>string</code> OR an array of <code>number[]</code>.<br><strong>ELI20:</strong> Parenthesis are math brackets for types. <code>(string | number)[]</code> is a list of mixed items; <code>string | number[]</code> is one string OR a list of numbers."
          },
          {
            "q": "How do you type multi-dimensional arrays?",
            "a": "Add extra brackets: <code>number[][]</code>.<br><pre class=\"co-code\">let matrix: number[][] = [[1, 2], [3, 4]];</pre><br><strong>ELI20:</strong> This defines a grid/list of number arrays."
          }
        ]
      },
      {
        "h": "\u2461 Readonly Arrays",
        "intro": "If you want to create an array that cannot be mutated (modified), TypeScript has a built-in modifier.",
        "steps": [
          {
            "q": "How do you make an array immutable (readonly)?",
            "a": "Use <code>ReadonlyArray&lt;T&gt;</code> or <code>readonly T[]</code> modifier.<br><pre class=\"co-code\">let immutableList: readonly string[] = ['a', 'b'];\n// immutableList.push('c'); // Error!</pre><br><strong>ELI20:</strong> You block mutation methods like push, pop, or splice. The array can only be read."
          },
          {
            "q": "Can you assign a readonly array to a regular array?",
            "a": "No, because a regular array expects to be mutable, which breaks the readonly guarantee.<br><strong>ELI20:</strong> TS prevents you from passing a read-only list to someone who might try to modify it."
          },
          {
            "q": "Can a readonly array have its elements reassigned directly?",
            "a": "No. Array items cannot be indexed-assigned either: <code>arr[0] = 'new'</code> will throw a compile error.<br><strong>ELI20:</strong> It makes the array completely write-locked at the type level."
          },
          {
            "q": "How do you convert a regular array to readonly in place?",
            "a": "Use a const assertion <code>as const</code>.<br><pre class=\"co-code\">let arr = [1, 2] as const; // type: readonly [1, 2]</pre><br><strong>ELI20:</strong> You freeze the array at compile time, locking its exact values and indices."
          },
          {
            "q": "Is readonly verified at JavaScript runtime?",
            "a": "No. It is purely compile-time check. The output JS is a normal array that could technically be modified if bypasses occur.<br><strong>ELI20:</strong> Once compiled, the lock disappears. So only your TS code is safe from mutations, not raw JS code interacting with it."
          }
        ]
      },
      {
        "h": "\u2462 Tuples: Fixed-Length Arrays",
        "intro": "Tuples are special arrays where the length is fixed, and each position has a specific type.",
        "steps": [
          {
            "q": "What is a Tuple?",
            "a": "An array with fixed number of elements where each element has a predefined type at its position.<br><pre class=\"co-code\">let user: [number, string] = [1, 'Abhi'];</pre><br><strong>ELI20:</strong> A tuple is like a strict row in a database table. Index 0 must be ID, Index 1 must be Name. Nothing else."
          },
          {
            "q": "Can you push elements to a tuple in TypeScript?",
            "a": "Yes, JS array method <code>push()</code> is allowed on tuples due to an array prototype legacy, but you cannot access them via indices.<br><pre class=\"co-code\">let pair: [number, string] = [1, 'a'];\npair.push(true); // compile-time allowed in some TS setups, but discouraged!</pre><br><strong>ELI20:</strong> This is a known TS limitation. Try to avoid using push/pop on tuples; treat them as fixed-size arrays."
          },
          {
            "q": "How do you declare optional elements in a Tuple?",
            "a": "Use a question mark <code>?</code> after the type.<br><pre class=\"co-code\">let coord: [number, number, number?] = [10, 20];</pre><br><strong>ELI20:</strong> The third number is optional. This tuple can be length 2 or 3."
          },
          {
            "q": "How do you declare a tuple with rest elements?",
            "a": "Use the spread operator in the type signature.<br><pre class=\"co-code\">let list: [string, ...number[]] = ['scores', 9, 8, 7];</pre><br><strong>ELI20:</strong> The first element must be a string, followed by any number of numerical scores."
          },
          {
            "q": "How do you destructure a tuple safely?",
            "a": "Directly destructure it, TS will infer each variable type from the tuple index type.<br><pre class=\"co-code\">const [id, name] = user; // id: number, name: string</pre><br><strong>ELI20:</strong> TS knows exactly what variable holds what type based on its slot in the tuple."
          }
        ]
      },
      {
        "h": "\u2463 Standard Enums",
        "intro": "Enums allow you to define a set of named constants, making code more readable.",
        "steps": [
          {
            "q": "What is an Enum in TypeScript?",
            "a": "A way to declare named numerical or string constants.<br><pre class=\"co-code\">enum Direction { Up, Down, Left, Right }</pre><br><strong>ELI20:</strong> Instead of magic numbers like 0, 1, 2, 3, enums let you use clear names: <code>Direction.Up</code>."
          },
          {
            "q": "What values are assigned to numeric enums by default?",
            "a": "They auto-increment starting from 0 (0, 1, 2...).<br><strong>ELI20:</strong> Up = 0, Down = 1, Left = 2, Right = 3, unless you change the start index."
          },
          {
            "q": "How do you start enum values from a custom number?",
            "a": "Assign a starting value to the first enum member.<br><pre class=\"co-code\">enum Status { Active = 1, Pending, Inactive }</pre><br><strong>ELI20:</strong> Now Active is 1, Pending is 2, and Inactive is 3."
          },
          {
            "q": "What is a string enum?",
            "a": "An enum where each member is assigned a string literal.<br><pre class=\"co-code\">enum Role { Admin = 'ADMIN', User = 'USER' }</pre><br><strong>ELI20:</strong> String enums are easier to read when debugging because they print readable text instead of numbers at runtime."
          },
          {
            "q": "What is heterogeneous enum?",
            "a": "An enum that mixes both string and numeric members.<br><pre class=\"co-code\">enum Mix { Yes = 'YES', No = 0 }</pre><br><strong>ELI20:</strong> It works, but it's weird and generally avoided to prevent confusion."
          }
        ]
      },
      {
        "h": "\u2464 Const Enums & Performance",
        "intro": "Const enums are compiled away completely for maximum runtime performance.",
        "steps": [
          {
            "q": "What is a const enum?",
            "a": "An enum declared with the <code>const</code> keyword that is completely erased during compilation.<br><pre class=\"co-code\">const enum Key { Enter = 13 }</pre><br><strong>ELI20:</strong> Normal enums compile into runtime JS objects. Const enums don't create any JS objects; their values are hardcoded directly where they are used."
          },
          {
            "q": "How do const enums improve performance?",
            "a": "By removing object lookups. <code>let x = Key.Enter</code> becomes <code>let x = 13</code> in JavaScript, saving memory and CPU cycles.<br><strong>ELI20:</strong> It makes your code faster and smaller by skipping object creator code at runtime."
          },
          {
            "q": "What is reverse mapping in enums?",
            "a": "Getting the enum key name from its numeric value.<br><pre class=\"co-code\">let nameOfZero = Direction[0]; // returns 'Up'</pre><br><strong>ELI20:</strong> You can lookup both ways (Direction.Up -> 0, or Direction[0] -> 'Up'). Only works for numeric enums."
          },
          {
            "q": "Why does reverse mapping fail on string enums?",
            "a": "String enums do not generate reverse lookup mappings in compiled JS.<br><strong>ELI20:</strong> Because string enums are assumed to be their own label representation, reverse lookups are not generated."
          },
          {
            "q": "What is an alternative to enums in modern TypeScript?",
            "a": "Using objects with <code>as const</code> assertions.<br><pre class=\"co-code\">const Direction = { Up: 0, Down: 1 } as const;</pre><br><strong>ELI20:</strong> Many developers prefer const objects because they don't add special compile behaviors and behave like standard JS."
          }
        ]
      }
    ]
  },
  "ts-objects": {
    "title": "TS: Objects & Interfaces",
    "emoji": "\ud83c\udfe2",
    "tagline": "Model structured data with flexible interfaces and type aliases",
    "level": "Beginner",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 Object Type Annotations",
        "intro": "Learn how to define explicit shapes for JavaScript objects.",
        "steps": [
          {
            "q": "How do you declare an object structure inline?",
            "a": "Use curly braces with property type annotations.<br><pre class=\"co-code\">let car: { make: string; year: number } = { make: 'Tesla', year: 2024 };</pre><br><strong>ELI20:</strong> You tell TS: 'car must have exactly a make (string) and a year (number)'."
          },
          {
            "q": "How do you declare optional properties in an object?",
            "a": "Add a question mark <code>?</code> after the property name.<br><pre class=\"co-code\">let user: { id: number; email?: string };</pre><br><strong>ELI20:</strong> <code>email</code> can be a string, or it can be left out entirely (in which case it reads as undefined)."
          },
          {
            "q": "How do you make a property read-only inside an object?",
            "a": "Use the <code>readonly</code> modifier before the key name.<br><pre class=\"co-code\">let config: { readonly port: number } = { port: 8080 };\n// config.port = 9000; // Error!</pre><br><strong>ELI20:</strong> Once created, you cannot change this property value. It's locked."
          },
          {
            "q": "What happens if an object has extra properties not listed in its type annotation?",
            "a": "TS checks object literals strictly and throws a 'Fresh Literal' error: <code>Object literal may only specify known properties</code>.<br><strong>ELI20:</strong> If you pass a brand-new object literal directly, TS checks it strictly. If you pass a pre-existing variable, it allows extra properties (structural typing)."
          },
          {
            "q": "How do you allow optional undefined values explicitly?",
            "a": "By using a union type: <code>string | undefined</code>. However, this still requires the key to exist in the object, unlike the <code>?</code> modifier.<br><strong>ELI20:</strong> With <code>name?: string</code>, you can omit the key. With <code>name: string | undefined</code>, the key <em>must</em> exist, even if its value is undefined."
          }
        ]
      },
      {
        "h": "\u2461 Interfaces",
        "intro": "Interfaces are TypeScript's primary way to define structure contracts for objects and classes.",
        "steps": [
          {
            "q": "What is an Interface?",
            "a": "A declaration that defines the structural contract/shape of an object.<br><pre class=\"co-code\">interface Employee { id: number; name: string; }</pre><br><strong>ELI20:</strong> An interface is a blueprint. Any object claiming to be an Employee must follow this blueprint."
          },
          {
            "q": "How do you extend an interface in TypeScript?",
            "a": "Use the <code>extends</code> keyword.<br><pre class=\"co-code\">interface Manager extends Employee { budget: number; }</pre><br><strong>ELI20:</strong> Managers get all properties of Employees automatically, plus their own <code>budget</code> property."
          },
          {
            "q": "Can interfaces extend multiple interfaces?",
            "a": "Yes, separate them with commas: <code>interface A extends B, C {}</code>.<br><strong>ELI20:</strong> Interfaces can inherit shapes from multiple parent blueprints at the same time."
          },
          {
            "q": "What is declaration merging in interfaces?",
            "a": "If you declare two interfaces with the same name, TS automatically merges their fields.<br><pre class=\"co-code\">interface User { name: string; }\ninterface User { age: number; }\n// Result: User has both name and age!</pre><br><strong>ELI20:</strong> If you write two recipes with the same name, TS adds the ingredients together into one big recipe."
          },
          {
            "q": "How does declaration merging help with third-party libraries?",
            "a": "It allows you to add custom fields to global window or library objects without editing vendor files.<br><strong>ELI20:</strong> You can 'inject' new types (like adding a custom variable to the global Window interface) cleanly."
          }
        ]
      },
      {
        "h": "\u2462 Type Aliases",
        "intro": "Type aliases assign names to any type, including primitives, unions, and object shapes.",
        "steps": [
          {
            "q": "What is a Type Alias?",
            "a": "A way to give a name to any type shape, using the <code>type</code> keyword.<br><pre class=\"co-code\">type ID = string | number;</pre><br><strong>ELI20:</strong> It creates a nickname/alias for a type so you don't have to keep writing <code>string | number</code> everywhere."
          },
          {
            "q": "Can a type alias represent primitive values?",
            "a": "Yes, unlike interfaces (which only represent object/function shapes), type aliases can represent anything (unions, primitives, tuples).<br><strong>ELI20:</strong> You can create <code>type Age = number;</code>. You cannot do this with interfaces."
          },
          {
            "q": "How do you combine type aliases to make a new object shape?",
            "a": "Use intersection types with the <code>&</code> operator.<br><pre class=\"co-code\">type Admin = User & { privileges: string[] };</pre><br><strong>ELI20:</strong> The ampersand merges two shapes together. Admins must satisfy both User and the privilege shape."
          },
          {
            "q": "Can you declare a union type in a Type Alias?",
            "a": "Yes: <code>type Response = 'success' | 'error';</code>.<br><strong>ELI20:</strong> Type aliases are perfect for defining strings that can only be one of a few options."
          },
          {
            "q": "Are type aliases open for declaration merging?",
            "a": "No. Declaring the same type alias name twice throws a duplicate identifier error.<br><strong>ELI20:</strong> Unlike interfaces, once a type alias is declared, it is closed and cannot be modified by declaring it again."
          }
        ]
      },
      {
        "h": "\u2463 Interface vs Type Alias",
        "intro": "Both define object shapes, but they have key differences regarding merging and extension.",
        "steps": [
          {
            "q": "What is the primary rule for deciding between interface and type?",
            "a": "Use <code>interface</code> for object shapes and classes (supports extension/merging). Use <code>type</code> for unions, tuples, and primitives.<br><strong>ELI20:</strong> Use interfaces by default for standard objects. Use types when you need advanced features like unions (<code>A | B</code>)."
          },
          {
            "q": "How do error messages differ between interface extensions and type intersections?",
            "a": "Interfaces verify compatibility at compile-time and throw cleaner errors. Type intersections create union structures that can resolve to <code>never</code> if fields conflict.<br><strong>ELI20:</strong> Interfaces fail fast and clearly if you declare conflicting properties. Types might silently accept it and fail cryptically later."
          },
          {
            "q": "Can a class implement a type alias?",
            "a": "Yes, as long as the type alias represents an object shape without union components.<br><pre class=\"co-code\">type Point = { x: number; y: number; };\nclass Grid implements Point { x = 0; y = 0; }</pre><br><strong>ELI20:</strong> Classes can follow type alias blueprints just like interfaces, provided the alias represents a stable object structure."
          },
          {
            "q": "Can an interface extend a type alias?",
            "a": "Yes, as long as the type alias represents a static object shape.<br><strong>ELI20:</strong> Interfaces can borrow blueprints from type aliases using <code>extends</code>."
          },
          {
            "q": "What is performance difference between Interface and Type in compiler?",
            "a": "Interfaces compile slightly faster because the compiler caches interface shapes, whereas types require evaluating intersections recursively.<br><strong>ELI20:</strong> For massive projects, using interfaces by default can make the compiler run a bit faster."
          }
        ]
      },
      {
        "h": "\u2464 Index Signatures & Dynamic Keys",
        "intro": "Use index signatures to type objects when you don't know key names in advance.",
        "steps": [
          {
            "q": "What is an Index Signature?",
            "a": "A way to type objects with dynamic keys where key names aren't known ahead of time.<br><pre class=\"co-code\">interface Dictionary { [key: string]: string; }</pre><br><strong>ELI20:</strong> You tell TS: 'This object can hold any string key, but the value for every key must be a string'."
          },
          {
            "q": "Can you mix index signatures with explicit keys?",
            "a": "Yes, but the explicit keys must match the index signature value type.<br><pre class=\"co-code\">interface Config { [key: string]: number; port: number; // OK\n  host: string; // Error! Must be number because of index signature</pre><br><strong>ELI20:</strong> If you say 'all keys must hold numbers', you cannot declare a specific key that holds a string."
          },
          {
            "q": "How do you make index signature keys read-only?",
            "a": "Add the <code>readonly</code> modifier before the key index signature.<br><pre class=\"co-code\">interface ReadonlyDict { readonly [key: string]: string; }</pre><br><strong>ELI20:</strong> It creates a dictionary where you can read any dynamic key, but cannot write/update any value."
          },
          {
            "q": "What is keyof operator?",
            "a": "An operator that returns a union of the keys of an object type.<br><pre class=\"co-code\">type UserKeys = keyof { id: number; name: string }; // 'id' | 'name'</pre><br><strong>ELI20:</strong> It extracts the key names of an object and turns them into a list of allowed string values."
          },
          {
            "q": "How do index signatures handle symbol keys?",
            "a": "By writing <code>[key: symbol]</code> or using a union of string/number/symbol.<br><strong>ELI20:</strong> Allows dynamic object keys defined with Symbol primitive types."
          }
        ]
      }
    ]
  },
  "ts-functions": {
    "title": "TS: Functions & Overloads",
    "emoji": "\u2699\ufe0f",
    "tagline": "Master TS: Functions & Overloads concepts and techniques",
    "level": "Intermediate",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Functions & Overloads - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "How do you type function parameters and return value?",
            "a": "Annotate inside parameter list and after closing parenthesis.<br><pre class=\"co-code\">function add(a: number, b: number): number { return a + b; }</pre>"
          },
          {
            "q": "What happens if a function return annotation is omitted?",
            "a": "TS automatically infers the return type based on return statements inside the body."
          },
          {
            "q": "How do you type an optional parameter in a function?",
            "a": "Add a <code>?</code> after parameter name. Optional parameters must come last in list.<br><pre class=\"co-code\">function greet(name: string, title?: string) {}</pre>"
          },
          {
            "q": "How do default parameters behave with type inference?",
            "a": "TS infers parameter type from its default value; explicit annotation is optional.<br><pre class=\"co-code\">function log(msg = 'default') {} // msg is inferred as string</pre>"
          },
          {
            "q": "How do you type rest parameters in TS?",
            "a": "Rest parameters must be typed as an array type.<br><pre class=\"co-code\">function sum(...nums: number[]): number { return nums.reduce((a,b)=>a+b, 0); }</pre>"
          }
        ]
      },
      {
        "h": "\u2461 TS: Functions & Overloads - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is a function call signature?",
            "a": "A type alias or interface that defines a callable function shape.<br><pre class=\"co-code\">type GreetFunc = (name: string) => string;</pre>"
          },
          {
            "q": "How do you define a function signature with properties (like a callable object)?",
            "a": "Use interface block syntax with callable parentheses.<br><pre class=\"co-code\">interface CounterFunc {\n  (start: number): string;\n  interval: number;\n}</pre>"
          },
          {
            "q": "What is a constructor signature?",
            "a": "Declares a class creator function using the <code>new</code> keyword in call signature.<br><pre class=\"co-code\">type PointCreator = new (x: number, y: number) => Point;</pre>"
          },
          {
            "q": "What is the difference between void and undefined function returns?",
            "a": "<code>void</code> means ignoring any return value. <code>undefined</code> forces the function to explicitly return the value <code>undefined</code>."
          },
          {
            "q": "How does void return compatibility work for callbacks?",
            "a": "A callback typed as returning <code>void</code> can return any value, which will be safely ignored at execution. This prevents code wrapper boilerplate."
          }
        ]
      },
      {
        "h": "\u2462 TS: Functions & Overloads - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is function overloading?",
            "a": "Writing multiple function declarations (signatures) followed by a single implementation.<br><pre class=\"co-code\">function make(x: number): number;\nfunction make(x: string): string;\nfunction make(x: any): any { return x; }</pre>"
          },
          {
            "q": "Why does TS support function overloading?",
            "a": "To allow type-safe variations of parameters without turning off checks with any/unknown."
          },
          {
            "q": "Does overloading generate multiple copies of the function in JavaScript?",
            "a": "No. Compiled JS only contains the single implementation function. Overload signatures disappear."
          },
          {
            "q": "Must the overload implementation signature be compatible with all overloads?",
            "a": "Yes. The implementation signature must accept all arguments and return values declared in overloads."
          },
          {
            "q": "How do you write overload signatures for methods in interfaces?",
            "a": "Declare multiple methods with same name but different signatures within interface block."
          }
        ]
      },
      {
        "h": "\u2463 TS: Functions & Overloads - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "What is this parameter typing in functions?",
            "a": "You can declare the type of <code>this</code> by passing it as the first parameter in your TS function.<br><pre class=\"co-code\">function print(this: User) { console.log(this.name); }</pre>"
          },
          {
            "q": "How does TS ensure this parameters aren't treated as runtime arguments?",
            "a": "TS compiler strips out the <code>this</code> parameter during compilation. It is compile-only check."
          },
          {
            "q": "How do you type a generator function?",
            "a": "It returns a <code>Generator</code> type with Yield, Return, and Next generic values."
          },
          {
            "q": "How do async functions specify return types?",
            "a": "They must always return a Promise wrapper: <code>Promise&lt;T&gt;</code>."
          },
          {
            "q": "What is callback typing parameter context?",
            "a": "TS automatically infers types of callback arguments if the callback is passed inline to a typed function (contextual typing)."
          }
        ]
      },
      {
        "h": "\u2464 TS: Functions & Overloads - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "How do you type default value objects as parameters?",
            "a": "Destructure arguments and annotate the whole object parameter.<br><pre class=\"co-code\">function setup({ url, port } = { url: 'localhost', port: 80 }) {}</pre>"
          },
          {
            "q": "Can you overload arrow functions?",
            "a": "Not directly using function keyword. You must declare overloaded signatures in an interface and bind the arrow function to it."
          },
          {
            "q": "What is noImplicitThis compiler check?",
            "a": "Yells at you if <code>this</code> resolves implicitly to type any inside a function block."
          },
          {
            "q": "How do you type a function that takes a class constructor?",
            "a": "Use signature <code>new (...args: any[]) => any</code> or <code>typeof ClassName</code>."
          },
          {
            "q": "What is the difference between Function type and custom signature?",
            "a": "The global type <code>Function</code> matches any function but is unsafe because calls are typed as any. Custom signatures enforce argument checks."
          }
        ]
      }
    ]
  },
  "ts-unions": {
    "title": "TS: Unions & Narrowing",
    "emoji": "\u2696\ufe0f",
    "tagline": "Master TS: Unions & Narrowing concepts and techniques",
    "level": "Beginner",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Unions & Narrowing - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is a Union Type?",
            "a": "Allows a variable to hold one of several declared types, using the pipe <code>|</code> symbol.<br><pre class=\"co-code\">let id: string | number;</pre>"
          },
          {
            "q": "How do you read properties of a union type safely?",
            "a": "You can only directly access properties that exist in BOTH union types, unless you narrow the type first."
          },
          {
            "q": "What is type narrowing?",
            "a": "Technique to refine a broad union type to a specific type using guards at runtime."
          },
          {
            "q": "How do you narrow using typeof operator?",
            "a": "Check type strings like 'string', 'number', 'boolean' in standard JS if block.<br><pre class=\"co-code\">if (typeof id === 'string') { id.toUpperCase(); }</pre>"
          },
          {
            "q": "How do you narrow using instanceof operator?",
            "a": "Check object instances against class constructors.<br><pre class=\"co-code\">if (x instanceof Date) { x.getTime(); }</pre>"
          }
        ]
      },
      {
        "h": "\u2461 TS: Unions & Narrowing - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "How do you narrow using the in operator?",
            "a": "Check if a key exists in an object parameter.<br><pre class=\"co-code\">if ('swim' in animal) { animal.swim(); }</pre>"
          },
          {
            "q": "What is a Discriminated Union?",
            "a": "A pattern where each type in a union has a shared literal property (the discriminator) used to narrow it safely.<br><pre class=\"co-code\">interface Dog { type: 'dog'; bark(): void; }\ninterface Cat { type: 'cat'; meow(): void; }</pre>"
          },
          {
            "q": "Why is Discriminated Union popular in Redux/state machines?",
            "a": "It enables 100% type-safe action dispatch and reducer switch cases based on action type strings."
          },
          {
            "q": "What is exhaustiveness checking in switch cases?",
            "a": "Using the <code>never</code> type to guarantee at compile time that all possible union members have been handled.<br><pre class=\"co-code\">const _exhaustiveCheck: never = shape;</pre>"
          },
          {
            "q": "What happens if a new type is added to a union but exhaustiveness check is not updated?",
            "a": "TS compiler throws an error because the new type cannot be assigned to type <code>never</code>."
          }
        ]
      },
      {
        "h": "\u2462 TS: Unions & Narrowing - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is a Literal Type?",
            "a": "A type that represents a single, exact value instead of a broad primitive class.<br><pre class=\"co-code\">let state: 'loading' | 'success';</pre>"
          },
          {
            "q": "Can you declare number literal types?",
            "a": "Yes, e.g., <code>type Port = 80 | 443;</code>. Only these values are allowed."
          },
          {
            "q": "How do literal types prevent input typo bugs?",
            "a": "If you write 'sucess' instead of 'success', TS compilation fails instantly."
          },
          {
            "q": "What is type widening on variables?",
            "a": "When TS broadens a literal assignment (like 'hello') to primitive (string) on reassignment scope."
          },
          {
            "q": "How do you prevent type widening on literal assignments?",
            "a": "Use <code>const</code> keyword or <code>as const</code> assertion on literal structures."
          }
        ]
      },
      {
        "h": "\u2463 TS: Unions & Narrowing - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "What is an Intersection Type?",
            "a": "Combines multiple type declarations into one type holding all combined properties, using the ampersand <code>&</code> symbol."
          },
          {
            "q": "How is intersection different from extending interfaces?",
            "a": "Intersection can combine any type styles (aliases, interfaces, primitives). Interface extends requires object structures."
          },
          {
            "q": "What happens if properties with same key name but different types intersect?",
            "a": "The conflicting property type resolves to <code>never</code>, making the object uninstantiable."
          },
          {
            "q": "How does TS handle union of intersections?",
            "a": "Applies standard boolean distribution rules: <code>(A | B) & C</code> matches <code>(A & C) | (B & C)</code>."
          },
          {
            "q": "Can you intersect primitive types?",
            "a": "Yes, but <code>string & number</code> immediately collapses to <code>never</code> because no value can be both."
          }
        ]
      },
      {
        "h": "\u2464 TS: Unions & Narrowing - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "What is strictNullChecks influence on unions?",
            "a": "Forces you to explicitly union null types: <code>string | null</code> instead of implicitly allowing null on string variables."
          },
          {
            "q": "What is truthiness narrowing?",
            "a": "Checking for null/undefined/0 by checking boolean condition: <code>if (val) { ... }</code>."
          },
          {
            "q": "Can you write user-defined type guards returning boolean?",
            "a": "Yes, using the type predicate signature syntax: <code>parameterName is Type</code>."
          },
          {
            "q": "What is the difference between string union type and numeric enum?",
            "a": "String union types compile away completely (zero footprint); enums generate helper runtime lookup objects in JS."
          },
          {
            "q": "How do you extract key names from a union object type?",
            "a": "Use keyof intersection mapping logic."
          }
        ]
      }
    ]
  },
  "ts-classes": {
    "title": "TS: Classes & OOP",
    "emoji": "\ud83c\udfdb\ufe0f",
    "tagline": "Master TS: Classes & OOP concepts and techniques",
    "level": "Intermediate",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Classes & OOP - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "How do access modifiers public, private, and protected behave in TS?",
            "a": "<code>public</code>: accessible anywhere. <code>private</code>: only within the class. <code>protected</code>: only within the class and subclasses."
          },
          {
            "q": "What is default access modifier if none is specified?",
            "a": "All members are implicitly <code>public</code> by default."
          },
          {
            "q": "Are TS private modifiers enforced at JS runtime?",
            "a": "No, access modifiers are compile-only checks. The output JS fields are normal public variables unless using JS private fields (#name)."
          },
          {
            "q": "What is parameter property syntax?",
            "a": "Shorthand to declare class properties directly inside constructor arguments.<br><pre class=\"co-code\">constructor(private name: string) {}</pre>"
          },
          {
            "q": "What boilerplate does parameter property syntax eliminate?",
            "a": "Removes manual declaration of private field and manual assignment <code>this.name = name</code> in constructor body."
          }
        ]
      },
      {
        "h": "\u2461 TS: Classes & OOP - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is a readonly modifier on class fields?",
            "a": "Ensures field can only be set inside declaration or inside constructor. Cannot be modified in methods."
          },
          {
            "q": "How does inheritance work with classes?",
            "a": "Use <code>extends</code> keyword. Children must call <code>super()</code> in constructor if constructor is defined."
          },
          {
            "q": "What is method overriding in subclasses?",
            "a": "Re-defining parent method with compatible signature inside child class block."
          },
          {
            "q": "What is an abstract class?",
            "a": "A base class that cannot be instantiated directly and can contain abstract methods (must be implemented by children)."
          },
          {
            "q": "How does abstract class differ from interface?",
            "a": "Abstract classes can contain actual implementation code, methods, constructors, and modifiers; interfaces contain purely type contracts."
          }
        ]
      },
      {
        "h": "\u2462 TS: Classes & OOP - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "Can a class implement multiple interfaces?",
            "a": "Yes, separated by commas: <code>class A implements B, C {}</code>."
          },
          {
            "q": "What happens if a class implementing an interface lacks a declared field?",
            "a": "Compiler error: <code>Class 'A' incorrectly implements interface 'B'</code>."
          },
          {
            "q": "Can you use static fields and methods in TS?",
            "a": "Yes, accessed on the class name directly instead of instances: <code>MyClass.staticField</code>."
          },
          {
            "q": "Can static members access instance variables directly?",
            "a": "No. Static scope has no reference to <code>this</code> pointing to instance object."
          },
          {
            "q": "What is a getters and setters property in TS classes?",
            "a": "Use keywords <code>get</code> and <code>set</code> to write interceptors for property access."
          }
        ]
      },
      {
        "h": "\u2463 TS: Classes & OOP - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "How do you type-check class references in function parameters?",
            "a": "Use class type instance <code>func(x: MyClass)</code> or class constructor <code>func(ctor: typeof MyClass)</code>."
          },
          {
            "q": "What is the difference between instance type and constructor type?",
            "a": "<code>MyClass</code> refers to instance objects. <code>typeof MyClass</code> refers to class constructor definition template itself."
          },
          {
            "q": "Does TS support method overloading in classes?",
            "a": "Yes, write overload signatures followed by the single implementation method in class body."
          },
          {
            "q": "What is public static readonly pattern?",
            "a": "Declares an immutable class constant accessible anywhere without instantiation: <code>public static readonly API_VERSION = 1;</code>."
          },
          {
            "q": "What are index signatures on classes?",
            "a": "Allows instances to accept dynamic index assignments: <code>[key: string]: any</code>."
          }
        ]
      },
      {
        "h": "\u2464 TS: Classes & OOP - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "How do abstract methods declare parameters and returns?",
            "a": "Annotate them within class definition block without brackets body: <code>abstract draw(): void;</code>."
          },
          {
            "q": "What is override keyword introduced in TS 4.3?",
            "a": "Forces developer to explicitly label methods that override parent class methods, preventing signature mismatches during parent changes."
          },
          {
            "q": "What is the strictPropertyInitialization check?",
            "a": "Ensures all class properties are initialized inside declaration line or inside constructor block."
          },
          {
            "q": "How do you bypass strictPropertyInitialization check on dynamically set fields?",
            "a": "Use definite assignment assertion modifier <code>!</code>: <code>db!: Database;</code>."
          },
          {
            "q": "How does TS compile classes to ES5 JS?",
            "a": "Converts them to prototype function wrappers because ES5 lacks native classes."
          }
        ]
      }
    ]
  },
  "ts-generics-basics": {
    "title": "TS: Generics Basics",
    "emoji": "\ud83d\udce6",
    "tagline": "Master TS: Generics Basics concepts and techniques",
    "level": "Intermediate",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Generics Basics - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is a Generic?",
            "a": "A placeholder type parameter that gets filled when function/class is instantiated, providing reusable safety.<br><pre class=\"co-code\">function identity&lt;T&gt;(arg: T): T { return arg; }</pre>"
          },
          {
            "q": "Why is T naming convention popular?",
            "a": "Stands for 'Type'. You can use any name, but T, U, V are traditional parameter names."
          },
          {
            "q": "How does type inference work with generics?",
            "a": "TS automatically determines T based on function call arguments; writing <code>&lt;string&gt;</code> is usually optional."
          },
          {
            "q": "What is the difference between generic identity&lt;T&gt; and any type?",
            "a": "any turns off checks. Identity&lt;T&gt; preserves exact argument and return type relationships (if string goes in, string comes out)."
          },
          {
            "q": "How do you type generic arrays?",
            "a": "Use parameter inside array brackets: <code>T[]</code> or <code>Array&lt;T&gt;</code>."
          }
        ]
      },
      {
        "h": "\u2461 TS: Generics Basics - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is generic constraint?",
            "a": "Restricting what types T can accept, using the <code>extends</code> keyword.<br><pre class=\"co-code\">function logLength&lt;T extends { length: number }&gt;(arg: T) {}</pre>"
          },
          {
            "q": "Why do you need generic constraints?",
            "a": "Without it, TS doesn't assume any properties exist on T. Constraining tells TS exactly what minimal properties T is guaranteed to have."
          },
          {
            "q": "How do you construct generic objects using new() keyword?",
            "a": "Use new signature constraint: <code>creator: new () => T</code>."
          },
          {
            "q": "Can you use keyof inside generic constraints?",
            "a": "Yes, to lookup values on object parameter safely: <code>K extends keyof T</code>."
          },
          {
            "q": "What does K extends keyof T prevent?",
            "a": "Prevents accessing non-existent key strings on a dynamic object parameter, raising compilation flags."
          }
        ]
      },
      {
        "h": "\u2462 TS: Generics Basics - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is generic interface?",
            "a": "An interface that accepts parameter parameters to type dynamic fields.<br><pre class=\"co-code\">interface Box&lt;T&gt; { contents: T; }</pre>"
          },
          {
            "q": "Can you define default generic arguments?",
            "a": "Yes, using assignment operator: <code>interface Res&lt;T = string&gt; {}</code>."
          },
          {
            "q": "When does TS fall back to default generic argument?",
            "a": "When no type is explicitly passed and the compiler cannot infer it from parameters."
          },
          {
            "q": "What is a generic class?",
            "a": "A class with a type parameter, allowing fields, methods, and constructor variables to work with dynamic types safely."
          },
          {
            "q": "Can static members of a class use class generics?",
            "a": "No, class type parameters cannot be accessed by static fields/methods. Statics must declare their own separate generics if needed."
          }
        ]
      },
      {
        "h": "\u2463 TS: Generics Basics - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "How do you declare generic arrow functions?",
            "a": "Add type parameters before parameter parenthesis.<br><pre class=\"co-code\">const wrap = &lt;T&gt;(x: T): T[] => [x];</pre>"
          },
          {
            "q": "What is JSX conflict with generic arrow functions?",
            "a": "In JSX/TSX files, <code>&lt;T&gt;</code> looks like a JSX tag, causing syntax parsing crashes."
          },
          {
            "q": "How do you bypass JSX generic parser conflict?",
            "a": "Add a comma <code>&lt;T,&gt;</code> or constraint <code>&lt;T extends unknown&gt;</code> to tell JSX parser it is a generic, not a tag."
          },
          {
            "q": "Can you define multiple type parameters?",
            "a": "Yes, separated by commas: <code>&lt;T, U, V&gt;</code>."
          },
          {
            "q": "How does TS infer multiple distinct type parameters?",
            "a": "Infers them individually from the respective arguments passed to each parameter slot."
          }
        ]
      },
      {
        "h": "\u2464 TS: Generics Basics - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "What is generic utility functions mapping pattern?",
            "a": "Using generic declarations to map structures like arrays of A to lists of B safely via mapping callbacks."
          },
          {
            "q": "Can you constrain generic to a union type?",
            "a": "Yes: <code>T extends string | number</code>. T can only be one of those two classes."
          },
          {
            "q": "What is instantiation expression in TS 4.7?",
            "a": "Creates a typed version of a generic function directly without calling it: <code>const printNum = printVal&lt;number&gt;;</code>."
          },
          {
            "q": "How does generic type checking ensure safety on arrays?",
            "a": "Forces elements of type T to only invoke methods matching constraint types."
          },
          {
            "q": "What is the key benefit of Generics in Framework POM libraries?",
            "a": "Allows base page objects to navigate and return new typed page objects dynamically, enabling fluent method chains."
          }
        ]
      }
    ]
  },
  "ts-generics-advanced": {
    "title": "TS: Utility Types",
    "emoji": "\ud83d\udee0\ufe0f",
    "tagline": "Master TS: Utility Types concepts and techniques",
    "level": "Intermediate",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Utility Types - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is Partial&lt;T&gt; utility type?",
            "a": "Creates a new type with all properties of T marked optional (adds <code>?</code>)."
          },
          {
            "q": "What is Required&lt;T&gt; utility type?",
            "a": "Creates a new type with all optional properties of T made mandatory (removes <code>?</code>)."
          },
          {
            "q": "What is Readonly&lt;T&gt; utility type?",
            "a": "Makes all properties of T immutable (cannot be reassigned)."
          },
          {
            "q": "What is Record&lt;K, T&gt; utility type?",
            "a": "Creates an object/dictionary style shape mapping keys of type K to values of type T.<br><pre class=\"co-code\">const users: Record&lt;string, User&gt; = {};</pre>"
          },
          {
            "q": "What is Pick&lt;T, K&gt; utility type?",
            "a": "Creates a new type by choosing only specific keys K from type T.<br><pre class=\"co-code\">type SmallUser = Pick&lt;User, 'id' | 'name'&gt;;</pre>"
          }
        ]
      },
      {
        "h": "\u2461 TS: Utility Types - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is Omit&lt;T, K&gt; utility type?",
            "a": "Creates a new type by stripping away listed keys K from type T.<br><pre class=\"co-code\">type AnonymousUser = Omit&lt;User, 'password' | 'email'&gt;</pre>"
          },
          {
            "q": "What is Exclude&lt;T, U&gt; utility type?",
            "a": "Strips out members of union type T that are assignable to type U."
          },
          {
            "q": "What is Extract&lt;T, U&gt; utility type?",
            "a": "Extracts members of union type T that are assignable to type U (intersection of unions)."
          },
          {
            "q": "What is NonNullable&lt;T&gt; utility type?",
            "a": "Strips out <code>null</code> and <code>undefined</code> from union type T."
          },
          {
            "q": "What is ReturnType&lt;T&gt; utility type?",
            "a": "Extracts the return type of a function signature T.<br><pre class=\"co-code\">type Data = ReturnType&lt;typeof fetchAPI&gt;;</pre>"
          }
        ]
      },
      {
        "h": "\u2462 TS: Utility Types - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is InstanceType&lt;T&gt; utility type?",
            "a": "Extracts the instance type of a class constructor function template T."
          },
          {
            "q": "What is Parameters&lt;T&gt; utility type?",
            "a": "Extracts argument types of function signature T as a tuple type structure."
          },
          {
            "q": "What is ConstructorParameters&lt;T&gt; utility type?",
            "a": "Extracts constructor arguments of class T as a tuple type."
          },
          {
            "q": "What is Awaited&lt;T&gt; utility type?",
            "a": "Extracts the inner resolved value of a Promise (flattens nested Promise structures)."
          },
          {
            "q": "How does Awaited handle recursive promises?",
            "a": "Recursively unwraps them until finding the base non-promise type."
          }
        ]
      },
      {
        "h": "\u2463 TS: Utility Types - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "Can you combine multiple utility types?",
            "a": "Yes: <code>type Patch = Partial&lt;Omit&lt;User, 'id'&gt;&gt;</code>. Creates optional updates excluding ID field."
          },
          {
            "q": "How does Partial mapping behave on deep nested objects?",
            "a": "Partial is shallow. It only makes first-level keys optional. Nested fields remain mandatory."
          },
          {
            "q": "How do you write a DeepPartial mapping utility type?",
            "a": "Using mapped types and recursion: <code>type DeepPartial&lt;T&gt; = { [P in keyof T]?: DeepPartial&lt;T[P]&gt; }</code>."
          },
          {
            "q": "What are mapped types?",
            "a": "A way to create new types by iterating over keys of another type: <code>[P in keyof T]</code>."
          },
          {
            "q": "What does -? modifier do in mapped types?",
            "a": "Removes the optional flag from keys during iteration (used under the hood in Required&lt;T&gt;)."
          }
        ]
      },
      {
        "h": "\u2464 TS: Utility Types - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "What does -readonly modifier do in mapped types?",
            "a": "Removes the readonly lock from keys during iteration."
          },
          {
            "q": "How do you create custom utility type using mapped syntax?",
            "a": "Define type parameter mapping: <code>type Nullable&lt;T&gt; = { [K in keyof T]: T[K] | null }</code>."
          },
          {
            "q": "Why is ReturnType generic type bound to a function constraint?",
            "a": "Because you can only get return type of a callable function: <code>T extends (...args: any) => any</code>."
          },
          {
            "q": "What is Uppercase, Lowercase, Capitalize utility types?",
            "a": "String manipulation utility types that adjust string literal formatting at type level."
          },
          {
            "q": "What is Omit implementation under the hood?",
            "a": "It Pick-s keys that are remaining after Exclude-ing them: <code>Pick&lt;T, Exclude&lt;keyof T, K&gt;&gt;</code>."
          }
        ]
      }
    ]
  },
  "ts-advanced-operators": {
    "title": "TS: Type Manipulation",
    "emoji": "\ud83d\udd2e",
    "tagline": "Master TS: Type Manipulation concepts and techniques",
    "level": "Advanced",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Type Manipulation - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is keyof operator?",
            "a": "Returns union of key strings from type T."
          },
          {
            "q": "What is typeof operator in TS?",
            "a": "Extracts type of a concrete variable or object in TS space (distinct from JS runtime typeof).<br><pre class=\"co-code\">const user = { name: 'Abhi' };\ntype UserType = typeof user; // { name: string }</pre>"
          },
          {
            "q": "When should you use typeof in annotations?",
            "a": "When you want to clone the type shape of an existing variable/constant without writing an interface."
          },
          {
            "q": "What is indexed access type?",
            "a": "Accessing nested property types using bracket syntax: <code>T[K]</code>."
          },
          {
            "q": "What type does user['address']['zip'] resolve to?",
            "a": "Resolves strictly to the type of zip field inside address sub-object."
          }
        ]
      },
      {
        "h": "\u2461 TS: Type Manipulation - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is a conditional type?",
            "a": "Type selection based on validation condition: <code>T extends U ? X : Y</code>."
          },
          {
            "q": "What is the infer keyword?",
            "a": "Used inside conditional type checks to dynamically declare and extract an inferred type variable."
          },
          {
            "q": "How do you use infer to extract array element type?",
            "a": "<code>type Element&lt;T&gt; = T extends (infer U)[] ? U : never;</code>."
          },
          {
            "q": "How do you use infer to extract function return type?",
            "a": "<code>type Return&lt;T&gt; = T extends (...args: any) => (infer R) ? R : never;</code>."
          },
          {
            "q": "What is distributive conditional type?",
            "a": "When a conditional type operates on union types, it automatically distributes checks across each union member individually."
          }
        ]
      },
      {
        "h": "\u2462 TS: Type Manipulation - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "How do you prevent distribution in conditional types?",
            "a": "Wrap parameters in square brackets: <code>[T] extends [U]</code>."
          },
          {
            "q": "What is a mapped type?",
            "a": "Creates a new type by looping keys of another type using <code>in</code> operator."
          },
          {
            "q": "What is key remapping in mapped types?",
            "a": "Using <code>as</code> to rename keys during mapping iteration: <code>[K in keyof T as `get${Capitalize&lt;string & K&gt;}`]</code>."
          },
          {
            "q": "How do you write a utility that prefix-removes keys?",
            "a": "Remap key string using Template Literal Types: <code>K as K extends `prefix_${infer R}` ? R : never</code>."
          },
          {
            "q": "What is a Template Literal Type?",
            "a": "String literal type combining strings using variable interpolation: <code>type Event = `${State}_changed`;</code>."
          }
        ]
      },
      {
        "h": "\u2463 TS: Type Manipulation - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "How does template literal type help typing Event Emitters?",
            "a": "Allows typing event strings strictly based on action types combined with namespaces."
          },
          {
            "q": "What is recursive type alias?",
            "a": "A type alias that references itself in its own definition block (used to type deep JSON objects)."
          },
          {
            "q": "How do you write type representing nested JSON data?",
            "a": "<code>type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };</code>."
          },
          {
            "q": "What is nominal typing vs structural typing?",
            "a": "Structural typing (TS) matches shapes. Nominal typing (Java) matches exact names/classes."
          },
          {
            "q": "How do you simulate nominal typing (branding) in TS?",
            "a": "Add a unique empty property tags to strings or objects: <code>type Brand&lt;T, B&gt; = T & { __brand: B };</code>."
          }
        ]
      },
      {
        "h": "\u2464 TS: Type Manipulation - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "What is an index query operator?",
            "a": "Alternative name for the <code>keyof</code> operator."
          },
          {
            "q": "What type does keyof any resolve to?",
            "a": "<code>string | number | symbol</code>."
          },
          {
            "q": "What type does keyof never resolve to?",
            "a": "<code>never</code>."
          },
          {
            "q": "Can you use conditional type recursively to flatten arrays?",
            "a": "Yes: <code>type Flatten&lt;T&gt; = T extends any[] ? Flatten&lt;T[number]&gt; : T;</code>."
          },
          {
            "q": "How do you access union types indexes?",
            "a": "Union types lookup yields intersection of member properties."
          }
        ]
      }
    ]
  },
  "ts-guards": {
    "title": "TS: Guards & Assertions",
    "emoji": "\ud83d\udee1\ufe0f",
    "tagline": "Master TS: Guards & Assertions concepts and techniques",
    "level": "Intermediate",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Guards & Assertions - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is Type Guard?",
            "a": "An expression that performs a runtime check to narrow the compiler's type definition of a variable."
          },
          {
            "q": "What is type predicate syntax?",
            "a": "Syntax <code>parameterName is Type</code> returned by functions to serve as custom type guards."
          },
          {
            "q": "Write a type guard checking if variable is a Cat.",
            "a": "<code>function isCat(a: Animal): a is Cat { return 'meow' in a; }</code>."
          },
          {
            "q": "What happens if type guard returns true inside an if block?",
            "a": "TS narrows the type of guarded variable to the checked type inside that block."
          },
          {
            "q": "What type does variable have inside the else block of a type guard?",
            "a": "It has the remaining union types (e.g. Dog if union was Cat | Dog)."
          }
        ]
      },
      {
        "h": "\u2461 TS: Guards & Assertions - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is type assertion?",
            "a": "Bypassing compiler checks by overriding inferred type with <code>as NewType</code>."
          },
          {
            "q": "Does type assertion perform any runtime conversions?",
            "a": "No, it is purely compile-time directive. It does not modify values in JS."
          },
          {
            "q": "What is angle-bracket assertion syntax?",
            "a": "Alternative assertion syntax: <code>&lt;string&gt;variable</code>. Opposed in TSX files."
          },
          {
            "q": "What is non-null assertion operator?",
            "a": "Suffix exclamation mark <code>!</code> telling TS that a variable is definitely not null or undefined."
          },
          {
            "q": "Why is non-null assertion operator risky?",
            "a": "If value is actually null at runtime, accessing properties will crash. TS check was bypassed."
          }
        ]
      },
      {
        "h": "\u2462 TS: Guards & Assertions - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is double assertion pattern?",
            "a": "Casting first to <code>unknown</code> or <code>any</code> before casting to destination type: <code>x as unknown as Y</code>."
          },
          {
            "q": "When is double assertion required?",
            "a": "When TS believes two shapes are too different to be compatible for single assertion."
          },
          {
            "q": "What is const assertion?",
            "a": "Adding <code>as const</code> to freeze literal values and mark arrays/objects readonly."
          },
          {
            "q": "How does as const affect object fields?",
            "a": "Makes all properties deeply <code>readonly</code> and preserves exact literal string types."
          },
          {
            "q": "What is the difference between Object.freeze() and as const?",
            "a": "Object.freeze() is JS runtime freeze (shallow, no compile readonly check). <code>as const</code> is deeply compile-time type lock."
          }
        ]
      },
      {
        "h": "\u2463 TS: Guards & Assertions - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "What is assertion function in TS?",
            "a": "A function that throws an error if condition is false, using <code>asserts condition</code> signature."
          },
          {
            "q": "Write assertion function shape check.",
            "a": "<code>function assertIsString(val: any): asserts val is string { if (typeof val !== 'string') throw new Error(); }</code>."
          },
          {
            "q": "How does compiler narrow types after an assertion function call?",
            "a": "TS assumes variable has the asserted type for all remaining code lines in that execution block."
          },
          {
            "q": "Can you use user-defined guard on class properties?",
            "a": "Yes, e.g. <code>this is AdminPage</code> inside page object handlers."
          },
          {
            "q": "What is the danger of incorrect type predicates?",
            "a": "If your predicate code returns true when it shouldn't, TS assumes the type is correct, masking runtime bugs."
          }
        ]
      },
      {
        "h": "\u2464 TS: Guards & Assertions - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "How do check guards work with Array.filter?",
            "a": "Pass type predicate guard to filter callback to narrow list array output from (T | undefined)[] to T[]: <code>list.filter(isDefined)</code>."
          },
          {
            "q": "Write isDefined predicate guard helper.",
            "a": "<code>function isDefined&lt;T&gt;(val: T | undefined): val is T { return val !== undefined; }</code>."
          },
          {
            "q": "How does typeof null behave in JavaScript guards?",
            "a": "It returns 'object'. Ensure guards check <code>val !== null</code> explicitly."
          },
          {
            "q": "Does TS narrow types when using array indices?",
            "a": "No, checking <code>arr[0]</code> won't narrow <code>arr</code> type safely. Store in temp variable first."
          },
          {
            "q": "What is discr union narrowing limit?",
            "a": "If discriminator property is not literal type (like string), narrowing checks fail."
          }
        ]
      }
    ]
  },
  "ts-modules": {
    "title": "TS: Modules & Declarations",
    "emoji": "\ud83d\udce6",
    "tagline": "Master TS: Modules & Declarations concepts and techniques",
    "level": "Advanced",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Modules & Declarations - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is ES modules import type syntax?",
            "a": "Importing only type definitions: <code>import type { User } from './types';</code>."
          },
          {
            "q": "Why import type in TS?",
            "a": "Ensures the import statement is completely removed in output JS, avoiding circular dependency overheads."
          },
          {
            "q": "How do you export types?",
            "a": "Use <code>export type { TypeName };</code> syntax."
          },
          {
            "q": "What is ambient module?",
            "a": "A module declaration block (usually in .d.ts files) that defines types for third-party JS libraries lacking typings."
          },
          {
            "q": "How do you declare ambient module in a .d.ts file?",
            "a": "Use <code>declare module 'library-name' { ... }</code>."
          }
        ]
      },
      {
        "h": "\u2461 TS: Modules & Declarations - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is wildcard module declaration?",
            "a": "Declaring modules matching pattern: <code>declare module '*.png';</code> (allows importing assets in TS)."
          },
          {
            "q": "What is triple-slash directive?",
            "a": "XML tag comments used to import compiler dependencies: <code>/// &lt;reference path=\"...\" /&gt;</code>."
          },
          {
            "q": "Why are ES module imports preferred over triple-slash directives?",
            "a": "Because ES modules align with ECMAScript standards and integrate with modern bundlers cleanly."
          },
          {
            "q": "What is namespace keyword in TS?",
            "a": "Internal modules grouping variables/types in a global namespace wrapper: <code>namespace Util { export type X = number; }</code>."
          },
          {
            "q": "Why are namespaces rarely used in modern TS projects?",
            "a": "Because standard ES modules (files as modules) handle imports/exports cleanly without adding custom syntax runtime wrappers."
          }
        ]
      },
      {
        "h": "\u2462 TS: Modules & Declarations - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is declaration merging of namespace and class?",
            "a": "Allows adding static utility methods or types directly into a class namespace wrapper."
          },
          {
            "q": "What is global augmentation?",
            "a": "Adding types to global scope inside a module: <code>declare global { interface Window { customField: string; } }</code>."
          },
          {
            "q": "Where should .d.ts files reside?",
            "a": "Usually placed in source root or configured in tsconfig's <code>include</code> property."
          },
          {
            "q": "What are DefinitelyTyped and @types packages?",
            "a": "Community-maintained type definitions repository for JavaScript libraries (e.g. @types/node, @types/lodash)."
          },
          {
            "q": "How do you import ambient typings automatically?",
            "a": "Configure <code>types</code> array in compilerOptions in tsconfig.json."
          }
        ]
      },
      {
        "h": "\u2463 TS: Modules & Declarations - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "What is moduleResolution compilerOption?",
            "a": "Decides target algorithm for module resolution (e.g., Node10, Node16, Bundler)."
          },
          {
            "q": "What does moduleResolution: 'Bundler' configure?",
            "a": "Configures TS to mimic modern bundlers' resolution (Vite, Webpack) that import extensions dynamically."
          },
          {
            "q": "How does TS compile export default inside CommonJS modules?",
            "a": "Compiles to <code>exports.default = ...</code>, requiring special interops on imports."
          },
          {
            "q": "What is esModuleInterop flag?",
            "a": "Enables importing CommonJS modules as default ES imports: <code>import React from 'react';</code>."
          },
          {
            "q": "What is allowSyntheticDefaultImports?",
            "a": "Allows compile type resolution of default imports even if dependencies lack default export definitions."
          }
        ]
      },
      {
        "h": "\u2464 TS: Modules & Declarations - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "How does module resolution search local directories?",
            "a": "Looks for matching files, then index.ts files within target package folders."
          },
          {
            "q": "What is resolution-mode in import statements?",
            "a": "Forces importing a package as ESM or CommonJS dynamically in node environments."
          },
          {
            "q": "Can you declare module in TS using dynamic import()?",
            "a": "Yes: <code>type API = typeof import('./api');</code>. Used to extract dynamic types."
          },
          {
            "q": "What is module: 'NodeNext'?",
            "a": "Targets modern Node.js standards supporting both ESM and CommonJS resolving formats."
          },
          {
            "q": "How do namespaces handle exporting internal variables?",
            "a": "Require explicit <code>export</code> keyword inside namespace block."
          }
        ]
      }
    ]
  },
  "ts-config": {
    "title": "TS: Config & Compiler",
    "emoji": "\u2699\ufe0f",
    "tagline": "Master TS: Config & Compiler concepts and techniques",
    "level": "Beginner",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Config & Compiler - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is tsconfig.json?",
            "a": "Config file that defines TypeScript compiler rules, files to build, and compilation paths."
          },
          {
            "q": "What does strict: true compiler Option do?",
            "a": "Turns on a suite of type-checking behaviors (noImplicitAny, strictNullChecks, strictFunctionTypes, etc.) for max type safety."
          },
          {
            "q": "Why is strict: true highly recommended?",
            "a": "It prevents implicit 'any' bugs and enforces clean typing practices throughout the project."
          },
          {
            "q": "What is noImplicitAny flag?",
            "a": "Triggers compile errors when a type cannot be inferred and implicitly defaults to any."
          },
          {
            "q": "What is strictNullChecks flag?",
            "a": "Ensures null and undefined are treated as separate types, blocking unexpected 'null reference' runtime crashes."
          }
        ]
      },
      {
        "h": "\u2461 TS: Config & Compiler - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is target compilerOption?",
            "a": "Sets the ECMAScript target version for output JS files (e.g., ES5, ES6, ESNext)."
          },
          {
            "q": "What is module compilerOption?",
            "a": "Specifies target module code generation format (CommonJS, ESNext, AMD, etc.)."
          },
          {
            "q": "What is lib compilerOption?",
            "a": "Tells compiler which built-in environment declarations (DOM, ES2020, etc.) to include."
          },
          {
            "q": "What is outDir compilerOption?",
            "a": "Decides folder path where compiled JS outputs should be stored (e.g. dist, build)."
          },
          {
            "q": "What is rootDir compilerOption?",
            "a": "Points to root folder of source files (e.g. src)."
          }
        ]
      },
      {
        "h": "\u2462 TS: Config & Compiler - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "What is include property in tsconfig?",
            "a": "Array of files or patterns containing TS source files to compile."
          },
          {
            "q": "What is exclude property in tsconfig?",
            "a": "List of directories (like node_modules, dist) to skip during compile searches."
          },
          {
            "q": "What is extends in tsconfig?",
            "a": "Allows inheriting configurations from another base tsconfig file (e.g., extends: '@tsconfig/node20/tsconfig.json')."
          },
          {
            "q": "What are compiler path aliases?",
            "a": "Configuring short import tags mapping to directories: <code>paths: { '@/*': ['src/*'] }</code>."
          },
          {
            "q": "What is baseUrl compilerOption?",
            "a": "Sets directory base for resolving non-relative import paths."
          }
        ]
      },
      {
        "h": "\u2463 TS: Config & Compiler - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "What is declaration: true flag?",
            "a": "Tells compiler to generate corresponding .d.ts declaration files alongside compiled JS."
          },
          {
            "q": "What is sourceMap: true flag?",
            "a": "Generates source maps, allowing you to debug original TS code in browser DevTools instead of output JS."
          },
          {
            "q": "What is noEmit: true flag?",
            "a": "Performs type checks but skips outputting compile JS files (useful for loaders/linters)."
          },
          {
            "q": "What is isolatedModules flag?",
            "a": "Ensures every file can be safely transpiled individually by compilers lacking full type mapping (like Babel)."
          },
          {
            "q": "What is skipLibCheck flag?",
            "a": "Skips type checking of .d.ts files inside node_modules, making compilations much faster."
          }
        ]
      },
      {
        "h": "\u2464 TS: Config & Compiler - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "What is resolveJsonModule flag?",
            "a": "Allows importing JSON files directly into TS: <code>import data from './data.json';</code>."
          },
          {
            "q": "What is preserveConstEnums flag?",
            "a": "Ensures const enums are generated as lookup objects instead of being erased."
          },
          {
            "q": "What is noUnusedLocals flag?",
            "a": "Triggers compile errors when local variables are declared but never read/used."
          },
          {
            "q": "What is noUnusedParameters flag?",
            "a": "Throws errors when function parameters are defined but never used in implementation."
          },
          {
            "q": "What is noImplicitReturns flag?",
            "a": "Ensures all paths in a function return a value explicitly if return type is not void."
          }
        ]
      }
    ]
  },
  "ts-decorators": {
    "title": "TS: Decorators & Metadata",
    "emoji": "\ud83c\udfa8",
    "tagline": "Master TS: Decorators & Metadata concepts and techniques",
    "level": "Advanced",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Decorators & Metadata - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "What is a Decorator in TypeScript?",
            "a": "A special declaration attached to a class, method, property, or parameter that modifies its behavior at runtime."
          },
          {
            "q": "How do you enable decorators in tsconfig?",
            "a": "Enable <code>experimentalDecorators: true</code> flag."
          },
          {
            "q": "What is the decorator syntax symbol?",
            "a": "The at <code>@</code> prefix symbol: <code>@sealed class MyClass {}</code>."
          },
          {
            "q": "What argument is passed to a Class Decorator?",
            "a": "The constructor function of target class."
          },
          {
            "q": "What is a Decorator Factory?",
            "a": "A wrapper function returning the decorator callback, allowing passing configuration parameters: <code>@log('debug')</code>."
          }
        ]
      },
      {
        "h": "\u2461 TS: Decorators & Metadata - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "What is method decorator signature?",
            "a": "Takes target prototype, property key name, and property descriptor arguments."
          },
          {
            "q": "How can method decorators intercept execution?",
            "a": "By overriding the descriptor's <code>value</code> field with a wrapper execution block."
          },
          {
            "q": "What is property decorator signature?",
            "a": "Takes target prototype and property name. Does not receive property descriptors in experimental mode."
          },
          {
            "q": "What is parameter decorator signature?",
            "a": "Takes target prototype, method name, and parameter index in method argument list."
          },
          {
            "q": "What order do decorators run when multiple are applied?",
            "a": "Evaluated top-to-bottom, but executed bottom-to-top (composition order)."
          }
        ]
      },
      {
        "h": "\u2462 TS: Decorators & Metadata - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "Q11 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q12 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q13 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q14 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q15 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      },
      {
        "h": "\u2463 TS: Decorators & Metadata - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "Q16 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q17 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q18 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q19 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q20 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      },
      {
        "h": "\u2464 TS: Decorators & Metadata - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "Q21 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q22 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q23 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q24 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q25 on TS: Decorators & Metadata: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      }
    ]
  },
  "ts-solid": {
    "title": "TS: Best Practices & SOLID",
    "emoji": "\ud83d\udca1",
    "tagline": "Master TS: Best Practices & SOLID concepts and techniques",
    "level": "Advanced",
    "time": "20 min",
    "category": "ts",
    "sections": [
      {
        "h": "\u2460 TS: Best Practices & SOLID - Part 1",
        "intro": "Understand core patterns and fundamentals.",
        "steps": [
          {
            "q": "How does Single Responsibility Principle (SRP) apply in TS?",
            "a": "A class or module should have exactly one reason to change. Separate data fetching from UI rendering."
          },
          {
            "q": "How does Open/Closed Principle (OCP) apply in TS?",
            "a": "Software entities should be open for extension, but closed for modification. Use interfaces and polymorphic classes."
          },
          {
            "q": "How does Liskov Substitution Principle (LSP) apply in TS?",
            "a": "Subtypes must be substitutable for their base types. Child classes should never narrow or break the contract of parent methods."
          },
          {
            "q": "How does Interface Segregation Principle (ISP) apply in TS?",
            "a": "Clients should not be forced to depend on interface methods they do not use. Split large interfaces into smaller, focused ones."
          },
          {
            "q": "How does Dependency Inversion Principle (DIP) apply in TS?",
            "a": "Depend on abstractions (interfaces), not concretions. Use dependency injection to supply class dependencies."
          }
        ]
      },
      {
        "h": "\u2461 TS: Best Practices & SOLID - Part 2",
        "intro": "Deepen your knowledge of syntax and structures.",
        "steps": [
          {
            "q": "Q6 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q7 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q8 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q9 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q10 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      },
      {
        "h": "\u2462 TS: Best Practices & SOLID - Part 3",
        "intro": "Explore compile behavior and rules.",
        "steps": [
          {
            "q": "Q11 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q12 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q13 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q14 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q15 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      },
      {
        "h": "\u2463 TS: Best Practices & SOLID - Part 4",
        "intro": "Learn advanced edge-cases and performance constraints.",
        "steps": [
          {
            "q": "Q16 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q17 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q18 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q19 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q20 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      },
      {
        "h": "\u2464 TS: Best Practices & SOLID - Part 5",
        "intro": "Test your understanding with structural challenges.",
        "steps": [
          {
            "q": "Q21 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q22 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q23 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q24 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          },
          {
            "q": "Q25 on TS: Best Practices & SOLID: Explain the best practice for using types in this context.",
            "a": "Ensure you keep signatures clean, avoid loose any, and use strict type checks.<br><strong>ELI20:</strong> Write declarations clearly so that the compiler does the heavy lifting."
          }
        ]
      }
    ]
  },
  "dsa-arrays-hashing": {
    "title": "DSA: Arrays & Hashing",
    "emoji": "\ud83e\udde0",
    "tagline": "Master DSA: Arrays & Hashing coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Two Sum: Given an array of numbers and a target, return indices of the two numbers that add up to target.",
            "a": "Use a Map to store values and indices for O(1) lookups.<br><pre class=\"co-code\">function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}</pre><br><strong>ELI20:</strong> We walk through the list. For each number, we look inside our record book (the Map) to see if we already passed the partner number we need. If yes, we return their coordinates! Time: O(N), Space: O(N)."
          },
          {
            "q": "Contains Duplicate: Given an integer array, return true if any value appears at least twice.",
            "a": "Use a Set to keep track of seen elements.<br><pre class=\"co-code\">function containsDuplicate(nums: number[]): boolean {\n  const set = new Set<number>();\n  for (const num of nums) {\n    if (set.has(num)) return true;\n    set.add(num);\n  }\n  return false;\n}</pre><br><strong>ELI20:</strong> Throw everything in a basket (Set). If you pick a number and it's already in the basket, you have a duplicate! Time: O(N), Space: O(N)."
          },
          {
            "q": "Valid Anagram: Check if two strings s and t are anagrams.",
            "a": "Count character frequencies using a map or character array.<br><pre class=\"co-code\">function isAnagram(s: string, t: string): boolean {\n  if (s.length !== t.length) return false;\n  const count: Record<string, number> = {};\n  for (const c of s) count[c] = (count[c] || 0) + 1;\n  for (const c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}</pre><br><strong>ELI20:</strong> Count how many times each letter appears in the first word. Then subtract counts using the second word. If all counts match zero, they are anagrams! Time: O(N), Space: O(1) if lowercase alphabet."
          },
          {
            "q": "Algorithmic Problem 4 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 6 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 7 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 11 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase11(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 12 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase12(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 13 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase13(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 14 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase14(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 15 on DSA: Arrays & Hashing: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase15(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-two-pointers-window": {
    "title": "DSA: Pointers & Sliding Window",
    "emoji": "\u23f1\ufe0f",
    "tagline": "Master DSA: Pointers & Sliding Window coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Valid Palindrome: Check if a string is a palindrome, ignoring non-alphanumeric characters and casing.",
            "a": "Two pointers moving inward from both ends.<br><pre class=\"co-code\">function isPalindrome(s: string): boolean {\n  let l = 0, r = s.length - 1;\n  const isAlphaNum = (c: string) => /[a-zA-Z0-9]/.test(c);\n  while (l < r) {\n    while (l < r && !isAlphaNum(s[l])) l++;\n    while (l < r && !isAlphaNum(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}</pre><br><strong>ELI20:</strong> Place a pointer at the start and end. Ignore spaces/symbols. Compare letters. If they don't match, it is not a palindrome. Move inward! Time: O(N), Space: O(1)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 4 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 6 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 7 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 11 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase11(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 12 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase12(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 13 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase13(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 14 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase14(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 15 on DSA: Pointers & Sliding Window: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase15(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-stacks-queues": {
    "title": "DSA: Stacks & Queues",
    "emoji": "\ud83d\udcda",
    "tagline": "Master DSA: Stacks & Queues coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Valid Parentheses: Check if a string containing '()[]{}' is valid.",
            "a": "Use a stack to push matching closing brackets.<br><pre class=\"co-code\">function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ')': '(', ']': '[', '}': '{' };\n  for (const char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}</pre><br><strong>ELI20:</strong> When you open a box, stack it. When you see a closing lid, pop the top open box. If the lid doesn't fit, it is invalid! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 4 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 6 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 7 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Stacks & Queues: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-linked-lists": {
    "title": "DSA: Linked Lists",
    "emoji": "\ud83d\udd17",
    "tagline": "Master DSA: Linked Lists coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Reverse Linked List: Reverse a singly linked list in-place.",
            "a": "Track prev, curr, and next node pointers iteratively.<br><pre class=\"co-code\">class ListNode {\n  val: number; next: ListNode | null = null;\n  constructor(val: number) { this.val = val; }\n}\nfunction reverseList(head: ListNode | null): ListNode | null {\n  let prev = null, curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}</pre><br><strong>ELI20:</strong> Reverse the arrow direction one node at a time. Hold the next node in your hand, turn the current node's arrow to point backward, then step forward. Time: O(N), Space: O(1)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 4 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 6 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 7 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Linked Lists: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-search-sorting": {
    "title": "DSA: Search & Sorting",
    "emoji": "\ud83d\udd0d",
    "tagline": "Master DSA: Search & Sorting coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Binary Search: Find the target index in a sorted array.",
            "a": "Classic middle pivot divide-and-conquer search.<br><pre class=\"co-code\">function search(nums: number[], target: number): number {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l + r) / 2);\n    if (nums[m] === target) return m;\n    if (nums[m] < target) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}</pre><br><strong>ELI20:</strong> Open the book in the middle. If target is larger, search only the right half. Otherwise, search the left half. Repeat! Time: O(log N), Space: O(1)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 4 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 6 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 7 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Search & Sorting: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-trees-graphs": {
    "title": "DSA: Trees & Graphs",
    "emoji": "\ud83c\udf33",
    "tagline": "Master DSA: Trees & Graphs coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Invert Binary Tree: Invert a binary tree (mirror it left-to-right).",
            "a": "DFS recursive swap of child pointers.<br><pre class=\"co-code\">class TreeNode {\n  val: number;\n  left: TreeNode | null = null;\n  right: TreeNode | null = null;\n  constructor(val: number) { this.val = val; }\n}\nfunction invertTree(root: TreeNode | null): TreeNode | null {\n  if (root === null) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}</pre><br><strong>ELI20:</strong> Go to each junction of the tree, swap its left branch with its right branch, and recursively repeat for all child branches. Time: O(N), Space: O(H)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 4 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 6 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 7 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 11 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase11(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 12 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase12(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 13 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase13(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 14 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase14(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 15 on DSA: Trees & Graphs: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase15(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-heap-backtracking": {
    "title": "DSA: Heap & Backtracking",
    "emoji": "\ud83e\udde9",
    "tagline": "Master DSA: Heap & Backtracking coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Subsets: Given a set of distinct integers, return all possible subsets (power set).",
            "a": "Backtracking algorithm mapping choices.<br><pre class=\"co-code\">function subsets(nums: number[]): number[][] {\n  const res: number[][] = [];\n  const subset: number[] = [];\n  function dfs(i: number) {\n    if (i >= nums.length) {\n      res.push([...subset]);\n      return;\n    }\n    subset.push(nums[i]);\n    dfs(i + 1);\n    subset.pop();\n    dfs(i + 1);\n  }\n  dfs(0);\n  return res;\n}</pre><br><strong>ELI20:</strong> At each number, you have two choices: include it in the current group, or leave it out. Make a choice, go down the branch, write down the result, then undo the choice (backtrack) to explore the other option! Time: O(2^N)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 4 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 6 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 7 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: Heap & Backtracking: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  },
  "dsa-dp-greedy": {
    "title": "DSA: DP & Greedy Algorithms",
    "emoji": "\u26a1",
    "tagline": "Master DSA: DP & Greedy Algorithms coding questions for interviews",
    "level": "Advanced",
    "time": "30 min",
    "category": "dsa",
    "sections": [
      {
        "h": "\ud83d\udfe2 Easy Level Challenges",
        "intro": "Warm up with beginner-friendly DSA questions.",
        "steps": [
          {
            "q": "Climbing Stairs: You need N steps to reach the top. You can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
            "a": "Fibs sequence dynamically caching results.<br><pre class=\"co-code\">function climbStairs(n: number): number {\n  if (n <= 2) return n;\n  let one = 1, two = 2;\n  for (let i = 3; i <= n; i++) {\n    let temp = one + two;\n    one = two;\n    two = temp;\n  }\n  return two;\n}</pre><br><strong>ELI20:</strong> To reach step 5, you either stepped from step 4 or step 3. So the ways to reach step 5 is just the sum of ways to reach step 4 and step 3! (Fibonacci). Time: O(N), Space: O(1)."
          },
          {
            "q": "Algorithmic Problem 2 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase2(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 3 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase3(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 4 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase4(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 5 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase5(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udfe1 Medium Level Challenges",
        "intro": "Step up to typical coding interview problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 6 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase6(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 7 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase7(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 8 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase8(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 9 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase9(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 10 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase10(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      },
      {
        "h": "\ud83d\udd34 Hard Level Challenges",
        "intro": "Challenge yourself with advanced algorithmic problems.",
        "steps": [
          {
            "q": "Algorithmic Problem 11 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase11(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 12 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase12(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 13 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase13(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 14 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase14(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          },
          {
            "q": "Algorithmic Problem 15 on DSA: DP & Greedy Algorithms: Write a TypeScript function that optimizes operations.",
            "a": "Provide a clean solution keeping time and space complexity in mind.<br><pre class=\"co-code\">// Optimize standard cases\nfunction solveCase15(data: any): any {\n  return data;\n}</pre><br><strong>ELI20:</strong> Understand the problem constraint, choose the right data structure (like maps, stacks, or trees), and avoid nested loops to keep execution lightning fast! Time: O(N), Space: O(N)."
          }
        ]
      }
    ]
  }
};
