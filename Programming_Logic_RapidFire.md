# Programming Logic — Rapid Fire Revision

Interview logic problems with ELI20 breakdowns. Pattern-first, code-second. Every problem has a **"the trick"** line — memorise that one line and the rest follows.

> **How to use this:** Read the problem. Try to solve it mentally for 30 seconds. Then read "The Trick" — just one sentence. Then read the code. If the trick makes the code obvious, you've got it.

---

## Table of Contents

- **Section 1 — Array Problems**
- **Section 2 — String Problems**
- **Section 3 — Number / Math Tricks**
- **Section 4 — Linked List Patterns**
- **Section 5 — Stack & Queue Patterns**
- **Section 6 — HashMap Patterns**
- **Section 7 — Two Pointer Patterns**
- **Section 8 — Sorting & Searching**
- **Section 9 — Recursion Mental Models**
- **Section 10 — Java-Specific Logic Traps**

---

## Section 1 — Array Problems

---

### P1. Find the maximum and minimum in an array in one pass

**The Trick:** Track both in the same loop — one variable for max, one for min.

```java
int max = arr[0], min = arr[0];
for (int n : arr) {
    if (n > max) max = n;
    if (n < min) min = n;
}
// Result: max=largest, min=smallest — only ONE pass, O(n)
```

---

### P2. Find the missing number in an array of 1 to N

**The Trick:** Expected sum of 1..N = `N*(N+1)/2`. Subtract actual sum. The difference IS the missing number.

```java
int n = arr.length + 1;           // array has n-1 elements
int expected = n * (n + 1) / 2;  // sum if nothing was missing
int actual = 0;
for (int x : arr) actual += x;
int missing = expected - actual;
// O(n) time, O(1) space. No sorting needed.
```

---

### P3. Find the duplicate in an array of 1 to N

**The Trick:** Same sum formula. `sum - expected = duplicate` (only when exactly one duplicate).

```java
int n = arr.length - 1;           // N elements + 1 duplicate = n+1 length
int expected = n * (n + 1) / 2;
int actual = 0;
for (int x : arr) actual += x;
int duplicate = actual - expected;
```

---

### P4. Rotate an array right by K positions

**The Trick:** Reverse the whole array, reverse the first K, reverse the rest.

```java
void rotate(int[] arr, int k) {
    k = k % arr.length;       // handle k > length
    reverse(arr, 0, arr.length - 1);  // reverse all:    [1,2,3,4,5] → [5,4,3,2,1]
    reverse(arr, 0, k - 1);           // reverse first k: [5,4] → [4,5]
    reverse(arr, k, arr.length - 1);  // reverse rest:    [3,2,1] → [1,2,3]
}                                     // Result: [4,5,1,2,3] ✓ (rotated right by 2)

void reverse(int[] arr, int l, int r) {
    while (l < r) { int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t; }
}
```

---

### P5. Find the second largest element

**The Trick:** One pass, two variables — `first` and `second`. Update `second` when you find something smaller than `first` but larger than current `second`.

```java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int n : arr) {
    if (n > first) { second = first; first = n; }
    else if (n > second && n != first) second = n;
}
// second holds the 2nd largest — O(n), no sorting
```

---

### P6. Move all zeros to the end without changing order of non-zeros

**The Trick:** Two-pointer write position. Walk through array, write non-zeros to front, fill the rest with zeros.

```java
int writePos = 0;
for (int n : arr) {
    if (n != 0) arr[writePos++] = n;   // collect non-zeros at front
}
while (writePos < arr.length) arr[writePos++] = 0;  // fill rest with zeros
// [0,1,0,3,12] → [1,3,12,0,0]
```

---

## Section 2 — String Problems

---

### P7. Check if a String is a palindrome (ignoring case and non-alphanumeric)

**The Trick:** Two pointers from both ends, skip non-alphanumeric characters, compare lowercase.

```java
int l = 0, r = s.length() - 1;
while (l < r) {
    while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
    while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
    if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
        return false;
    l++; r--;
}
return true;
// "A man, a plan, a canal: Panama" → true
```

---

### P8. Find longest substring WITHOUT repeating characters

**The Trick:** Sliding window — expand right, shrink left when a duplicate enters the window.

```java
Map<Character, Integer> lastSeen = new HashMap<>();
int max = 0, left = 0;

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
        left = lastSeen.get(c) + 1;   // shrink: move left past the duplicate
    }
    lastSeen.put(c, right);
    max = Math.max(max, right - left + 1);
}
// "abcabcbb" → 3 ("abc")
```

---

### P9. Check if one String is a rotation of another

**The Trick:** `s2` is always a substring of `s1 + s1` if and only if they are rotations.

```java
boolean isRotation(String s1, String s2) {
    if (s1.length() != s2.length()) return false;
    return (s1 + s1).contains(s2);
    // "waterbottle" rotation of "erbottlewat"?
    // "waterbottlewaterbottle".contains("erbottlewat") → true ✓
}
```

---

### P10. Compress a String (run-length encoding)

**The Trick:** Walk through, count consecutive same chars, append char + count if count > 1.

```java
StringBuilder sb = new StringBuilder();
int i = 0;
while (i < s.length()) {
    char c = s.charAt(i);
    int count = 0;
    while (i < s.length() && s.charAt(i) == c) { count++; i++; }
    sb.append(c);
    if (count > 1) sb.append(count);
}
// "aabcccdddd" → "a2bc3d4"
```

---

### P11. Reverse words in a sentence

**The Trick:** Split on spaces, reverse the array of words, join back.

```java
String[] words = s.trim().split("\\s+");
int l = 0, r = words.length - 1;
while (l < r) { String t = words[l]; words[l++] = words[r]; words[r--] = t; }
return String.join(" ", words);
// "the sky is blue" → "blue is sky the"
```

---

## Section 3 — Number / Math Tricks

---

### P12. Check if a number is a power of 2

**The Trick:** A power of 2 has exactly ONE bit set. `n & (n-1)` clears the lowest set bit — if the result is 0, only one bit was set.

```java
boolean isPowerOf2(int n) {
    return n > 0 && (n & (n - 1)) == 0;
    // 8 = 1000, 7 = 0111 → 8 & 7 = 0000 → true ✓
    // 6 = 0110, 5 = 0101 → 6 & 5 = 0100 → false ✓
}
```

---

### P13. Find factorial iteratively and recursively

**The Trick:** Iterative avoids stack overflow for large N. Recursive is elegant but limited to ~N=12 before overflow for `int`.

```java
// Iterative (preferred for N > 12)
long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

// Recursive (shows understanding of base case)
long factorial(int n) {
    if (n <= 1) return 1;         // BASE CASE — must have this or infinite recursion
    return n * factorial(n - 1); // RECURSIVE CASE
}
```

---

### P14. Check if a number is prime

**The Trick:** Only check divisors up to √n. If no divisor found below √n, it's prime.

```java
boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= Math.sqrt(n); i++) {  // only up to √n
        if (n % i == 0) return false;
    }
    return true;
    // Why √n? If n = a*b and a > √n, then b < √n — we'd have caught b already.
}
```

---

### P15. FizzBuzz (the classic — always asked verbatim)

**The Trick:** Check divisibility by 15 FIRST (both conditions), then 3, then 5. Order matters.

```java
for (int i = 1; i <= 100; i++) {
    if      (i % 15 == 0) System.out.println("FizzBuzz");
    else if (i % 3  == 0) System.out.println("Fizz");
    else if (i % 5  == 0) System.out.println("Buzz");
    else                   System.out.println(i);
}
```

---

### P16. Fibonacci — iterative (most efficient)

**The Trick:** You only need the last two numbers at any time — no array needed.

```java
int fibonacci(int n) {
    if (n <= 1) return n;
    int prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
    // fib(7) → 0,1,1,2,3,5,8,13 → returns 13
}
```

---

## Section 4 — Linked List Patterns

---

### P17. Reverse a Linked List

**The Trick:** Three pointers: `prev`, `current`, `next`. Each step: save next, flip the arrow, move forward.

```java
ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;  // 1. save next
    curr.next = prev;           // 2. flip arrow backward
    prev = curr;                // 3. move prev forward
    curr = next;                // 4. move curr forward
}
return prev;  // prev is now the new head
// 1→2→3→4 becomes 4→3→2→1
```

---

### P18. Detect a cycle in a Linked List

**The Trick:** Slow pointer moves 1 step, fast pointer moves 2 steps. If they ever meet, there's a cycle. (Floyd's cycle detection.)

```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;        // move 1
    fast = fast.next.next;   // move 2
    if (slow == fast) return true;  // they met — cycle exists
}
return false;
// Think of a race track: the fast runner laps the slow runner eventually
```

---

### P19. Find the middle of a Linked List

**The Trick:** Same two-pointer trick. When fast reaches the end, slow is at the middle.

```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;  // slow is at the middle when fast hits the end
```

---

## Section 5 — Stack & Queue Patterns

---

### P20. Valid Parentheses (brackets balancing)

**The Trick:** Push opening brackets onto a stack. When you see a closing bracket, check if the top of the stack is its matching opener.

```java
Deque<Character> stack = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') {
        stack.push(c);                       // push opener
    } else {
        if (stack.isEmpty()) return false;   // closing but nothing opened
        char top = stack.pop();
        if (c == ')' && top != '(') return false;
        if (c == ']' && top != '[') return false;
        if (c == '}' && top != '{') return false;
    }
}
return stack.isEmpty();  // true only if every opener was closed
// "([])" → true, "([)]" → false
```

---

### P21. Implement a stack using two queues

**The Trick:** On `push`, add to queue2, move all of queue1 into queue2, swap names. This keeps the most recent element at the front.

```java
Queue<Integer> q1 = new LinkedList<>(), q2 = new LinkedList<>();

void push(int x) {
    q2.add(x);
    while (!q1.isEmpty()) q2.add(q1.poll());
    Queue<Integer> temp = q1; q1 = q2; q2 = temp;
}
int pop()  { return q1.poll(); }
int top()  { return q1.peek(); }
```

---

## Section 6 — HashMap Patterns

---

### P22. Two Sum — find two indices that add to target

**The Trick:** Store each number's index in a HashMap. For each number, check if `target - number` is already in the map.

```java
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
        return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
}
// nums=[2,7,11,15], target=9 → [0,1] (2+7=9)
// Why: when we see 7, we ask "have I seen 2 before?" — yes → return both indices
```

---

### P23. Group anagrams together

**The Trick:** Sort each word's characters — anagrams become identical when sorted. Use sorted form as HashMap key.

```java
Map<String, List<String>> map = new HashMap<>();
for (String word : words) {
    char[] chars = word.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);              // "eat","tea","ate" all → "aet"
    map.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(map.values());
```

---

### P24. Find the most frequent element in an array

**The Trick:** Count frequencies in a HashMap, then find the key with the max value.

```java
Map<Integer, Integer> freq = new HashMap<>();
for (int n : arr) freq.merge(n, 1, Integer::sum);  // count occurrences

int maxEl = arr[0], maxCount = 0;
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    if (e.getValue() > maxCount) { maxCount = e.getValue(); maxEl = e.getKey(); }
}
return maxEl;
```

---

## Section 7 — Two Pointer Patterns

---

### P25. Remove duplicates from a SORTED array in-place

**The Trick:** Write pointer tracks where to write next unique element. Walk through and only write when value changes.

```java
if (arr.length == 0) return 0;
int writePos = 1;
for (int i = 1; i < arr.length; i++) {
    if (arr[i] != arr[i - 1]) {    // new unique element found
        arr[writePos++] = arr[i];   // write it to the front
    }
}
return writePos;  // count of unique elements
// [1,1,2,3,3] → [1,2,3,_,_], returns 3
```

---

### P26. Container with most water (max area between two lines)

**The Trick:** Start with widest container (l=0, r=end). Move the SHORTER side inward — moving the taller side can only decrease area.

```java
int l = 0, r = height.length - 1, maxArea = 0;
while (l < r) {
    int area = Math.min(height[l], height[r]) * (r - l);
    maxArea = Math.max(maxArea, area);
    if (height[l] < height[r]) l++;  // move shorter side
    else r--;
}
return maxArea;
```

---

### P27. Three Sum — find all triplets that sum to zero

**The Trick:** Sort the array. Fix one element, use two pointers on the rest.

```java
Arrays.sort(nums);
List<List<Integer>> result = new ArrayList<>();
for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i-1]) continue;  // skip duplicates
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
        int sum = nums[i] + nums[l] + nums[r];
        if      (sum == 0) { result.add(Arrays.asList(nums[i], nums[l++], nums[r--])); }
        else if (sum < 0)  l++;
        else               r--;
    }
}
return result;
```

---

## Section 8 — Sorting & Searching

---

### P28. Binary Search — find element in sorted array

**The Trick:** At each step, eliminate HALF the search space. Compare middle element to target.

```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // avoids integer overflow vs (l+r)/2
        if      (arr[mid] == target) return mid;
        else if (arr[mid] < target)  left = mid + 1;   // target is in right half
        else                         right = mid - 1;  // target is in left half
    }
    return -1;  // not found
    // O(log n) — each step halves the search space
}
```

---

### P29. Bubble Sort — explain and write

**The Trick:** "Bubble" the largest unsorted element to the end on each pass.

```java
for (int i = 0; i < arr.length - 1; i++) {
    for (int j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
        }
    }
}
// O(n²) time — good to know, never use in production
```

---

### P30. When to use which sorting algorithm?

| Scenario | Algorithm | Why |
|---|---|---|
| General purpose | `Arrays.sort()` (Timsort) | O(n log n), handles nearly-sorted well |
| Nearly sorted | Insertion sort | O(n) best case |
| Count occurrences (small range) | Counting sort | O(n+k) |
| Interview quicksort question | Quicksort | O(n log n) avg, O(n²) worst, explain pivot |
| Stability required | Merge sort | O(n log n), stable |

---

## Section 9 — Recursion Mental Models

---

### P31. How to think through ANY recursion problem

**The framework — 3 questions every time:**

```
1. BASE CASE   — when do I stop? (n==0, list is empty, index out of bounds)
2. WHAT I DO   — what single step do I take at THIS level?
3. TRUST       — trust that recursive call correctly solves the smaller problem

// Template:
ReturnType solve(input) {
    if (BASE CASE) return BASE_VALUE;
    // do something at this level
    return combine(this_level_result, solve(smaller_input));
}
```

---

### P32. Sum of all elements in a nested array (recursion)

```java
int sum(int[] arr) {
    if (arr.length == 0) return 0;                   // base case
    return arr[0] + sum(Arrays.copyOfRange(arr, 1, arr.length));  // first + rest
}
// Think: "sum of array = first element + sum of everything else"
```

---

### P33. Power function — x to the power n

**The Trick:** If n is even, `x^n = (x^(n/2))^2`. This makes it O(log n) instead of O(n).

```java
double power(double x, int n) {
    if (n == 0) return 1;
    if (n < 0)  return 1.0 / power(x, -n);
    if (n % 2 == 0) {
        double half = power(x, n / 2);
        return half * half;              // key optimisation
    }
    return x * power(x, n - 1);
}
```

---

## Section 10 — Java-Specific Logic Traps

---

### P34. Integer overflow trap

```java
int a = Integer.MAX_VALUE;  // 2,147,483,647
int b = a + 1;              // OVERFLOW → becomes -2,147,483,648 (wraps around)

// Fix: use long
long safe = (long) a + 1;   // 2,147,483,648 ✓

// Common in: binary search mid = (l + r) / 2 can overflow if l+r > MAX_INT
// Safe: mid = l + (r - l) / 2
```

---

### P35. String concatenation in a loop — performance trap

```java
// BAD — creates a new String object on EVERY iteration → O(n²)
String result = "";
for (int i = 0; i < 10000; i++) result += "a";

// GOOD — StringBuilder mutates in place → O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) sb.append("a");
String result = sb.toString();
```

---

### P36. `int[]` vs `Integer[]` — sorting difference

```java
int[] arr = {3, 1, 4, 1, 5};
Arrays.sort(arr);                       // sorts in-place ✓

int[] desc = {3, 1, 4};
Arrays.sort(desc);                       // Arrays.sort(int[]) has NO comparator overload
// To sort descending you MUST use Integer[]:
Integer[] descArr = {3, 1, 4};
Arrays.sort(descArr, Comparator.reverseOrder());  // ✓
```

---

### P37. Modifying a list while iterating — ConcurrentModificationException

```java
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

// BAD — throws ConcurrentModificationException
for (Integer n : list) {
    if (n % 2 == 0) list.remove(n);
}

// GOOD — use Iterator
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();  // safe removal via iterator
}

// Also GOOD — Java 8 removeIf
list.removeIf(n -> n % 2 == 0);
```

---

### P38. Pass by value vs pass by reference in Java

> **ELI20:** Java is ALWAYS pass-by-value. But for objects, the "value" being passed is the memory address (reference). So you CAN mutate the object's internals, but you CAN'T make the original variable point to a new object.

```java
void changeValue(int x) { x = 99; }  // does nothing — x is a copy
void changeList(List<Integer> list) { list.add(5); }  // DOES work — mutates the object

int a = 1;
changeValue(a);   // a is still 1

List<Integer> myList = new ArrayList<>();
changeList(myList);  // myList now has [5] — the object was mutated
```

---

### P39. `static` variable shared across all instances — the trap

```java
class Counter {
    static int count = 0;  // shared by ALL instances
    int id;

    Counter() { id = ++count; }
}

Counter c1 = new Counter();  // count=1, c1.id=1
Counter c2 = new Counter();  // count=2, c2.id=2
Counter c3 = new Counter();  // count=3, c3.id=3

// c1.count == 3 — all instances see the same count!
// In parallel tests: static fields cause race conditions → use ThreadLocal instead
```

---

### P40. Short-circuit evaluation

```java
// && short-circuits: if first is false, second is NEVER evaluated
if (list != null && list.size() > 0) { }  // safe — no NPE even if list is null

// || short-circuits: if first is true, second is NEVER evaluated
if (cache != null || loadFromDB()) { }  // loadFromDB() only called if cache is null

// Practical test automation use:
if (element != null && element.isVisible()) { }  // safe null check before method call
```

---

## Quick Revision — Pattern Cheat Sheet

| Problem type | Pattern to reach for | Key data structure |
|---|---|---|
| Find pair/triplet with target sum | Two pointers or HashMap | HashMap or sorted array |
| Longest/shortest subarray/substring | Sliding window | Two pointers + HashMap |
| Detect cycle | Fast/slow pointers | Two pointers |
| Balanced brackets | Stack | Deque / Stack |
| Frequency counting | HashMap | HashMap |
| Sorted array search | Binary search | Two pointers |
| Tree traversal | Recursion | Stack (DFS) / Queue (BFS) |
| All combinations | Backtracking | Recursion + list |
| Optimise with memoisation | Dynamic programming | HashMap / array cache |
| In-place array modification | Write pointer | Single pointer |
