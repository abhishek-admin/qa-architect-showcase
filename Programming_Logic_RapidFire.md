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

```
Input:  [3, 1, 7, 2, 9, 4]   → max = 9,  min = 1
Input:  [5]                   → max = 5,  min = 5
Input:  [-3, -1, -7]          → max = -1, min = -7
Input:  [4, 4, 4]             → max = 4,  min = 4
```

```java
int max = arr[0], min = arr[0];   // start with first element as both
for (int n : arr) {
    if (n > max) max = n;
    if (n < min) min = n;
}
// [3,1,7,2,9,4]: max tracks 3→7→9, min tracks 3→1 — only ONE pass, O(n)
```

---

### P2. Find the missing number in an array of 1 to N

**The Trick:** Expected sum of 1..N = `N*(N+1)/2`. Subtract actual sum. The difference IS the missing number.

```
Input:  [1, 2, 4, 5]          → Output: 3   (N=5, expected=15, actual=12, missing=3)
Input:  [2, 3, 4, 5]          → Output: 1
Input:  [1, 2, 3, 4]          → Output: 5
Input:  [1]                   → Output: 2   (N=2, expected=3, actual=1, missing=2)
```

```java
int n = arr.length + 1;           // array has n-1 elements (one is missing)
int expected = n * (n + 1) / 2;  // sum 1+2+3+4+5 = 15
int actual = 0;
for (int x : arr) actual += x;   // 1+2+4+5 = 12
int missing = expected - actual; // 15 - 12 = 3 ✓
// O(n) time, O(1) space. No sorting needed.
```

---

### P3. Find the duplicate in an array of 1 to N

**The Trick:** Same sum formula but reversed. `actual sum - expected sum = duplicate`.

```
Input:  [1, 3, 4, 2, 2]       → Output: 2   (N=4, expected=10, actual=12, dup=2)
Input:  [3, 1, 3, 4, 2]       → Output: 3
Input:  [1, 1]                → Output: 1
```

```java
int n = arr.length - 1;           // N distinct values + 1 duplicate = n+1 length
int expected = n * (n + 1) / 2;  // what sum SHOULD be with no dup
int actual = 0;
for (int x : arr) actual += x;
int duplicate = actual - expected; // extra sum came from the duplicate
// [1,3,4,2,2]: n=4, expected=10, actual=12, duplicate=2 ✓
```

---

### P4. Rotate an array right by K positions

**The Trick:** Reverse the whole array, reverse the first K, reverse the rest.

```
Input:  arr=[1,2,3,4,5], k=2  → Output: [4,5,1,2,3]
Input:  arr=[1,2,3],     k=1  → Output: [3,1,2]
Input:  arr=[1,2,3],     k=3  → Output: [1,2,3]  (full rotation = same)
Input:  arr=[1,2,3],     k=4  → Output: [3,1,2]  (k%3 = 1)
```

```java
void rotate(int[] arr, int k) {
    k = k % arr.length;                        // k=7 on length 5 → k=2
    reverse(arr, 0, arr.length - 1);  // [1,2,3,4,5] → [5,4,3,2,1]
    reverse(arr, 0, k - 1);           // [5,4] → [4,5]     (first k elements)
    reverse(arr, k, arr.length - 1);  // [3,2,1] → [1,2,3] (rest)
}                                     // Result: [4,5,1,2,3] ✓

void reverse(int[] arr, int l, int r) {
    while (l < r) { int t = arr[l]; arr[l++] = arr[r]; arr[r--] = t; }
}
```

---

### P5. Find the second largest element

**The Trick:** One pass, two variables — `first` and `second`. Update `second` when you find something smaller than `first` but larger than current `second`.

```
Input:  [3, 1, 4, 1, 5, 9, 2]  → Output: 5
Input:  [10, 10, 10]            → Output: none (no distinct 2nd largest)
Input:  [1, 2]                  → Output: 1
Input:  [5, 3, 1, 4, 2]        → Output: 4
```

```java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int n : arr) {
    if (n > first) {
        second = first;   // old first becomes second
        first = n;        // new first
    } else if (n > second && n != first) {
        second = n;       // new second (must be distinct from first)
    }
}
// [3,1,4,1,5,9,2]: first=9, second=5 ✓ — O(n), no sorting
```

---

### P6. Move all zeros to the end without changing order of non-zeros

**The Trick:** Write pointer — collect all non-zeros at the front, then fill the rest with zeros.

```
Input:  [0, 1, 0, 3, 12]   → Output: [1, 3, 12, 0, 0]
Input:  [0, 0, 0, 1]       → Output: [1, 0, 0, 0]
Input:  [1, 2, 3]          → Output: [1, 2, 3]  (no zeros, unchanged)
Input:  [0, 0]             → Output: [0, 0]
```

```java
int writePos = 0;
for (int n : arr) {
    if (n != 0) arr[writePos++] = n;   // copy non-zeros to front
}
while (writePos < arr.length) arr[writePos++] = 0;  // fill the rest with 0

// [0,1,0,3,12]:
// writePos after loop: arr=[1,3,12,3,12], writePos=3
// fill from 3: arr=[1,3,12,0,0] ✓
```

---

## Section 2 — String Problems

---

### P7. Check if a String is a palindrome (ignoring case and non-alphanumeric)

**The Trick:** Two pointers from both ends, skip non-alphanumeric characters, compare lowercase.

```
Input:  "racecar"                     → Output: true
Input:  "A man, a plan, a canal: Panama" → Output: true  (spaces/punctuation ignored)
Input:  "hello"                       → Output: false
Input:  " "                           → Output: true   (blank is palindrome)
Input:  "0P"                          → Output: false
```

```java
int l = 0, r = s.length() - 1;
while (l < r) {
    while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;  // skip non-alnum
    while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;  // skip non-alnum
    if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r)))
        return false;
    l++; r--;
}
return true;
// "A man, a plan, a canal: Panama"
// skip spaces/commas/colon → compare A==a ✓, m==m ✓, a==a ✓ ... → true
```

---

### P8. Find longest substring WITHOUT repeating characters

**The Trick:** Sliding window — expand right, shrink left when a duplicate enters the window.

```
Input:  "abcabcbb"   → Output: 3  (substring "abc")
Input:  "bbbbb"      → Output: 1  (substring "b")
Input:  "pwwkew"     → Output: 3  (substring "wke")
Input:  ""           → Output: 0
Input:  "abcdef"     → Output: 6  (all unique, whole string)
```

```java
Map<Character, Integer> lastSeen = new HashMap<>();  // char → last index seen
int max = 0, left = 0;

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
        left = lastSeen.get(c) + 1;   // move left past the previous occurrence
    }
    lastSeen.put(c, right);
    max = Math.max(max, right - left + 1);
}
// "abcabcbb": window grows a,b,c → sees 'a' again → shrink left to 1
// max window = 3 ("abc") ✓
```

---

### P9. Check if one String is a rotation of another

**The Trick:** `s2` is always a substring of `s1 + s1` if and only if they are rotations.

```
Input:  s1="waterbottle", s2="erbottlewat"  → Output: true
Input:  s1="abc",         s2="cab"          → Output: true
Input:  s1="abc",         s2="bca"          → Output: true
Input:  s1="abc",         s2="acb"          → Output: false  (different order, not rotation)
Input:  s1="aa",          s2="ab"           → Output: false  (different chars)
```

```java
boolean isRotation(String s1, String s2) {
    if (s1.length() != s2.length()) return false;
    return (s1 + s1).contains(s2);
}
// "waterbottle" + "waterbottle" = "waterbottlewaterbottle"
// contains "erbottlewat"? → YES ✓
// "abc" + "abc" = "abcabc" → contains "cab"? YES ✓
// "abc" + "abc" = "abcabc" → contains "acb"? NO ✓
```

---

### P10. Compress a String (run-length encoding)

**The Trick:** Walk through, count consecutive same chars, append char + count if count > 1.

```
Input:  "aabcccdddd"   → Output: "a2bc3d4"
Input:  "aabb"         → Output: "a2b2"
Input:  "abc"          → Output: "abc"    (no compression — all singles)
Input:  "aaaa"         → Output: "a4"
Input:  "a"            → Output: "a"
```

```java
StringBuilder sb = new StringBuilder();
int i = 0;
while (i < s.length()) {
    char c = s.charAt(i);
    int count = 0;
    while (i < s.length() && s.charAt(i) == c) { count++; i++; }
    sb.append(c);
    if (count > 1) sb.append(count);  // only append count if > 1
}
// "aabcccdddd":
// 'a' count=2 → "a2", 'b' count=1 → "a2b", 'c' count=3 → "a2bc3", 'd' count=4 → "a2bc3d4" ✓
```

---

### P11. Reverse words in a sentence

**The Trick:** Split on whitespace (handles multiple spaces), reverse the word array, join back.

```
Input:  "the sky is blue"     → Output: "blue is sky the"
Input:  "  hello world  "     → Output: "world hello"   (leading/trailing spaces removed)
Input:  "a good   example"    → Output: "example good a"
Input:  "one"                 → Output: "one"
```

```java
String[] words = s.trim().split("\\s+");  // trim edges, split on 1+ spaces
int l = 0, r = words.length - 1;
while (l < r) {
    String t = words[l];
    words[l++] = words[r];
    words[r--] = t;
}
return String.join(" ", words);
// "the sky is blue" → ["the","sky","is","blue"] → reverse → ["blue","is","sky","the"]
// join → "blue is sky the" ✓
```

---

## Section 3 — Number / Math Tricks

---

### P12. Check if a number is a power of 2

**The Trick:** A power of 2 has exactly ONE bit set. `n & (n-1)` clears the lowest set bit — if result is 0, only one bit existed.

```
Input:  1   → Output: true   (2^0 = 1)
Input:  2   → Output: true   (2^1)
Input:  8   → Output: true   (2^3 = 1000 in binary)
Input:  6   → Output: false  (110 in binary — two bits set)
Input:  0   → Output: false
Input:  -4  → Output: false  (negative)
```

```java
boolean isPowerOf2(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}
// 8  = 1000, 7  = 0111 → 8 & 7  = 0000 → true  ✓
// 6  = 0110, 5  = 0101 → 6 & 5  = 0100 → false ✓
// 16 = 10000, 15= 01111 → 16 & 15 = 0 → true  ✓
```

---

### P13. Find factorial iteratively and recursively

**The Trick:** Iterative avoids stack overflow for large N. Recursive is elegant — must have a base case.

```
Input:  0  → Output: 1    (0! = 1 by definition)
Input:  1  → Output: 1
Input:  5  → Output: 120  (5 × 4 × 3 × 2 × 1)
Input:  10 → Output: 3628800
```

```java
// Iterative (preferred)
long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}
// n=5: 1 → ×2=2 → ×3=6 → ×4=24 → ×5=120 ✓

// Recursive (shows base case understanding)
long factorial(int n) {
    if (n <= 1) return 1;           // BASE CASE: stop here
    return n * factorial(n - 1);   // RECURSIVE: 5 × factorial(4)
}
// factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3) = ... = 5×4×3×2×1 = 120 ✓
```

---

### P14. Check if a number is prime

**The Trick:** Only check divisors up to √n. If none found, it's prime.

```
Input:  2   → Output: true
Input:  7   → Output: true
Input:  9   → Output: false  (3 × 3)
Input:  1   → Output: false  (1 is not prime by definition)
Input:  0   → Output: false
Input:  97  → Output: true
```

```java
boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) return false;  // found a divisor — not prime
    }
    return true;
}
// isPrime(9): √9=3, check i=2: 9%2=1 ✗, i=3: 9%3=0 → false ✓
// isPrime(7): √7≈2.6, check i=2: 7%2=1 ✗ → loop ends → true ✓
// Why √n? If 9 = 3×3, and we check 3 (≤√9), we find it. No need to check 9/3=3 again.
```

---

### P15. FizzBuzz

**The Trick:** Check 15 FIRST (both conditions true), then 3, then 5. Order matters — if you check 3 first, multiples of 15 print "Fizz" instead of "FizzBuzz".

```
Input:  i=1   → Output: "1"
Input:  i=3   → Output: "Fizz"
Input:  i=5   → Output: "Buzz"
Input:  i=15  → Output: "FizzBuzz"
Input:  i=30  → Output: "FizzBuzz"
Input:  i=9   → Output: "Fizz"
Input:  i=20  → Output: "Buzz"
```

```java
for (int i = 1; i <= 100; i++) {
    if      (i % 15 == 0) System.out.println("FizzBuzz"); // MUST be first
    else if (i % 3  == 0) System.out.println("Fizz");
    else if (i % 5  == 0) System.out.println("Buzz");
    else                   System.out.println(i);
}
// i=15: 15%15=0 → "FizzBuzz" ✓  (if we checked 3 first: 15%3=0 → "Fizz" — WRONG)
```

---

### P16. Fibonacci — iterative

**The Trick:** You only need the last two numbers — no array, no recursion.

```
Input:  0  → Output: 0
Input:  1  → Output: 1
Input:  5  → Output: 5    (sequence: 0,1,1,2,3,5)
Input:  7  → Output: 13   (sequence: 0,1,1,2,3,5,8,13)
Input:  10 → Output: 55
```

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
}
// fibonacci(7):
// i=2: next=1, prev=1, curr=1
// i=3: next=2, prev=1, curr=2
// i=4: next=3, prev=2, curr=3
// i=5: next=5, prev=3, curr=5
// i=6: next=8, prev=5, curr=8
// i=7: next=13, prev=8, curr=13 → returns 13 ✓
```

---

## Section 4 — Linked List Patterns

---

### P17. Reverse a Linked List

**The Trick:** Three pointers — `prev`, `curr`, `next`. Save next, flip the arrow, move both forward.

```
Input:  1 → 2 → 3 → 4 → null   → Output: 4 → 3 → 2 → 1 → null
Input:  1 → null               → Output: 1 → null   (single node, unchanged)
Input:  null                   → Output: null
```

```java
ListNode prev = null, curr = head;
while (curr != null) {
    ListNode next = curr.next;  // 1. save next before we lose it
    curr.next = prev;           // 2. flip the arrow ← (point backward)
    prev = curr;                // 3. prev advances
    curr = next;                // 4. curr advances
}
return prev;  // curr is null, prev is the new head

// Step by step for 1→2→3→4:
// prev=null, curr=1: save next=2, flip: 1→null, prev=1, curr=2
// prev=1,    curr=2: save next=3, flip: 2→1,    prev=2, curr=3
// prev=2,    curr=3: save next=4, flip: 3→2,    prev=3, curr=4
// prev=3,    curr=4: save next=null, flip: 4→3, prev=4, curr=null
// return prev=4 → 4→3→2→1→null ✓
```

---

### P18. Detect a cycle in a Linked List

**The Trick:** Slow moves 1 step, fast moves 2 steps. If they ever meet, cycle exists. (Floyd's algorithm.)

```
Input:  1 → 2 → 3 → 4 → 2 (cycle back to 2)  → Output: true
Input:  1 → 2 → 3 → null                      → Output: false
Input:  1 → 1 (points to itself)               → Output: true
```

```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;        // slow: 1 step
    fast = fast.next.next;   // fast: 2 steps
    if (slow == fast) return true;   // they met — cycle!
}
return false;
// ELI20: imagine two runners on a circular track.
// The fast runner ALWAYS laps the slow runner eventually.
// If there's no cycle, fast hits null first.
```

---

### P19. Find the middle of a Linked List

**The Trick:** Slow moves 1 step, fast moves 2 steps. When fast hits the end, slow is at the middle.

```
Input:  1 → 2 → 3 → 4 → 5       → Output: node 3  (middle of 5)
Input:  1 → 2 → 3 → 4           → Output: node 3  (second middle of even length)
Input:  1                        → Output: node 1
```

```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;
// 1→2→3→4→5:
// slow=1, fast=1 → slow=2, fast=3 → slow=3, fast=5
// fast.next=null → stop → slow=3 ✓ (middle)
```

---

## Section 5 — Stack & Queue Patterns

---

### P20. Valid Parentheses

**The Trick:** Push openers onto a stack. When you see a closer, pop and check if it matches.

```
Input:  "()"        → Output: true
Input:  "()[]{}"    → Output: true
Input:  "(]"        → Output: false
Input:  "([)]"      → Output: false
Input:  "{[]}"      → Output: true
Input:  "("         → Output: false  (opened but never closed)
Input:  ")"         → Output: false  (closed with nothing opened)
```

```java
Deque<Character> stack = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') {
        stack.push(c);
    } else {
        if (stack.isEmpty()) return false;   // closer with nothing on stack
        char top = stack.pop();
        if (c == ')' && top != '(') return false;
        if (c == ']' && top != '[') return false;
        if (c == '}' && top != '{') return false;
    }
}
return stack.isEmpty();  // any unclosed openers left?
// "{[]}": push {, push [ → see ]: pop [, match ✓ → see }: pop {, match ✓ → empty ✓
// "([)]": push (, push [ → see ): pop [, [ != ( → false ✓
```

---

### P21. Implement a stack using two queues

**The Trick:** On each `push`, enqueue to q2, drain all of q1 into q2, then swap — most recent element is always at q1's front.

```
push(1) → stack: [1]
push(2) → stack: [2, 1]   (2 is on top)
push(3) → stack: [3, 2, 1]
pop()   → returns 3, stack: [2, 1]
top()   → returns 2
```

```java
Queue<Integer> q1 = new LinkedList<>(), q2 = new LinkedList<>();

void push(int x) {
    q2.add(x);                              // new element goes into q2 first
    while (!q1.isEmpty()) q2.add(q1.poll()); // move all old elements behind it
    Queue<Integer> temp = q1; q1 = q2; q2 = temp; // swap: q1 is now the stack
}
int pop()  { return q1.poll(); }  // front of q1 = top of stack
int top()  { return q1.peek(); }

// push(1): q2=[1], drain q1(empty), swap → q1=[1]
// push(2): q2=[2], drain q1→q2=[2,1], swap → q1=[2,1]  (2 is at front = top)
// push(3): q2=[3], drain q1→q2=[3,2,1], swap → q1=[3,2,1]
// pop() → q1.poll() = 3 ✓
```

---

## Section 6 — HashMap Patterns

---

### P22. Two Sum — find two indices that add to target

**The Trick:** For each number, check if `target - number` is already in the map. One pass.

```
Input:  nums=[2,7,11,15], target=9   → Output: [0,1]   (2+7=9)
Input:  nums=[3,2,4],     target=6   → Output: [1,2]   (2+4=6)
Input:  nums=[3,3],       target=6   → Output: [0,1]
Input:  nums=[1,5,3,7],   target=8   → Output: [1,3]   (5+3? no — 1+7=8) → [0,3]
```

```java
Map<Integer, Integer> seen = new HashMap<>();  // number → its index
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];         // what we need to find
    if (seen.containsKey(complement)) {
        return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
}
// nums=[2,7,11,15], target=9:
// i=0: complement=7, not in map → put {2:0}
// i=1: complement=2, found at index 0 → return [0,1] ✓
```

---

### P23. Group anagrams together

**The Trick:** Sort each word's letters — all anagrams become the same string. Use that as the HashMap key.

```
Input:  ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Input:  [""]        → Output: [[""]]
Input:  ["a"]       → Output: [["a"]]
```

```java
Map<String, List<String>> map = new HashMap<>();
for (String word : words) {
    char[] chars = word.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);  // "eat"→"aet", "tea"→"aet", "ate"→"aet"
    map.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(map.values());
// "eat","tea","ate" all sort to "aet" → same bucket → grouped ✓
// "tan","nat" sort to "ant" → same bucket ✓
// "bat" sorts to "abt" → own bucket ✓
```

---

### P24. Find the most frequent element in an array

**The Trick:** Count frequencies with HashMap, then find max value entry.

```
Input:  [1, 2, 2, 3, 3, 3]     → Output: 3   (appears 3 times)
Input:  [5, 5, 4, 4, 4]        → Output: 4
Input:  [7]                    → Output: 7
Input:  [1, 1, 2, 2]           → Output: 1   (tie — returns first max found)
```

```java
Map<Integer, Integer> freq = new HashMap<>();
for (int n : arr) freq.merge(n, 1, Integer::sum);  // build frequency map

int maxEl = arr[0], maxCount = 0;
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    if (e.getValue() > maxCount) {
        maxCount = e.getValue();
        maxEl = e.getKey();
    }
}
return maxEl;
// [1,2,2,3,3,3]: freq={1:1, 2:2, 3:3} → max count is 3 → element is 3 ✓
```

---

## Section 7 — Two Pointer Patterns

---

### P25. Remove duplicates from a SORTED array in-place

**The Trick:** Write pointer only advances when a new unique value is found.

```
Input:  [1,1,2]             → Output: 2, array=[1,2,_]
Input:  [0,0,1,1,1,2,2,3]  → Output: 4, array=[0,1,2,3,_,_,_,_]
Input:  [1]                → Output: 1, array=[1]
Input:  [1,2,3]            → Output: 3, array=[1,2,3]  (already unique)
```

```java
if (arr.length == 0) return 0;
int writePos = 1;
for (int i = 1; i < arr.length; i++) {
    if (arr[i] != arr[i - 1]) {     // found a new unique value
        arr[writePos++] = arr[i];   // write to the next unique slot
    }
}
return writePos;
// [0,0,1,1,1,2,2,3]:
// i=1: 0==0, skip | i=2: 1≠0, write arr[1]=1, writePos=2
// i=3: 1==1, skip | i=4: 1==1, skip | i=5: 2≠1, write arr[2]=2, writePos=3
// i=6: 2==2, skip | i=7: 3≠2, write arr[3]=3, writePos=4 → returns 4 ✓
```

---

### P26. Container with most water

**The Trick:** Start with widest container. Always move the SHORTER wall inward — the taller wall can never help if the shorter one limits the water.

```
Input:  [1,8,6,2,5,4,8,3,7]  → Output: 49  (between index 1 and 8: min(8,7)×7=49)
Input:  [1,1]                → Output: 1
Input:  [4,3,2,1,4]         → Output: 16  (index 0 and 4: min(4,4)×4=16)
```

```java
int l = 0, r = height.length - 1, maxArea = 0;
while (l < r) {
    int area = Math.min(height[l], height[r]) * (r - l);
    maxArea = Math.max(maxArea, area);
    if (height[l] < height[r]) l++;  // short wall on left — move left inward
    else r--;                        // short wall on right — move right inward
}
return maxArea;
// [1,8,6,2,5,4,8,3,7]: l=0(h=1), r=8(h=7) → area=min(1,7)*8=8, move l (shorter)
// l=1(h=8), r=8(h=7) → area=min(8,7)*7=49, move r (shorter) ... max=49 ✓
```

---

### P27. Three Sum — find all triplets that sum to zero

**The Trick:** Sort. Fix one element with a loop, then use two pointers on the remainder.

```
Input:  [-1,0,1,2,-1,-4]  → Output: [[-1,-1,2],[-1,0,1]]
Input:  [0,0,0]           → Output: [[0,0,0]]
Input:  [1,2,3]           → Output: []   (no triplet sums to 0)
Input:  []                → Output: []
```

```java
Arrays.sort(nums);  // [-4,-1,-1,0,1,2]
List<List<Integer>> result = new ArrayList<>();
for (int i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i-1]) continue;  // skip duplicate fixed element
    int l = i + 1, r = nums.length - 1;
    while (l < r) {
        int sum = nums[i] + nums[l] + nums[r];
        if      (sum == 0) { result.add(Arrays.asList(nums[i], nums[l++], nums[r--])); }
        else if (sum < 0)  l++;   // need bigger sum → move left pointer right
        else               r--;   // need smaller sum → move right pointer left
    }
}
return result;
// i=1 (nums[1]=-1): l=2(-1), r=5(2) → sum=0 → add [-1,-1,2] ✓
// i=1 (nums[1]=-1): l=3(0), r=4(1) → sum=0 → add [-1,0,1] ✓
```

---

## Section 8 — Sorting & Searching

---

### P28. Binary Search

**The Trick:** Each step eliminates half the search space by comparing the middle element.

```
Input:  arr=[1,3,5,7,9,11], target=7   → Output: 3  (index 3)
Input:  arr=[1,3,5,7,9,11], target=6   → Output: -1 (not found)
Input:  arr=[5],            target=5   → Output: 0
Input:  arr=[1,2,3,4,5],    target=1   → Output: 0  (first element)
Input:  arr=[1,2,3,4,5],    target=5   → Output: 4  (last element)
```

```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // safe mid (avoids overflow)
        if      (arr[mid] == target) return mid;
        else if (arr[mid] < target)  left = mid + 1;   // target in right half
        else                         right = mid - 1;  // target in left half
    }
    return -1;
}
// arr=[1,3,5,7,9,11], target=7:
// left=0,right=5 → mid=2(arr[2]=5) < 7 → left=3
// left=3,right=5 → mid=4(arr[4]=9) > 7 → right=3
// left=3,right=3 → mid=3(arr[3]=7) == 7 → return 3 ✓
```

---

### P29. Bubble Sort

**The Trick:** Each pass "bubbles" the largest unsorted element to its correct position at the end.

```
Input:  [5, 3, 8, 1, 2]  → Output: [1, 2, 3, 5, 8]
Input:  [1, 2, 3]        → Output: [1, 2, 3]  (already sorted — 0 swaps)
Input:  [3, 2, 1]        → Output: [1, 2, 3]  (worst case — reverse order)
```

```java
for (int i = 0; i < arr.length - 1; i++) {
    for (int j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
        }
    }
}
// [5,3,8,1,2] pass 1: 5>3→swap[3,5,8,1,2], 8>1→swap[3,5,1,8,2], 8>2→swap[3,5,1,2,8]
// 8 is now in its final position. Repeat for remaining 4 elements.
// O(n²) — know it, never use it in production
```

---

### P30. When to use which sorting algorithm?

| Scenario | Algorithm | Why |
|---|---|---|
| General purpose | `Arrays.sort()` (Timsort) | O(n log n), stable, handles nearly-sorted |
| Nearly sorted data | Insertion sort | O(n) best case |
| Small range integers | Counting sort | O(n+k) — linear |
| Interview: explain recursion + divide & conquer | Merge sort | O(n log n), stable, predictable |
| Interview: pivot/partitioning question | Quicksort | O(n log n) avg, O(n²) worst |

---

## Section 9 — Recursion Mental Models

---

### P31. How to think through ANY recursion problem

**Framework — 3 questions every time:**

```
1. BASE CASE:   when do I stop? (n==0, array empty, index out of bounds)
2. WHAT I DO:   one step at this level
3. TRUST:       recursive call handles the rest correctly — don't trace it all

Template:
ReturnType solve(input) {
    if (BASE CASE) return BASE_VALUE;
    return combine(thisStepResult, solve(smallerInput));
}
```

---

### P32. Sum of array elements recursively

```
Input:  [1, 2, 3, 4, 5]   → Output: 15
Input:  []                 → Output: 0
Input:  [7]                → Output: 7
```

```java
int sum(int[] arr, int i) {
    if (i == arr.length) return 0;          // BASE: past end → nothing to add
    return arr[i] + sum(arr, i + 1);        // this element + sum of rest
}
// sum([1,2,3,4,5], 0)
// = 1 + sum([2,3,4,5], 1)
// = 1 + 2 + sum([3,4,5], 2) ... = 1+2+3+4+5 = 15 ✓
```

---

### P33. Power function — x to the power n (fast)

**The Trick:** If n is even, `x^n = (x^(n/2))²` — halves the problem each time → O(log n).

```
Input:  x=2, n=10   → Output: 1024
Input:  x=2, n=0    → Output: 1    (anything^0 = 1)
Input:  x=2, n=-2   → Output: 0.25 (2^-2 = 1/4)
Input:  x=3, n=3    → Output: 27
```

```java
double power(double x, int n) {
    if (n == 0)      return 1;
    if (n < 0)       return 1.0 / power(x, -n);
    if (n % 2 == 0) {
        double half = power(x, n / 2);
        return half * half;          // avoids calling power twice
    }
    return x * power(x, n - 1);     // odd: peel off one x
}
// power(2, 10):
// n=10 even → half=power(2,5), return half*half
// power(2,5): n=5 odd → 2 * power(2,4)
// power(2,4): n=4 even → half=power(2,2), return half*half
// power(2,2): n=2 even → half=power(2,1), return half*half
// power(2,1): n=1 odd → 2 * power(2,0) = 2*1 = 2
// bubbles back: 2→4→16→32→1024 ✓
```

---

## Section 10 — Java-Specific Logic Traps

---

### P34. Integer overflow trap

```
Input (wrong):  int a = 2147483647; int b = a + 1;
Output (wrong): b = -2147483648   ← wraps around silently, no exception!

Input (safe):   long a = 2147483647L; long b = a + 1;
Output (safe):  b = 2147483648 ✓

Binary search mid trap:
Input:  left=1000000000, right=2000000000
mid = (left+right)/2 = 3000000000/2 → OVERFLOW → negative result!
Safe:   mid = left + (right - left) / 2 = 1000000000 + 500000000 = 1500000000 ✓
```

```java
int a = Integer.MAX_VALUE;  // 2,147,483,647
int b = a + 1;              // -2,147,483,648 ← WRONG
long safe = (long) a + 1;  // 2,147,483,648  ✓

// Binary search — always write it this way:
int mid = left + (right - left) / 2;  // never (left + right) / 2
```

---

### P35. String concatenation in a loop

```
Input:  concatenate "a" 10000 times
Wrong approach:  result = "" → "a" → "aa" → creates 10000 new String objects
Right approach:  StringBuilder → one object mutated 10000 times

Performance:
- String += in loop:    O(n²) — each concatenation copies the whole string
- StringBuilder.append: O(n)  — appends in place
```

```java
// BAD — O(n²)
String result = "";
for (int i = 0; i < 10000; i++) result += "a";

// GOOD — O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) sb.append("a");
String result = sb.toString();
```

---

### P36. `int[]` vs `Integer[]` — sorting descending

```
Input:  arr = [3, 1, 4, 1, 5]

int[] ascending:    Arrays.sort(arr)             → [1, 1, 3, 4, 5] ✓
int[] descending:   Arrays.sort(arr, ...) → COMPILE ERROR (no comparator for int[])
Integer[] descending: Arrays.sort(integerArr, Comparator.reverseOrder()) → [5, 4, 3, 1, 1] ✓
```

```java
int[] arr = {3, 1, 4, 1, 5};
Arrays.sort(arr);   // ascending only ✓ → [1,1,3,4,5]

// For descending, must use Integer[]:
Integer[] arr2 = {3, 1, 4, 1, 5};
Arrays.sort(arr2, Comparator.reverseOrder());  // [5,4,3,1,1] ✓
```

---

### P37. ConcurrentModificationException — modifying list while iterating

```
Input:  list = [1, 2, 3, 4, 5], remove all even numbers
Wrong:  for-each + list.remove() → throws ConcurrentModificationException
Right:  Iterator.remove() or removeIf() → [1, 3, 5] ✓
```

```java
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

// BAD — throws ConcurrentModificationException
for (Integer n : list) {
    if (n % 2 == 0) list.remove(n);
}

// GOOD — Iterator
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();  // [1,3,5] ✓
}

// BEST — Java 8 one-liner
list.removeIf(n -> n % 2 == 0);  // [1,3,5] ✓
```

---

### P38. Pass by value — the Java trap

```
Input:   int a = 1; changeValue(a);
Output:  a is still 1  ← primitives are copied, original unchanged

Input:   List<Integer> list = new ArrayList<>();  addToList(list);
Output:  list = [5]    ← object's contents CAN be mutated via the reference
```

```java
void changeValue(int x) { x = 99; }   // x is a copy — does nothing to original
void addToList(List<Integer> list) { list.add(5); }  // mutates the actual object

int a = 1;
changeValue(a);     // a is still 1 ✓

List<Integer> myList = new ArrayList<>();
addToList(myList);  // myList = [5] ✓
```

---

## Quick Revision — Pattern Cheat Sheet

| Problem type | Pattern | Data structure |
|---|---|---|
| Find pair/triplet with sum | Two pointers or HashMap | HashMap / sorted array |
| Longest substring no repeat | Sliding window | Two pointers + HashMap |
| Detect cycle | Fast/slow pointers | Two ListNodes |
| Balanced brackets | Stack | Deque |
| Frequency counting | HashMap | HashMap |
| Find element in sorted array | Binary search | left/right pointers |
| Missing/duplicate in 1..N | Sum formula N(N+1)/2 | No extra space |
| Move zeros / remove duplicates | Write pointer | Single index |
| Rotate array | Triple reverse | In-place |
| Anagram grouping | Sort chars as key | HashMap<String, List> |
