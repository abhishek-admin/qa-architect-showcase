# Programming Practice Q&A Guide — Senior SDET (5+ Years)

> **Curated Reference Guide**: 145 high-signal programming questions and answers covering Java, JavaScript, dynamic scripting, and test automation design patterns.

---

## 📂 Table of Contents

1. [Part 1: Java Output-Based & Core Concepts (50 Qs)](#part-1-java-output-based--core-concepts-50-qs)
2. [Part 2: Java Algorithmic QA Coding (30 Qs)](#part-2-java-algorithmic-qa-coding-30-qs)
3. [Part 3: Java Collections Coding Challenges (25 Qs)](#part-3-java-collections-coding-challenges-25-qs)
4. [Part 4: JavaScript Basics, Promises & Chaining (20 Qs)](#part-4-javascript-basics-promises--chaining-20-qs)
5. [Part 5: Playwright & API Testing in JavaScript (20 Qs)](#part-5-playwright--api-testing-in-javascript-20-qs)

---

## Part 1: Java Output-Based & Core Concepts (50 Qs)

#### Q1: What is the output of the following program containing a static instance counter?
```java
class Test {
    static int count = 0;
    Test() {
        count++;
    }
}
public class Main {
    public static void main(String[] args) {
        new Test();
        new Test();
        new Test();
        System.out.println(Test.count);
    }
}
```
**Output:**  
`3`  
**Explanation:**  
The variable `count` is declared as `static`, meaning it belongs to the class itself rather than individual instances. It is loaded into the JVM class metadata memory space once. Every time `new Test()` is called, the constructor executes and increments the shared `count` variable. Since three instances are created, the final printed value is `3`.

#### Q2: What is the output of the following dynamic method dispatch example?
```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}
class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound();
    }
}
```
**Output:**  
`Dog barks`  
**Explanation:**  
This is an example of runtime polymorphism (dynamic method dispatch). The reference variable `a` is of type `Animal` (parent), but it points to an object of type `Dog` (child). In Java, overridden methods are resolved at runtime based on the actual object type, not the reference type. Since the actual object is a `Dog`, `Dog barks` is printed.

#### Q3: What is the output of this code comparing String references?
```java
public class StringCompare {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");
        System.out.println(s1 == s2);
        System.out.println(s1 == s3);
        System.out.println(s1.equals(s3));
    }
}
```
**Output:**  
`true`  
`false`  
`true`  
**Explanation:**  
`s1` and `s2` are string literals and are stored in the String Constant Pool. The JVM makes `s2` point to the existing "Java" literal, so `s1 == s2` is `true`. `s3` is created using `new String()`, which forces creation of a new object on the heap, so `s1 == s3` is `false` (different references). `equals()` checks the actual text values, which are identical, returning `true`.

#### Q4: What is the output order of static and instance initialization blocks?
```java
class InitBlock {
    static {
        System.out.println("Static block");
    }
    {
        System.out.println("Instance block");
    }
    InitBlock() {
        System.out.println("Constructor");
    }
}
public class Main {
    public static void main(String[] args) {
        new InitBlock();
        new InitBlock();
    }
}
```
**Output:**  
`Static block`  
`Instance block`  
`Constructor`  
`Instance block`  
`Constructor`  
**Explanation:**  
Static initialization blocks run once when the class is first loaded by the JVM. Instance initialization blocks run every time a new class instance is created, immediately before the constructor code executes.

#### Q5: What is the output when a try-catch-finally block contains multiple return statements?
```java
public class ReturnFlow {
    public static int getValue() {
        try {
            return 1;
        } catch (Exception e) {
            return 2;
        } finally {
            return 3;
        }
    }
    public static void main(String[] args) {
        System.out.println(getValue());
    }
}
```
**Output:**  
`3`  
**Explanation:**  
If a `finally` block contains a `return` statement, it overrides any prior `return` statement executed in the `try` or `catch` blocks. The JVM guarantees that the `finally` block executes before exiting the method frame, causing it to return `3`.

#### Q6: Which overloaded method is selected when passing a null argument?
```java
public class NullOverload {
    public static void print(String s) {
        System.out.println("String");
    }
    public static void print(Object o) {
        System.out.println("Object");
    }
    public static void main(String[] args) {
        print(null);
    }
}
```
**Output:**  
`String`  
**Explanation:**  
When resolving overloaded methods with a `null` argument, compiler rules dictate selecting the most specific match. Since `String` is a child class of `Object` (more specific), `print(String)` is called. If there was a third overload `print(Integer i)`, the compiler would throw an ambiguity error.

#### Q7: What is the output of this reference mutation check?
```java
class Container {
    int value = 10;
}
public class ReferencePass {
    public static void modify(Container c, int val) {
        c.value = 50;
        c = new Container();
        c.value = 100;
    }
    public static void main(String[] args) {
        Container c = new Container();
        modify(c, 50);
        System.out.println(c.value);
    }
}
```
**Output:**  
`50`  
**Explanation:**  
Java is strictly **pass-by-value**. For objects, the "value" passed is the address reference. Inside `modify()`, `c.value = 50` updates the heap memory, altering the original object. Reassigning `c = new Container()` changes the local variable reference copy to a new address space, so setting `c.value = 100` does not affect the caller's reference.

#### Q8: Can you override static methods in Java? What is the output?
```java
class Parent {
    static void display() {
        System.out.println("Parent static");
    }
}
class Child extends Parent {
    static void display() {
        System.out.println("Child static");
    }
}
public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.display();
    }
}
```
**Output:**  
`Parent static`  
**Explanation:**  
Static methods cannot be overridden (dynamic dispatch). They are bound at compile-time (early/static binding) using the reference variable's type. Since `p` is declared as reference type `Parent`, `Parent.display()` is called. This behavior is called **method hiding**.

#### Q9: What happens when an exception is thrown inside a finally block?
```java
public class FinallyException {
    public static void check() {
        try {
            throw new ArithmeticException("Try");
        } finally {
            throw new NullPointerException("Finally");
        }
    }
    public static void main(String[] args) {
        try {
            check();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```
**Output:**  
`Finally`  
**Explanation:**  
If the `finally` block throws a new exception, it completely suppresses and throws away the exception originally thrown in the `try` block. Only the `NullPointerException` escapes the method frame.

#### Q10: What is the output of this post-increment constructor assignment?
```java
public class IncrementCheck {
    int value = 0;
    IncrementCheck(int value) {
        this.value = value++;
    }
    public static void main(String[] args) {
        IncrementCheck obj = new IncrementCheck(5);
        System.out.println(obj.value);
    }
}
```
**Output:**  
`5`  
**Explanation:**  
The post-increment operator (`value++`) evaluates first, returning the current value (`5`) to the assignment expression, and *then* increments the local parameter variable `value` to `6`. Therefore, `this.value` is assigned the evaluated result `5`.

#### Q11: What is the output of this class casting sequence?
```java
class A {}
class B extends A {}
public class CastCheck {
    public static void main(String[] args) {
        A obj1 = new B();
        B obj2 = (B) obj1;
        System.out.println("Casted");
        A obj3 = new A();
        B obj4 = (B) obj3;
    }
}
```
**Output:**  
`Casted` followed by `java.lang.ClassCastException`  
**Explanation:**  
`obj1` points to an actual runtime instance of class `B`. Downcasting it to `B` (`obj2 = (B) obj1`) is perfectly valid. However, `obj3` points to an actual instance of parent class `A`. Forcing a downcast of parent object to child (`(B) obj3`) causes a runtime `ClassCastException`.

#### Q12: How do abstract class constructors execute?
```java
abstract class AbstractClass {
    AbstractClass() {
        System.out.println("Abstract Constructor");
    }
}
class ConcreteClass extends AbstractClass {
    ConcreteClass() {
        System.out.println("Concrete Constructor");
    }
}
public class Main {
    public static void main(String[] args) {
        new ConcreteClass();
    }
}
```
**Output:**  
`Abstract Constructor`  
`Concrete Constructor`  
**Explanation:**  
Abstract classes cannot be instantiated directly, but they still have constructors. When a child class is constructed, the compiler automatically inserts `super()` as the first line of the child constructor, executing the abstract parent constructor first.

#### Q13: What is the output of this String modification test?
```java
public class StringPoolModify {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = s1.concat(" world");
        String s3 = "hello world";
        System.out.println(s2 == s3);
        System.out.println(s2.equals(s3));
    }
}
```
**Output:**  
`false`  
`true`  
**Explanation:**  
String concatenation methods (like `concat()`) generate a new string object on the heap, rather than returning a literal from the String Constant Pool. Thus, `s2` points to the heap object and `s3` points to the pool literal, making `s2 == s3` evaluate to `false`.

#### Q14: How does catch block ordering work for parent and child exceptions?
```java
public class CatchOrder {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Child");
        } catch (Exception e) {
            System.out.println("Parent");
        }
    }
}
```
**Output:**  
`Child`  
**Explanation:**  
Catch blocks must be ordered from the most specific exception class (child) to the most general (parent). If the catch block for `Exception` was placed first, the compiler would reject it with an error stating that `ArithmeticException` has already been caught.

#### Q15: What is the output when trying to override a private method?
```java
class Super {
    private void show() {
        System.out.println("Super");
    }
}
class Sub extends Super {
    public void show() {
        System.out.println("Sub");
    }
}
public class Main {
    public static void main(String[] args) {
        Super obj = new Sub();
        // obj.show(); -> Compiler Error!
    }
}
```
**Output:**  
Compiler Error  
**Explanation:**  
Private methods are not inherited by subclasses. The method `show()` inside `Sub` is a completely new method and does not override `Super.show()`. Declaring `Super obj = new Sub()` means the reference variable cannot access the subclass method, and calling `obj.show()` fails compilation because the private method is hidden from outer scopes.

#### Q16: What is the output of this wrapper class cache check?
```java
public class WrapperCache {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        Integer c = 200;
        Integer d = 200;
        System.out.println(a == b);
        System.out.println(c == d);
    }
}
```
**Output:**  
`true`  
`false`  
**Explanation:**  
Java caches `Integer` objects for values from `-128` to `127` (Wrapper Cache). For values in this range, autoboxing returns references to the identical cached objects. For `200`, autoboxing instantiates distinct objects, making `c == d` return `false`.

#### Q17: What is the output when an interface field is modified?
```java
interface MyInterface {
    int VALUE = 10;
}
public class InterfaceFields {
    public static void main(String[] args) {
        // MyInterface.VALUE = 20; -> Compiler Error!
        System.out.println(MyInterface.VALUE);
    }
}
```
**Output:**  
`10`  
**Explanation:**  
All variables declared inside Java interfaces are implicitly `public static final`. Any attempt to reassign or modify their values results in a compilation error.

#### Q18: What is the output of this final variable constructor assignment?
```java
public class FinalVar {
    final int x;
    FinalVar() {
        x = 5;
    }
    FinalVar(int val) {
        x = val;
    }
    public static void main(String[] args) {
        System.out.println(new FinalVar().x);
        System.out.println(new FinalVar(20).x);
    }
}
```
**Output:**  
`5`  
`20`  
**Explanation:**  
A blank final instance variable must be assigned a value exactly once inside class constructors. Since every constructor path assigns a value, the compilation succeeds.

#### Q19: What is the output when calling `System.exit(0)` inside a try block?
```java
public class ExitFlow {
    public static void main(String[] args) {
        try {
            System.out.println("Try");
            System.exit(0);
        } finally {
            System.out.println("Finally");
        }
    }
}
```
**Output:**  
`Try`  
**Explanation:**  
The only scenario where a `finally` block does not execute is if the JVM process terminates. Calling `System.exit(0)` stops the JVM immediately, preventing the execution of the `finally` block.

#### Q20: What is the output of this boolean array initialization?
```java
public class ArrayInit {
    public static void main(String[] args) {
        boolean[] flags = new boolean[3];
        System.out.println(flags[0]);
    }
}
```
**Output:**  
`false`  
**Explanation:**  
In Java, when primitive arrays are instantiated, elements are automatically initialized with their default values. The default value for type `boolean` is `false`.

#### Q21: What is the output of this class variable shadow test?
```java
class Shadow {
    int x = 10;
    void print() {
        int x = 20;
        System.out.println(x);
        System.out.println(this.x);
    }
}
public class Main {
    public static void main(String[] args) {
        new Shadow().print();
    }
}
```
**Output:**  
`20`  
`10`  
**Explanation:**  
The local variable `x` declared inside `print()` shadows the instance variable `x`. Referencing `x` accesses the local variable (`20`), while referencing `this.x` explicitly accesses the class instance variable (`10`).

#### Q22: What is the output of the following character addition print statement?
```java
public class CharAdd {
    public static void main(String[] args) {
        System.out.println('A' + 'B');
    }
}
```
**Output:**  
`131`  
**Explanation:**  
In Java, the binary addition operator `+` causes character literals ('A' = 65, 'B' = 66) to undergo unary numeric promotion, casting them automatically to `int` values. The console prints the numerical sum `131`. To print concatenation, use `"" + 'A' + 'B'`.

#### Q23: What is the output of the following inheritance variable lookup?
```java
class SuperClass {
    int x = 10;
}
class SubClass extends SuperClass {
    int x = 20;
}
public class Main {
    public static void main(String[] args) {
        SuperClass obj = new SubClass();
        System.out.println(obj.x);
    }
}
```
**Output:**  
`10`  
**Explanation:**  
Variables do not exhibit polymorphic behavior in Java. Variable lookups are resolved at compile-time based on the reference variable's type. Since reference `obj` is of type `SuperClass`, `obj.x` returns the parent's field (`10`).

#### Q24: What is the output of this nested constructor calling loop?
```java
class ConstructorLoop {
    ConstructorLoop() {
        this(10);
        System.out.println("Default");
    }
    ConstructorLoop(int x) {
        System.out.println("Param: " + x);
    }
}
public class Main {
    public static void main(String[] args) {
        new ConstructorLoop();
    }
}
```
**Output:**  
`Param: 10`  
`Default`  
**Explanation:**  
`new ConstructorLoop()` calls the default constructor, which immediately delegates to the parameterized constructor using `this(10)`. The parameterized constructor runs first and prints, then control returns to finish the default constructor.

#### Q25: What is the output of this static block inheritance execution?
```java
class A {
    static {
        System.out.println("Static A");
    }
}
class B extends A {
    static {
        System.out.println("Static B");
    }
}
public class Main {
    public static void main(String[] args) {
        new B();
    }
}
```
**Output:**  
`Static A`  
`Static B`  
**Explanation:**  
When a subclass is loaded by the class loader, the JVM guarantees that the superclass static initializer blocks are loaded and executed before running the subclass static initializers.

#### Q26: What is the output of this double comparison logic?
```java
public class DoubleCompare {
    public static void main(String[] args) {
        double d1 = 0.1;
        double d2 = 0.2;
        System.out.println((d1 + d2) == 0.3);
        System.out.println(d1 + d2);
    }
}
```
**Output:**  
`false`  
`0.30000000000000004`  
**Explanation:**  
Floating-point numbers (float/double) cannot represent decimal fractions precisely in binary formats, leading to rounding calculations. Comparing `(d1 + d2) == 0.3` returns `false` due to precision limits. Use `BigDecimal` for precise monetary or scientific calculations.

#### Q27: What is the output of this array resize check?
```java
public class ArrayResize {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        int[] ref = arr;
        arr = new int[]{4, 5, 6, 7};
        System.out.println(ref.length);
    }
}
```
**Output:**  
`3`  
**Explanation:**  
Arrays in Java are of fixed size. `ref` is assigned the reference of the initial array object. Reassigning `arr` to point to a new array object (`{4, 5, 6, 7}`) does not change the memory allocation of the initial array, which is still pointed to by `ref`.

#### Q28: Can a method throw a broader exception than declared in the parent class?
```java
class Super {
    void show() throws ArithmeticException {
        System.out.println("Super");
    }
}
class Sub extends Super {
    // void show() throws Exception {} -> Compiler Error!
}
```
**Output:**  
Compiler Error  
**Explanation:**  
When overriding methods in Java, the subclass method cannot throw checked exceptions that are broader (higher in hierarchy) than the exceptions declared in the superclass method. It can throw narrower subclasses of those exceptions or no exceptions at all.

#### Q29: What is the output of the following switch case block omitting break?
```java
public class SwitchCheck {
    public static void main(String[] args) {
        int choice = 2;
        switch (choice) {
            case 1: System.out.print("1");
            case 2: System.out.print("2");
            case 3: System.out.print("3");
            default: System.out.print("D");
        }
    }
}
```
**Output:**  
`23D`  
**Explanation:**  
Without `break` statements, execution falls through all subsequent case blocks and the `default` block once a match is found. Since the choice matches `case 2`, execution executes case 2, case 3, and default sequentially.

#### Q30: What is the output when an object reference is declared final?
```java
class Item {
    int value = 10;
}
public class FinalRef {
    public static void main(String[] args) {
        final Item item = new Item();
        item.value = 50;
        // item = new Item(); -> Compiler Error!
        System.out.println(item.value);
    }
}
```
**Output:**  
`50`  
**Explanation:**  
Declaring a reference variable `final` means the variable cannot be reassigned to point to another object on the heap. However, the internal properties or state of the object itself can be mutated freely.

#### Q31: What is the output of a multi-catch block catching subclass exceptions?
```java
public class MultiCatch {
    public static void main(String[] args) {
        try {
            int a = 10 / 0;
        } catch (ArithmeticException | NullPointerException e) {
            System.out.println(e.getClass().getSimpleName());
        }
    }
}
```
**Output:**  
`ArithmeticException`  
**Explanation:**  
The multi-catch block allows handling multiple distinct exception types in a single catch clause. The variable `e` dynamically resolves to the actual runtime exception class that was thrown.

#### Q32: What is the output of the following String internship check?
```java
public class StringIntern {
    public static void main(String[] args) {
        String s1 = new String("Java").intern();
        String s2 = "Java";
        System.out.println(s1 == s2);
    }
}
```
**Output:**  
`true`  
**Explanation:**  
Calling `intern()` on a string object searches the String Constant Pool. If the literal already exists, it returns the existing reference. Since "Java" is already in the pool, `s1` resolves to that cached reference, matching `s2`.

#### Q33: How does generic type erasure affect method overloading?
```java
import java.util.List;
public class GenericOverload {
    // public void print(List<String> list) {}
    // public void print(List<Integer> list) {} -> Compiler Error!
}
```
**Output:**  
Compiler Error  
**Explanation:**  
Java implementing generics via **Type Erasure** removes all generic type parameter information at compile time (e.g. converting `List<String>` and `List<Integer>` to raw `List`). Overloading these signatures fails because their compiled method descriptors are identical.

#### Q34: What is the output of the following division operation on integers?
```java
public class IntDiv {
    public static void main(String[] args) {
        System.out.println(5 / 2);
        System.out.println(5.0 / 2);
    }
}
```
**Output:**  
`2`  
`2.5`  
**Explanation:**  
The division of two integers (`5 / 2`) results in integer division, discarding any remainder. However, if one or both parameters are double values (`5.0 / 2`), the operation executes floating-point division.

#### Q35: What is the output of this final class check?
```java
final class Base {}
// class Derived extends Base {} -> Compiler Error!
public class Main {
    public static void main(String[] args) {
        System.out.println("Main");
    }
}
```
**Output:**  
Compiler Error  
**Explanation:**  
Classes declared with the modifier keyword `final` cannot be extended or inherited by subclasses, ensuring compiler security.

#### Q36: What is the default value of object array slots?
```java
public class ObjectArray {
    public static void main(String[] args) {
        String[] arr = new String[2];
        System.out.println(arr[0]);
    }
}
```
**Output:**  
`null`  
**Explanation:**  
Any array holding object references has its slots initialized with the default reference value, which is `null`.

#### Q37: What is the output of this String length check?
```java
public class StringLength {
    public static void main(String[] args) {
        String s = "Hello";
        int[] arr = {1, 2, 3};
        System.out.println(s.length());
        System.out.println(arr.length);
    }
}
```
**Output:**  
`5`  
`3`  
**Explanation:**  
Strings use the method `.length()`. Arrays use the read-only property variable `.length`. Mixing their syntaxes results in compilation failures.

#### Q38: What is the output of the following Boolean logic check?
```java
public class BoolLogic {
    public static void main(String[] args) {
        System.out.println(true || false && false);
    }
}
```
**Output:**  
`true`  
**Explanation:**  
The logical AND operator (`&&`) has higher operator precedence than the logical OR operator (`||`). Thus, `false && false` evaluates to `false` first, then `true || false` evaluates to `true`.

#### Q39: What is the output of the following float value declaration?
```java
public class FloatDecl {
    public static void main(String[] args) {
        // float f = 3.14; -> Compiler Error!
        float f = 3.14f;
        System.out.println(f);
    }
}
```
**Output:**  
`3.14`  
**Explanation:**  
Floating-point numbers in Java default to type `double`. Attempting to assign a double literal (`3.14`) to a float variable fails compilation due to loss of precision, requiring the float suffix `f`.

#### Q40: How does variable initialization behave inside method blocks?
```java
public class LocalVar {
    public static void main(String[] args) {
        int x;
        // System.out.println(x); -> Compiler Error!
    }
}
```
**Output:**  
Compiler Error  
**Explanation:**  
Unlike instance/class variables, local variables inside methods are not initialized with default values. Attempting to use a local variable before explicitly initializing it results in compile failures.

#### Q41: What is the output of this division by zero check on double variables?
```java
public class DoubleZero {
    public static void main(String[] args) {
        System.out.println(1.0 / 0.0);
        System.out.println(-1.0 / 0.0);
        System.out.println(0.0 / 0.0);
    }
}
```
**Output:**  
`Infinity`  
`-Infinity`  
`NaN`  
**Explanation:**  
Floating-point arithmetic (IEEE 754 standard) does not throw exceptions when dividing by zero. Instead, it returns special values representing Infinity, negative Infinity, and Not-a-Number (`NaN`).

#### Q42: What is the output of the following instance comparison check?
```java
class A {}
class B extends A {}
public class InstanceCheck {
    public static void main(String[] args) {
        A obj = new B();
        System.out.println(obj instanceof A);
        System.out.println(obj instanceof B);
    }
}
```
**Output:**  
`true`  
`true`  
**Explanation:**  
Since class `B` is a subclass of class `A`, an instance of `B` is structurally also an instance of `A` (is-a relationship). Thus, `instanceof` returns `true` for both checks.

#### Q43: What is the output when an exception is thrown in static initialization?
```java
public class StaticException {
    static {
        int x = 10 / 0;
    }
    public static void main(String[] args) {
        System.out.println("Main");
    }
}
```
**Output:**  
`java.lang.ExceptionInInitializerError` caused by `java.lang.ArithmeticException: / by zero`  
**Explanation:**  
If a static initializer block throws an unchecked runtime exception, the class loading phase fails, and the JVM wraps the root cause inside an `ExceptionInInitializerError`.

#### Q44: Can you declare static elements inside non-static inner classes?
```java
class Outer {
    class Inner {
        // static int x = 10; -> Compiler Error!
    }
}
```
**Output:**  
Compiler Error  
**Explanation:**  
Non-static inner classes are implicitly bound to a specific instance of the outer class. Declaring static fields or methods inside them is rejected by the compiler. To define static variables, the inner class must be declared `static`.

#### Q45: What is the output of the following string manipulation addition print?
```java
public class StringConcat {
    public static void main(String[] args) {
        System.out.println(10 + 20 + "Java");
        System.out.println("Java" + 10 + 20);
    }
}
```
**Output:**  
`30Java`  
`Java1020`  
**Explanation:**  
Operations evaluate left to right. In the first line, `10 + 20` resolves to the numeric sum `30` before string concatenation converts it to `30Java`. In the second line, `"Java" + 10` instantly forms string concatenation, so the subsequent `+ 20` behaves as another string concatenation.

#### Q46: What is the output of this array index boundary assignment check?
```java
public class IndexCheck {
    public static void main(String[] args) {
        try {
            int[] nums = new int[2];
            nums[2] = 10;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Index Error");
        }
    }
}
```
**Output:**  
`Index Error`  
**Explanation:**  
An array of size `2` has indices `0` and `1`. Accessing or assigning index `2` falls outside the bounds of the array allocation, throwing an `ArrayIndexOutOfBoundsException`.

#### Q47: What is the output when try-with-resources fails to locate an closeable?
```java
class CustomCloseable implements AutoCloseable {
    @Override
    public void close() {
        System.out.println("Closed");
    }
}
public class TryWithResources {
    public static void main(String[] args) {
        try (CustomCloseable resource = new CustomCloseable()) {
            System.out.println("Body");
        }
    }
}
```
**Output:**  
`Body`  
`Closed`  
**Explanation:**  
The try-with-resources statement automatically calls the `.close()` method on any object implementing `AutoCloseable` once execution exits the try block scope.

#### Q48: What is the output of this ternary operator assignment?
```java
public class TernaryCheck {
    public static void main(String[] args) {
        int x = 5;
        int y = (x > 5) ? 10 : (x < 5) ? 20 : 30;
        System.out.println(y);
    }
}
```
**Output:**  
`30`  
**Explanation:**  
Since `x = 5`, the condition `x > 5` evaluates to `false`. Control falls to the nested false clause `(x < 5) ? 20 : 30`. Since `x < 5` is also `false`, the statement evaluates to the default expression value `30`.

#### Q49: What is the output when matching generic type assignments?
```java
import java.util.*;
public class GenericAssign {
    public static void main(String[] args) {
        // List<Object> list = new ArrayList<String>(); -> Compiler Error!
        List<? extends Object> list = new ArrayList<String>();
        System.out.println("Valid");
    }
}
```
**Output:**  
`Valid`  
**Explanation:**  
Java generics are invariant. A `List<Object>` reference cannot point to a `List<String>` because they represent incompatible types. To allow this assignment, wildcards must be used (`List<? extends Object>`).

#### Q50: What is the output of this null check expression?
```java
public class NullCheck {
    public static void main(String[] args) {
        String s = null;
        System.out.println(s == null || s.length() == 0);
    }
}
```
**Output:**  
`true`  
**Explanation:**  
The logical OR operator `||` is short-circuiting. If the first evaluation (`s == null`) returns `true`, the JVM skips evaluating the second clause entirely. This prevents throwing a `NullPointerException` at runtime.

---

## Part 2: Java Algorithmic QA Coding (30 Qs)

#### Q51: Write an algorithm to count and print characters that occur exactly once in a String (non-repeated characters).
```java
public class Repeats {
    public static void main(String[] args) {
        String input = "Jonathan Richardson";
        printrepeats(input);
    }

    static void printrepeats(String input) {
        int[] charCount = new int[256];
        for (char c : input.toCharArray()) {
            charCount[c]++;
        }
        for (int i = 0; i < charCount.length; i++) {
            if (charCount[i] == 1) {
                System.out.println((char)i + "  " + charCount[i]);
            }
        }
    }
}
```
**Output:**  
```text
A  1
b  1
e  1
h  1
i  1
k  1
o  1
r  1
t  1
v  1
```
**Explanation:**  
This algorithm initializes an array of size 256 representing all ASCII character points. In the first pass, it iterates through the input string and increments the count at the corresponding character index. In the second pass, it scans the character count registry and prints only characters where the count is exactly `1`.

#### Q52: Write a method to reverse a String without using `StringBuilder.reverse()`.
```java
public class StringReverse {
    public static String reverse(String str) {
        if (str == null || str.isEmpty()) return str;
        char[] chars = str.toCharArray();
        int left = 0, right = chars.length - 1;
        while (left < right) {
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;
            left++;
            right--;
        }
        return new String(chars);
    }
}
```

**Example:**
- Input: `reverse("hello")`
- Output: `"olleh"`

#### Q53: Write a method to check if a String is a palindrome.
```java
public class Palindrome {
    public static boolean isPalindrome(String str) {
        if (str == null) return false;
        String clean = str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int left = 0, right = clean.length() - 1;
        while (left < right) {
            if (clean.charAt(left) != clean.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }
}
```

**Example:**
- Input: `isPalindrome("A man a plan a canal Panama")` → `true`
- Input: `isPalindrome("hello")` → `false`

#### Q54: Write a method to verify if two strings are anagrams of each other.
```java
import java.util.Arrays;
public class Anagram {
    public static boolean checkAnagram(String s1, String s2) {
        if (s1 == null || s2 == null || s1.length() != s2.length()) return false;
        char[] arr1 = s1.toLowerCase().toCharArray();
        char[] arr2 = s2.toLowerCase().toCharArray();
        Arrays.sort(arr1);
        Arrays.sort(arr2);
        return Arrays.equals(arr1, arr2);
    }
}
```

**Example:**
- Input: `checkAnagram("listen", "silent")` → `true`
- Input: `checkAnagram("hello", "world")` → `false`

#### Q55: Find the first non-repeated character in a String.
```java
import java.util.LinkedHashMap;
import java.util.Map;
public class FirstNonRepeated {
    public static char findFirst(String str) {
        if (str == null || str.isEmpty()) return '\0';
        Map<Character, Integer> counts = new LinkedHashMap<>();
        for (char c : str.toCharArray()) {
            counts.put(c, counts.getOrDefault(c, 0) + 1);
        }
        for (Map.Entry<Character, Integer> entry : counts.entrySet()) {
            if (entry.getValue() == 1) return entry.getKey();
        }
        return '\0';
    }
}
```

**Example:**
- Input: `findFirst("abracadabra")`
- Output: `'c'`

#### Q56: Write a method to remove all whitespace characters from a String.
```java
public class WhitespaceRemover {
    public static String removeSpaces(String str) {
        if (str == null) return null;
        return str.replaceAll("\\s+", "");
    }
}
```

**Example:**
- Input: `removeSpaces("hello world")`
- Output: `"helloworld"`

#### Q57: Write a method to find the second largest integer in an array.
```java
public class SecondLargest {
    public static int getSecondMax(int[] arr) {
        if (arr == null || arr.length < 2) throw new IllegalArgumentException("Invalid input size");
        int max = Integer.MIN_VALUE;
        int secondMax = Integer.MIN_VALUE;
        for (int num : arr) {
            if (num > max) {
                secondMax = max;
                max = num;
            } else if (num > secondMax && num != max) {
                secondMax = num;
            }
        }
        return secondMax;
    }
}
```

**Example:**
- Input: `getSecondMax(new int[]{3,1,4,1,5,9,2,6})`
- Output: `6`

#### Q58: Write a method to rotate an array to the right by K steps.
```java
public class ArrayRotation {
    public static void rotate(int[] nums, int k) {
        if (nums == null || nums.length == 0) return;
        k = k % nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }
    private static void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}
```

**Example:**
- Input: `rotate(new int[]{1,2,3,4,5,6,7}, 3)` → array becomes `[5,6,7,1,2,3,4]`

#### Q59: Write a method to reverse the words in a sentence.
```java
public class SentenceReverser {
    public static String reverseWords(String sentence) {
        if (sentence == null || sentence.isEmpty()) return sentence;
        String[] parts = sentence.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = parts.length - 1; i >= 0; i--) {
            sb.append(parts[i]).append(" ");
        }
        return sb.toString().trim();
    }
}
```

**Example:**
- Input: `reverseWords("Hello World Java")`
- Output: `"Java World Hello"`

#### Q60: Find the duplicate numbers in an array.
```java
import java.util.HashSet;
import java.util.Set;
public class DuplicateNumbers {
    public static Set<Integer> findDuplicates(int[] nums) {
        Set<Integer> duplicates = new HashSet<>();
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (!seen.add(num)) {
                duplicates.add(num);
            }
        }
        return duplicates;
    }
}
```

**Example:**
- Input: `findDuplicates(new int[]{1,2,3,2,4,3})`
- Output: `[2, 3]`

#### Q61: Check if a given string contains only digits.
```java
public class DigitValidator {
    public static boolean checkOnlyDigits(String str) {
        if (str == null || str.isEmpty()) return false;
        return str.matches("\\d+");
    }
}
```

**Example:**
- Input: `checkOnlyDigits("12345")` → `true`
- Input: `checkOnlyDigits("123a5")` → `false`

#### Q62: Calculate the number of vowels and consonants in a String.
```java
public class VowelConsonantCount {
    public static void printCounts(String str) {
        if (str == null) return;
        int vowels = 0, consonants = 0;
        String clean = str.toLowerCase();
        for (char c : clean.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                    vowels++;
                } else {
                    consonants++;
                }
            }
        }
        System.out.println("Vowels: " + vowels + " | Consonants: " + consonants);
    }
}
```

**Example:**
- Input: `printCounts("Hello World")`
- Output: `Vowels: 3 | Consonants: 7`

#### Q63: Find the occurrences of a target string within another string.
```java
public class SubstringOccurrences {
    public static int countOccurrences(String main, String sub) {
        if (main == null || sub == null || sub.isEmpty()) return 0;
        int count = 0;
        int idx = 0;
        while ((idx = main.indexOf(sub, idx)) != -1) {
            count++;
            idx += sub.length();
        }
        return count;
    }
}
```

**Example:**
- Input: `countOccurrences("abcabcabc", "abc")`
- Output: `3`

#### Q64: Implement dynamic binary search on a sorted integer array.
```java
public class BinarySearch {
    public static int search(int[] nums, int target) {
        if (nums == null) return -1;
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}
```

**Example:**
- Input: `search(new int[]{1,3,5,7,9,11}, 7)`
- Output: `3` (index of 7)

#### Q65: Check if a given year is a leap year.
```java
public class LeapYear {
    public static boolean checkLeap(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }
}
```

**Example:**
- Input: `checkLeap(2000)` → `true`; `checkLeap(1900)` → `false`; `checkLeap(2024)` → `true`

#### Q66: Swap two numbers without using a temporary variable.
```java
public class SwapNumbers {
    public static void swap(int a, int b) {
        a = a + b;
        b = a - b;
        a = a - b;
        System.out.println("a = " + a + " | b = " + b);
    }
}
```

**Example:**
- Input: `swap(5, 10)`
- Output: `a = 10 | b = 5`

#### Q67: Find the absolute intersection elements of two arrays.
```java
import java.util.HashSet;
import java.util.Set;
public class ArrayIntersection {
    public static int[] getIntersection(int[] a, int[] b) {
        Set<Integer> setA = new HashSet<>();
        for (int val : a) setA.add(val);
        Set<Integer> intersect = new HashSet<>();
        for (int val : b) {
            if (setA.contains(val)) intersect.add(val);
        }
        return intersect.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

**Example:**
- Input: `getIntersection(new int[]{1,2,3,4}, new int[]{3,4,5,6})`
- Output: `[3, 4]`

#### Q68: Compress a string using count of repeated characters (e.g. `aabcccccaaa` -> `a2b1c5a3`).
```java
public class StringCompression {
    public static String compress(String str) {
        if (str == null || str.isEmpty()) return str;
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 0; i < str.length(); i++) {
            if (i + 1 < str.length() && str.charAt(i) == str.charAt(i + 1)) {
                count++;
            } else {
                sb.append(str.charAt(i)).append(count);
                count = 1;
            }
        }
        return sb.length() < str.length() ? sb.toString() : str;
    }
}
```

**Example:**
- Input: `compress("aabcccccaaa")`
- Output: `"a2b1c5a3"`

#### Q69: Find all pairs of integers in an array that sum up to a target value.
```java
import java.util.HashSet;
import java.util.Set;
public class TwoSumPairs {
    public static void printPairs(int[] arr, int target) {
        Set<Integer> seen = new HashSet<>();
        for (int val : arr) {
            int complement = target - val;
            if (seen.contains(complement)) {
                System.out.println("(" + val + ", " + complement + ")");
            }
            seen.add(val);
        }
    }
}
```

**Example:**
- Input: `printPairs(new int[]{2,4,3,5,6,1,7}, 7)`
- Output: `(3, 4)` and `(6, 1)`

#### Q70: Implement the bubble sort algorithm.
```java
public class BubbleSort {
    public static void sort(int[] arr) {
        if (arr == null) return;
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}
```

**Example:**
- Input: `sort(new int[]{5,3,8,1,2})` → array becomes `[1, 2, 3, 5, 8]`

#### Q71: Write a method to evaluate if a number is prime.
```java
public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
}
```

**Example:**
- Input: `isPrime(17)` → `true`; `isPrime(4)` → `false`

#### Q72: Calculate the factorial of a number using memoization.
```java
public class Factorial {
    public static long getFactorial(int n) {
        if (n < 0) throw new IllegalArgumentException("Must be positive");
        long result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}
```

**Example:**
- Input: `getFactorial(5)`
- Output: `120`

#### Q73: Check if a given integer is a armstrong number (e.g. 153 = $1^3 + 5^3 + 3^3$).
```java
public class Armstrong {
    public static boolean checkArmstrong(int n) {
        int original = n;
        int sum = 0;
        int digits = String.valueOf(n).length();
        while (n > 0) {
            int remainder = n % 10;
            sum += Math.pow(remainder, digits);
            n = n / 10;
        }
        return sum == original;
    }
}
```

**Example:**
- Input: `checkArmstrong(153)` → `true`; `checkArmstrong(123)` → `false`

#### Q74: Find the greatest common divisor (GCD) of two numbers.
```java
public class GCD {
    public static int getGCD(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

**Example:**
- Input: `getGCD(48, 18)`
- Output: `6`

#### Q75: Find the missing number in an array containing numbers from 1 to N.
```java
public class MissingNumber {
    public static int findMissing(int[] arr, int n) {
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : arr) actualSum += num;
        return expectedSum - actualSum;
    }
}
```

**Example:**
- Input: `findMissing(new int[]{1,2,4,5,6}, 6)`
- Output: `3`

#### Q76: Find the longest common prefix in an array of strings.
```java
public class LongestCommonPrefix {
    public static String getPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}
```

**Example:**
- Input: `getPrefix(new String[]{"flower","flow","flight"})`
- Output: `"fl"`

#### Q77: Check if a given string contains all letters of the alphabet (Pangram).
```java
public class Pangram {
    public static boolean checkPangram(String str) {
        if (str == null) return false;
        String clean = str.toLowerCase();
        Set<Character> chars = new HashSet<>();
        for (char c : clean.toCharArray()) {
            if (c >= 'a' && c <= 'z') chars.add(c);
        }
        return chars.size() == 26;
    }
}
```

**Example:**
- Input: `checkPangram("The quick brown fox jumps over the lazy dog")` → `true`
- Input: `checkPangram("Hello")` → `false`

#### Q78: Implement custom string-to-integer parser (like `Integer.parseInt`).
```java
public class CustomParseInt {
    public static int parse(String str) {
        if (str == null || str.trim().isEmpty()) throw new NumberFormatException("Invalid format");
        String clean = str.trim();
        int sign = 1;
        int idx = 0;
        if (clean.charAt(0) == '-') {
            sign = -1;
            idx++;
        } else if (clean.charAt(0) == '+') {
            idx++;
        }
        long sum = 0;
        for (int i = idx; i < clean.length(); i++) {
            char c = clean.charAt(i);
            if (c < '0' || c > '9') throw new NumberFormatException("Contains non-digits");
            sum = sum * 10 + (c - '0');
        }
        return (int) (sum * sign);
    }
}
```

**Example:**
- Input: `parse("-42")` → `-42`; `parse("123")` → `123`

#### Q79: Find the matching index of a peak element in an array (an element that is greater than its neighbors).
```java
public class PeakElement {
    public static int findPeak(int[] arr) {
        if (arr == null || arr.length == 0) return -1;
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < arr[mid + 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}
```

**Example:**
- Input: `findPeak(new int[]{1,3,5,4,2})`
- Output: `2` (index of peak element `5`)

#### Q80: Reverse the elements inside a integer array in-place.
```java
public class ReverseArray {
    public static void reverse(int[] arr) {
        if (arr == null) return;
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
```

**Example:**
- Input: `reverse(new int[]{1,2,3,4,5})` → array becomes `[5,4,3,2,1]` (in-place)

---

## Part 3: Java Collections Coding Challenges (25 Qs)

#### Q81: Write a program using `HashMap` to find the frequency of each element in an ArrayList.
```java
import java.util.*;
public class FrequencyCounter {
    public static Map<String, Integer> countFrequency(List<String> list) {
        Map<String, Integer> freqMap = new HashMap<>();
        for (String val : list) {
            freqMap.put(val, freqMap.getOrDefault(val, 0) + 1);
        }
        return freqMap;
    }
}
```

**Example:**
- Input: `countFrequency(Arrays.asList("a","b","a","c","b","a"))`
- Output: `{a=3, b=2, c=1}`

#### Q82: Remove duplicate elements from an ArrayList of integers preserving the original order.
```java
import java.util.*;
public class RemoveDuplicatesList {
    public static List<Integer> remove(List<Integer> list) {
        // LinkedHashSet preserves insertion order while removing duplicates
        return new ArrayList<>(new LinkedHashSet<>(list));
    }
}
```

**Example:**
- Input: `remove(Arrays.asList(1,2,2,3,4,4,5))`
- Output: `[1, 2, 3, 4, 5]`

#### Q83: Using `HashMap`, find the first repeating element in an array.
```java
import java.util.*;
public class FirstRepeating {
    public static int findFirst(int[] arr) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int val : arr) {
            map.put(val, map.getOrDefault(val, 0) + 1);
        }
        for (int val : arr) {
            if (map.get(val) > 1) return val;
        }
        return -1;
    }
}
```

**Example:**
- Input: `findFirst(new int[]{2,3,4,3,2,5})`
- Output: `2` (first element that appears more than once)

#### Q84: Given an array of strings, group anagrams together using `HashMap`.
```java
import java.util.*;
public class GroupAnagrams {
    public static List<List<String>> group(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<>());
            }
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }
}
```

**Example:**
- Input: `group(new String[]{"eat","tea","tan","ate","nat","bat"})`
- Output: `[[eat, tea, ate], [tan, nat], [bat]]`

#### Q85: Find all unique pairs in an array that sum up to a target using `HashSet`.
```java
import java.util.*;
public class UniquePairs {
    public static Set<String> getPairs(int[] nums, int target) {
        Set<Integer> seen = new HashSet<>();
        Set<String> result = new HashSet<>();
        for (int num : nums) {
            int complement = target - num;
            if (seen.contains(complement)) {
                int min = Math.min(num, complement);
                int max = Math.max(num, complement);
                result.add(min + "," + max);
            }
            seen.add(num);
        }
        return result;
    }
}
```

**Example:**
- Input: `getPairs(new int[]{1,2,3,4,5}, 6)`
- Output: `["1,5", "2,4"]` (pairs that sum to 6)

#### Q86: Implement a basic custom LRU (Least Recently Used) cache structure using `LinkedHashMap`.
```java
import java.util.*;
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // true = access-order
        this.capacity = capacity;
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

**Example:**
- `LRUCache<Integer,String> cache = new LRUCache<>(2); cache.put(1,"a"); cache.put(2,"b"); cache.get(1); cache.put(3,"c");`
- Output: key `2` is evicted (least recently used); cache contains `{1="a", 3="c"}`

#### Q87: Check if a map is a subset of another map (matching all keys and values).
```java
import java.util.*;
public class MapSubset {
    public static <K, V> boolean isSubset(Map<K, V> sub, Map<K, V> parent) {
        for (Map.Entry<K, V> entry : sub.entrySet()) {
            if (!parent.containsKey(entry.getKey())) return false;
            if (!Objects.equals(entry.getValue(), parent.get(entry.getKey()))) return false;
        }
        return true;
    }
}
```

**Example:**
- Input: `isSubset(Map.of("a",1), Map.of("a",1,"b",2))` → `true`
- Input: `isSubset(Map.of("a",9), Map.of("a",1,"b",2))` → `false`

#### Q88: Sort a list of strings by their lengths using a custom comparator.
```java
import java.util.*;
public class SortByLength {
    public static void sort(List<String> list) {
        list.sort((s1, s2) -> Integer.compare(s1.length(), s2.length()));
    }
}
```

**Example:**
- Input: `sort(Arrays.asList("banana","fig","apple","kiwi"))` → list becomes `["fig", "kiwi", "apple", "banana"]`

#### Q89: Find the intersection of two Lists preserving duplicate values.
```java
import java.util.*;
public class ListIntersection {
    public static List<Integer> getIntersection(List<Integer> l1, List<Integer> l2) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int val : l1) counts.put(val, counts.getOrDefault(val, 0) + 1);
        List<Integer> result = new ArrayList<>();
        for (int val : l2) {
            if (counts.containsKey(val) && counts.get(val) > 0) {
                result.add(val);
                counts.put(val, counts.get(val) - 1);
            }
        }
        return result;
    }
}
```

**Example:**
- Input: `getIntersection(Arrays.asList(1,2,2,3), Arrays.asList(2,2,4))`
- Output: `[2, 2]`

#### Q90: Implement the K-th largest element lookup in an unsorted array using `PriorityQueue` (Min-Heap).
```java
import java.util.*;
public class KLargest {
    public static int findKLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.add(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.isEmpty() ? -1 : minHeap.peek();
    }
}
```

**Example:**
- Input: `findKLargest(new int[]{3,2,1,5,6,4}, 2)`
- Output: `5` (2nd largest element)

#### Q91: Merge K sorted lists into a single sorted list using `PriorityQueue`.
```java
import java.util.*;
public class MergeKSorted {
    public static List<Integer> merge(List<List<Integer>> lists) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (List<Integer> list : lists) {
            minHeap.addAll(list);
        }
        List<Integer> result = new ArrayList<>();
        while (!minHeap.isEmpty()) {
            result.add(minHeap.poll());
        }
        return result;
    }
}
```

**Example:**
- Input: `merge(List.of(List.of(1,4), List.of(2,6), List.of(3,5)))`
- Output: `[1, 2, 3, 4, 5, 6]`

#### Q92: Find the top K most frequent elements in an array using `HashMap` and `PriorityQueue`.
```java
import java.util.*;
public class TopKFrequent {
    public static List<Integer> getTopK(int[] nums, int k) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int num : nums) counts.put(num, counts.getOrDefault(num, 0) + 1);
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap = 
            new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));
        for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {
            minHeap.add(entry);
            if (minHeap.size() > k) minHeap.poll();
        }
        List<Integer> result = new ArrayList<>();
        while (!minHeap.isEmpty()) result.add(minHeap.poll().getKey());
        Collections.reverse(result);
        return result;
    }
}
```

**Example:**
- Input: `getTopK(new int[]{1,1,1,2,2,3}, 2)`
- Output: `[1, 2]` (top 2 most frequent elements)

#### Q93: Search for the closest ceiling value to a target number inside a `TreeSet`.
```java
import java.util.*;
public class TreeSetCeiling {
    public static Integer findCeiling(TreeSet<Integer> set, int target) {
        return set.ceiling(target); // ceiling returns least element >= target
    }
}
```

**Example:**
- Input: `findCeiling(new TreeSet<>(Arrays.asList(1,3,5,7,9)), 4)`
- Output: `5`

#### Q94: Sort keys of a `HashMap` in descending order using `TreeMap`.
```java
import java.util.*;
public class SortMapKeys {
    public static <K, V> Map<K, V> sortDescending(Map<K, V> unsorted) {
        // Initialize TreeMap with custom reverse comparator
        TreeMap<K, V> sorted = new TreeMap<>(Collections.reverseOrder());
        sorted.putAll(unsorted);
        return sorted;
    }
}
```

**Example:**
- Input: `sortDescending(Map.of("a",1,"c",3,"b",2))`
- Output: `{c=3, b=2, a=1}` (keys in descending order)

#### Q95: Verify if a list of parentheses is balanced using a `Stack` (e.g. `{[()]}` is balanced).
```java
import java.util.*;
public class BalancedParentheses {
    public static boolean checkBalanced(String expression) {
        Stack<Character> stack = new Stack<>();
        for (char c : expression.toCharArray()) {
            if (c == '{' || c == '[' || c == '(') {
                stack.push(c);
            } else if (c == '}' || c == ']' || c == ')') {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == '}' && top != '{') || (c == ']' && top != '[') || (c == ')' && top != '(')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}
```

**Example:**
- Input: `checkBalanced("{[()]}")` → `true`
- Input: `checkBalanced("{[(]}")` → `false`

#### Q96: Remove duplicate nodes from a LinkedList without using additional memory (in-place).
```java
import java.util.*;
public class RemoveLinkedListDuplicates {
    public static void remove(LinkedList<Integer> list) {
        for (int i = 0; i < list.size(); i++) {
            int val = list.get(i);
            for (int j = i + 1; j < list.size(); j++) {
                if (list.get(j) == val) {
                    list.remove(j);
                    j--;
                }
            }
        }
    }
}
```

**Example:**
- Input: `LinkedList<Integer> list = [1,2,2,3,3]; remove(list)` → list becomes `[1, 2, 3]`

#### Q97: Convert an array of objects to a List of a specific sub-type dynamically.
```java
import java.util.*;
public class ArrayToListType {
    @SuppressWarnings("unchecked")
    public static <T> List<T> convert(Object[] arr) {
        List<T> list = new ArrayList<>();
        for (Object o : arr) {
            list.add((T) o);
        }
        return list;
    }
}
```

**Example:**
- Input: `convert(new Object[]{"x","y","z"})` → `["x", "y", "z"]` as `List<String>`

#### Q98: Reverse elements inside an ArrayList in groups of size K.
```java
import java.util.*;
public class ReverseInGroups {
    public static void reverseK(List<Integer> list, int k) {
        for (int i = 0; i < list.size(); i += k) {
            int left = i;
            int right = Math.min(i + k - 1, list.size() - 1);
            while (left < right) {
                int temp = list.get(left);
                list.set(left, list.get(right));
                list.set(right, temp);
                left++;
                right--;
            }
        }
    }
}
```

**Example:**
- Input: `reverseK(Arrays.asList(1,2,3,4,5,6), 2)` → list becomes `[2,1,4,3,6,5]`

#### Q99: Find the first non-matching element in two List iterators.
```java
import java.util.*;
public class IteratorMismatch {
    public static <T> int findMismatchIndex(List<T> l1, List<T> l2) {
        Iterator<T> it1 = l1.iterator();
        Iterator<T> it2 = l2.iterator();
        int index = 0;
        while (it1.hasNext() && it2.hasNext()) {
            if (!Objects.equals(it1.next(), it2.next())) {
                return index;
            }
            index++;
        }
        if (it1.hasNext() || it2.hasNext()) return index;
        return -1;
    }
}
```

**Example:**
- Input: `findMismatchIndex(List.of(1,2,3), List.of(1,9,3))`
- Output: `1` (index where values first differ)

#### Q100: Check if a given array represents a subset of another array using `HashSet`.
```java
import java.util.*;
public class ArraySubsetCheck {
    public static boolean isSubset(int[] sub, int[] parent) {
        Set<Integer> set = new HashSet<>();
        for (int val : parent) set.add(val);
        for (int val : sub) {
            if (!set.contains(val)) return false;
        }
        return true;
    }
}
```

**Example:**
- Input: `isSubset(new int[]{2,4}, new int[]{1,2,3,4,5})` → `true`
- Input: `isSubset(new int[]{2,9}, new int[]{1,2,3,4,5})` → `false`

#### Q101: Filter and extract all Map entries matching a specific value filter.
```java
import java.util.*;
public class MapFilter {
    public static <K, V> Map<K, V> filter(Map<K, V> map, java.util.function.Predicate<V> predicate) {
        Map<K, V> filtered = new HashMap<>();
        for (Map.Entry<K, V> entry : map.entrySet()) {
            if (predicate.test(entry.getValue())) {
                filtered.put(entry.getKey(), entry.getValue());
            }
        }
        return filtered;
    }
}
```

**Example:**
- Input: `filter(Map.of("a",5,"b",12,"c",3), v -> v > 4)`
- Output: `{a=5, b=12}`

#### Q102: Implement a custom circular queue using a fixed-size Java List representation.
```java
import java.util.*;
public class CircularQueue<T> {
    private final List<T> queue;
    private final int size;
    private int head = -1, tail = -1;
    public CircularQueue(int size) {
        this.size = size;
        this.queue = new ArrayList<>(Collections.nCopies(size, null));
    }
    public boolean enqueue(T value) {
        if ((tail + 1) % size == head) return false; // Full
        if (head == -1) head = 0;
        tail = (tail + 1) % size;
        queue.set(tail, value);
        return true;
    }
    public T dequeue() {
        if (head == -1) return null; // Empty
        T val = queue.get(head);
        if (head == tail) {
            head = -1;
            tail = -1;
        } else {
            head = (head + 1) % size;
        }
        return val;
    }
}
```

**Example:**
- `CircularQueue<Integer> q = new CircularQueue<>(3); q.enqueue(1); q.enqueue(2); q.dequeue();` → returns `1`; queue now holds `[2]`

#### Q103: Find the difference of two Sets (SetA - SetB) without modifying the original Sets.
```java
import java.util.*;
public class SetDifference {
    public static <T> Set<T> getDifference(Set<T> a, Set<T> b) {
        Set<T> diff = new HashSet<>(a);
        diff.removeAll(b);
        return diff;
    }
}
```

**Example:**
- Input: `getDifference(Set.of(1,2,3,4), Set.of(3,4,5))`
- Output: `[1, 2]`

#### Q104: Swap the keys and values of a HashMap (assuming values are unique).
```java
import java.util.*;
public class InvertMap {
    public static <K, V> Map<V, K> invert(Map<K, V> map) {
        Map<V, K> inverted = new HashMap<>();
        for (Map.Entry<K, V> entry : map.entrySet()) {
            inverted.put(entry.getValue(), entry.getKey());
        }
        return inverted;
    }
}
```

**Example:**
- Input: `invert(Map.of("a",1,"b",2))`
- Output: `{1="a", 2="b"}`

#### Q105: Partition a List of integers into two Lists representing odd and even values.
```java
import java.util.*;
public class ListPartition {
    public static Map<String, List<Integer>> partition(List<Integer> list) {
        Map<String, List<Integer>> result = new HashMap<>();
        result.put("even", new ArrayList<>());
        result.put("odd", new ArrayList<>());
        for (int val : list) {
            if (val % 2 == 0) {
                result.get("even").add(val);
            } else {
                result.get("odd").add(val);
            }
        }
        return result;
    }
}
```

**Example:**
- Input: `partition(Arrays.asList(1,2,3,4,5,6))`
- Output: `{even=[2,4,6], odd=[1,3,5]}`

---

## Part 4: JavaScript Basics, Promises & Chaining (20 Qs)

#### Q106: Explain the difference between `var`, `let`, and `const` inside JavaScript.
**Answer:**  
- `var`: Function-scoped, can be redeclared and reassigned. It is **hoisted** (initialized as `undefined`).
- `let`: Block-scoped, cannot be redeclared but can be reassigned. Hoisted but sits in the **Temporal Dead Zone (TDZ)** until the line is executed (throws ReferenceError if accessed early).
- `const`: Block-scoped, cannot be redeclared or reassigned. Must be initialized immediately. However, if holding an object/array, the properties/elements inside can still be mutated.

#### Q107: What is hoisting in JavaScript? Analyze the output of the following code.
```javascript
console.log(x);
var x = 5;
// console.log(y); -> ReferenceError!
let y = 10;
```
**Output:**  
`undefined`  
**Explanation:**  
The compilation phase hoists declarations to the top of their scopes. `var x` is hoisted and initialized as `undefined`. Hence, `console.log(x)` prints `undefined` before assignment happens. `let y` is hoisted but not initialized, resulting in a `ReferenceError` if accessed before declaration.

#### Q108: What is a Closure in JavaScript? Write an example.
**Answer:**  
A closure is a feature where an inner function retains access to the variables of its outer parent function, even after the outer function has returned.
```javascript
function createCounter() {
    let count = 0;
    return function() {
        count++;
        return count;
    };
}
const counter = createCounter();
console.log(counter()); // Prints: 1
console.log(counter()); // Prints: 2
```

#### Q109: Explain the JavaScript Event Loop, macro-tasks, and micro-tasks.
**Answer:**  
JavaScript is single-threaded. It uses the Event Loop to coordinate asynchronous execution.
- **Call Stack**: Executes synchronous code first.
- **Microtask Queue**: Houses Promise callbacks (`.then`, `.catch`), `MutationObserver`, and `process.nextTick`. This queue is completely drained *immediately* after the call stack clears, before moving on.
- **Macrotask (Callback) Queue**: Houses `setTimeout`, `setInterval`, `setImmediate`, and UI events. These execute one task per event loop tick after the microtask queue is cleared.

#### Q110: What is the output order of this Event Loop scheduling scenario?
```javascript
console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");
```
**Output:**  
`Start`  
`End`  
`Promise`  
`Timeout`  
**Explanation:**  
1. `Start` and `End` run synchronously (Call Stack).
2. The `setTimeout` callback goes to the Macrotask Queue.
3. The `Promise` callback goes to the Microtask Queue.
4. Call Stack clears. The Event Loop drains the Microtask Queue first, printing `Promise`.
5. The Event Loop checks the Macrotask Queue next, executing the timeout callback and printing `Timeout`.

#### Q111: What is a Promise in JavaScript? What are its three states?
**Answer:**  
A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value.  
Three States:
1. **Pending**: Initial state, neither fulfilled nor rejected.
2. **Fulfilled**: The operation completed successfully (resolves value).
3. **Rejected**: The operation failed (returns error).

#### Q112: How do you create and resolve a basic Promise?
```javascript
const myPromise = new Promise((resolve, reject) => {
    let success = true;
    if (success) {
        resolve("Data returned");
    } else {
        reject("Error occurred");
    }
});
myPromise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

**Example:**
- Input: `success = true` (promise resolves)
- Output: `Data returned`

#### Q113: What is Promise chaining? Explain how errors propagate down the chain.
**Answer:**  
Promise chaining is executing a sequence of asynchronous steps by returning a new Promise inside a `.then()` block:
```javascript
fetchUser(1)
    .then(user => fetchUserOrders(user.id))
    .then(orders => calculateTotal(orders))
    .then(total => console.log(total))
    .catch(err => console.error(err)); // Catches any error in the entire chain!
```
**Error Propagation**: If an error is thrown in *any* step of the chain, JavaScript halts subsequent `.then()` blocks and bubbles the error directly to the nearest `.catch()` handler.

#### Q114: Analyze the output of the following Promise chaining sequence.
```javascript
Promise.resolve(5)
    .then(val => {
        console.log(val);
        return val * 2;
    })
    .then(val => {
        console.log(val);
        throw new Error("Failure");
    })
    .catch(err => {
        console.log(err.message);
        return 100;
    })
    .then(val => {
        console.log(val);
    });
```
**Output:**  
`5`  
`10`  
`Failure`  
`100`  
**Explanation:**  
- First `.then()` receives `5`, prints `5`, and returns `10`.
- Second `.then()` receives `10`, prints `10`, and throws an error.
- The `.catch()` catches the error, prints `Failure`, and recovers the chain by returning `100`.
- Third `.then()` receives `100` and prints it.

#### Q115: What does `Promise.all()` do? What is its failure behavior?
**Answer:**  
`Promise.all(iterable)` runs multiple Promises in parallel and returns a single Promise that resolves to an array of results.  
**Failure Behavior**: It operates on an **all-or-nothing** model. If *any* input Promise rejects, the entire returned Promise rejects immediately with that error, discarding any successful resolutions from other Promises.

#### Q116: Write an example of `Promise.all()` and handle a potential failure.
```javascript
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = new Promise(res => setTimeout(() => res(30), 100));

Promise.all([p1, p2, p3])
    .then(results => console.log(results)) // Output after 100ms: [10, 20, 30]
    .catch(err => console.error(err));
```

#### Q117: What is the difference between `Promise.all()` and `Promise.allSettled()`?
**Answer:**  
- `Promise.all()`: Rejects immediately if *any* Promise fails.
- `Promise.allSettled()`: Waits for *all* input Promises to either fulfill or reject, returning an array of objects describing the outcome of each Promise (e.g. `{status: "fulfilled", value: val}` or `{status: "rejected", reason: err}`). It never rejects the aggregate wrapper.

#### Q118: What is the purpose of `Promise.race()`?
**Answer:**  
`Promise.race(iterable)` returns a Promise that resolves or rejects as soon as *one* of the input Promises resolves or rejects. It acts as an asynchronous race (the fastest Promise decides the outcome).

#### Q119: What is the difference between `Promise.race()` and `Promise.any()`?
**Answer:**  
- `Promise.race()`: Resolves or rejects based on whichever Promise finishes *first* (success or failure).
- `Promise.any()`: Resolves as soon as the *first successful* Promise resolves. It ignores rejections unless *every* input Promise fails, in which case it rejects with an `AggregateError`.

#### Q120: How does `async/await` simplify asynchronous JavaScript code?
**Answer:**  
`async/await` is syntactic sugar built on top of Promises. It allows writing asynchronous code that looks and behaves like synchronous code, eliminating nested `.then()` callbacks:
```javascript
async function getUserData() {
    try {
        const user = await fetchUser(1); // awaits resolution
        const orders = await fetchOrders(user.id);
        console.log(orders);
    } catch (err) {
        console.error(err); // try-catch handles errors
    }
}
```

#### Q121: What is the output of this async/await execution sequence?
```javascript
async function getNum() {
    console.log("Inside async");
    return 10;
}
console.log("Start");
getNum().then(val => console.log(val));
console.log("End");
```
**Output:**  
`Start`  
`Inside async`  
`End`  
`10`  
**Explanation:**  
Calling an `async` function executes its body synchronously until it hits an `await` statement or return. So `Inside async` is printed immediately when `getNum()` is invoked. The returned value `10` is wrapped in a resolved Promise, which registers its callback in the Microtask Queue, printing `10` after `End` executes.

#### Q122: How do you handle parallel executions inside `async/await` blocks without blocking sequential lines?
**Answer:**  
Instead of calling `await` on every line (which makes them run sequentially), trigger the operations first to get their Promises, then call `await` on `Promise.all()`:
```javascript
async function executeParallel() {
    // Slow (sequential):
    const userSeq = await fetchUser();
    const configSeq = await fetchConfig(); // Waits for fetchUser to complete!

    // Fast (parallel):
    const userPromise = fetchUser();
    const configPromise = fetchConfig(); // Starts simultaneously!
    const [userPar, configPar] = await Promise.all([userPromise, configPromise]);
}
```

#### Q123: What is the difference between `==` and `===` in JavaScript comparisons?
**Answer:**  
- `==` (abstract equality): Performs type coercion before comparing values (e.g. `5 == "5"` is `true`).
- `===` (strict equality): Compares both value and type without coercion (e.g. `5 === "5"` is `false`).

#### Q124: What is the output of the following comparison checks?
```javascript
console.log([] == false);
console.log(null == undefined);
console.log(null === undefined);
```
**Output:**  
`true`  
`true`  
`false`  
**Explanation:**  
- `[] == false`: JavaScript coerces empty array `[]` to an empty string `""`, which then coerces to `0`. `false` also coerces to `0`, resulting in equality.
- `null == undefined` is a special case in JavaScript specification (returns `true`).
- `null === undefined` is `false` because their types (`object` vs `undefined`) differ.

#### Q125: How do you convert a callback-based method to return a Promise (Promisification)?
**Answer:**  
Wrap the callback method inside a Promise constructor:
```javascript
// Callback method:
function loadData(id, callback) {
    // async work...
    callback(null, "success data");
}

// Promisified:
function loadDataPromise(id) {
    return new Promise((resolve, reject) => {
        loadData(id, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
```

---

## Part 5: Playwright & API Testing in JavaScript (20 Qs)

#### Q126: Write a basic Playwright test script in JavaScript verifying page title.
```javascript
const { test, expect } = require('@playwright/test');

test('Verify Home Title', async ({ page }) => {
    await page.goto('https://claims-dev.example.com');
    await expect(page).toHaveTitle(/Core Portal/);
});
```

**Example:**
- Input: page at `https://claims-dev.example.com` has `<title>Core Portal</title>`
- Output: test passes; assertion succeeds with title matching `/Core Portal/`

#### Q127: Explain the concept of BrowserContext isolation in Playwright JS.
**Answer:**  
In Playwright, a `Browser` process is created once. To run tests in parallel without sharing state, Playwright instantiates a new `BrowserContext` for each test runner thread. A `BrowserContext` acts as an incognito session cache, isolating cookies, local storage, and history, ensuring tests run concurrently with zero cross-test state leak.

#### Q128: How do you capture cookies and storage state to bypass login in subsequent test runs?
**Answer:**  
We perform login in a global setup step, save the context state to a JSON file, and then load that state when creating subsequent contexts:
```javascript
// Save state:
await page.context().storageState({ path: 'auth.json' });

// Load state in test:
test.use({ storageState: 'auth.json' });
test('Bypassed test', async ({ page }) => {
    await page.goto('/dashboard'); // Already logged in!
});
```

#### Q129: How do you select elements hidden inside a Shadow DOM in Playwright?
**Answer:**  
Playwright traverses the Shadow DOM natively. Unlike Selenium, which requires executing custom JavaScript shadow-root selectors, Playwright's locator search engine passes through open shadow roots automatically:
```javascript
// Locates input inside shadow DOM natively
await page.locator('input#shadow-input-id').fill('test data');
```

#### Q130: Write a Playwright script to handle and click a button inside an `iframe`.
```javascript
test('Iframe interaction', async ({ page }) => {
    await page.goto('https://claims-dev.example.com');
    // FrameLocator targets frame by selector
    const frame = page.frameLocator('iframe#claim-upload-frame');
    await frame.locator('button#submit-doc').click();
});
```

**Example:**
- Input: page contains `<iframe id="claim-upload-frame">` with a `<button id="submit-doc">` inside
- Output: button inside iframe is clicked; test passes

#### Q131: How do you intercept and mock API responses in Playwright JS?
**Answer:**  
We use `page.route()` to match target network URLs and return custom mocked payloads:
```javascript
await page.route('**/api/tasks', async route => {
    const json = [{ id: 1, name: 'Mocked Task' }];
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(json),
    });
});
await page.goto('/tasks'); // Shows mocked task data!
```

#### Q132: Write a script to wait for a specific API response to complete before continuing UI actions.
```javascript
test('Wait for network response', async ({ page }) => {
    await page.goto('/claims');
    // Wait for network event and click simultaneously
    const [response] = await Promise.all([
        page.waitForResponse('**/api/claims/details'),
        page.locator('button#view-claim-btn').click()
    ]);
    expect(response.status()).toBe(200);
});
```

**Example:**
- Input: clicking `#view-claim-btn` triggers `GET /api/claims/details` returning HTTP 200
- Output: `response.status()` → `200`; assertion passes

#### Q133: How do you handle native browser dialogs (alerts, confirms) in Playwright JS?
**Answer:**  
Playwright auto-dismisses dialogs by default. To interact with them, register a dialog listener before triggering the event:
```javascript
page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept('User input'); // Accepts confirm dialogs
});
await page.locator('button#trigger-alert').click();
```

#### Q134: How do you perform a file upload in Playwright JS?
**Answer:**  
We use the `.setInputFiles()` locator method on target file input elements:
```javascript
// Select input and attach local path
await page.locator('input[type="file"]').setInputFiles('path/to/claim-doc.pdf');
```

#### Q135: How do you wait for custom element actionability states in Playwright?
**Answer:**  
Playwright waits for element visibility, stability, and enabled status automatically before firing actions. If a custom wait is needed, pass options to assertions or use `.waitFor()`:
```javascript
// Wait for element to attach to DOM
await page.locator('div#loader').waitFor({ state: 'detached', timeout: 5000 });
```

#### Q136: Write a REST API test validation script using Playwright's built-in `request` utility.
```javascript
const { test, expect } = require('@playwright/test');

test('Validate GET API', async ({ request }) => {
    const response = await request.get('https://claims-dev.example.com/api/tasks/1');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.taskName).toBe('Review Document');
});
```

**Example:**
- Input: `GET /api/tasks/1` returns `{"taskName": "Review Document", "id": 1}`
- Output: `response.ok()` → `true`; `body.taskName` → `"Review Document"`; test passes

#### Q137: How do you share the authenticated request state from UI tests to your API tests in Playwright?
**Answer:**  
Extract the cookies from the UI test's `browserContext` and assign them to the request options map:
```javascript
const cookies = await context.cookies();
const apiContext = await playwright.request.newContext({
    extraHTTPHeaders: {
        'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; ')
    }
});
const response = await apiContext.get('/api/secure-endpoint');
```

#### Q138: Write a script to validate a POST request returning a JSON token.
```javascript
test('Validate Token Return', async ({ request }) => {
    const response = await request.post('/api/auth', {
        data: { username: 'user1', password: 'password' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeDefined();
});
```

**Example:**
- Input: `POST /api/auth` with `{username:"user1",password:"password"}` returns `{"token":"abc123"}`
- Output: `response.status()` → `200`; `body.token` → `"abc123"`; assertion passes

#### Q139: How do you drag and drop an element in Playwright JS?
```javascript
// Locate source and drag to destination locator
await page.locator('div#source').dragTo(page.locator('div#target'));
```

#### Q140: How do you inspect elements inside dynamically shifting dropdown menus?
**Answer:**  
Configure Playwright's codegen utility to record executions, or pause execution using `await page.pause()` to freeze the browser state and inspect the DOM directly in Playwright Inspector.

#### Q141: Write a Playwright script that checks if a checkbox is checked.
```javascript
const locator = page.locator('input#agree-terms');
await locator.check();
await expect(locator).toBeChecked();
```

**Example:**
- Input: `<input type="checkbox" id="agree-terms">` (initially unchecked)
- Output: `.check()` checks the box; `toBeChecked()` assertion passes

#### Q142: How do you run Playwright tests in parallel across multiple browsers?
**Answer:**  
Configure the `projects` section in your `playwright.config.js` file:
```javascript
module.exports = {
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
};
```

#### Q143: How do you execute keyboard key presses (e.g., pressing Enter) in Playwright?
```javascript
await page.locator('input#search-box').fill('claim id');
await page.keyboard.press('Enter');
```

**Example:**
- Input: `<input id="search-box">` filled with `"claim id"`, then Enter pressed
- Output: browser submits the search; page navigates to search results

#### Q144: Write a script to extract text from a table containing multiple rows.
```javascript
test('Extract table rows', async ({ page }) => {
    await page.goto('/claims');
    const rows = page.locator('table#claims-table tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
        const rowText = await rows.nth(i).innerText();
        console.log(`Row ${i}: ${rowText}`);
    }
});
```

**Example:**
- Input: table with 3 rows containing text `"Claim A"`, `"Claim B"`, `"Claim C"`
- Output: `Row 0: Claim A`, `Row 1: Claim B`, `Row 2: Claim C` printed to console

#### Q145: How do you assert that a REST API response matches a specific JSON Schema in JS?
**Answer:**  
Use libraries like `ajv` (Another JSON Schema Validator) inside your Playwright test execution script:
```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' }
    },
    required: ['id', 'name']
};

test('Validate Schema', async ({ request }) => {
    const response = await request.get('/api/item');
    const data = await response.json();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBeTruthy();
});
```

**Example:**
- Input: `GET /api/item` returns `{"id": 42, "name": "Claim Form"}`
- Output: schema validation passes; `valid` → `true`; assertion succeeds
