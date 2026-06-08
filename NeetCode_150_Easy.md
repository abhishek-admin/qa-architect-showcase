# NeetCode 150 Study Guide: Easy Problems (Batch 1/3)
> Complete guide for all 28 Easy problems in the NeetCode 150 set. Core coding patterns in Java with runnable class files including `main` methods for interviews and automation frameworks.

---

## 📊 Easy Problems Summary Table

| Category | Problem Name | Time Complexity | Space Complexity | Core Approach / Data Structure |
|---|---|---|---|---|
| **Arrays & Hashing** | Contains Duplicate | $O(N)$ | $O(N)$ | HashSet tracking |
| **Arrays & Hashing** | Valid Anagram | $O(N)$ | $O(1)$ | Frequency counting array (26 chars) |
| **Arrays & Hashing** | Two Sum | $O(N)$ | $O(N)$ | HashMap complements mapping |
| **Two Pointers** | Valid Palindrome | $O(N)$ | $O(1)$ | Two pointers meet in the middle |
| **Stack** | Valid Parentheses | $O(N)$ | $O(N)$ | Stack tracking open brackets |
| **Binary Search** | Binary Search | $O(\log N)$ | $O(1)$ | Low, high boundaries update |
| **Linked List** | Reverse Linked List | $O(N)$ | $O(1)$ | Iterative pointer rewiring |
| **Linked List** | Merge Two Sorted Lists | $O(N + M)$ | $O(1)$ | Dummy head & iterative merge |
| **Linked List** | Linked List Cycle | $O(N)$ | $O(1)$ | Floyd's Cycle Detection (Tortoise & Hare) |
| **Trees** | Invert Binary Tree | $O(N)$ | $O(N)$ | Recursive Post-order swapping |
| **Trees** | Maximum Depth of Binary Tree | $O(N)$ | $O(N)$ | Recursive DFS depth check |
| **Trees** | Diameter of Binary Tree | $O(N)$ | $O(N)$ | Bottom-up DFS height + diameter tracker |
| **Trees** | Balanced Binary Tree | $O(N)$ | $O(N)$ | Bottom-up DFS balance checking ($>-1$) |
| **Trees** | Same Tree | $O(N)$ | $O(N)$ | Recursive structure match checking |
| **Trees** | Subtree of Another Tree | $O(N \cdot M)$ | $O(N)$ | Recursive comparison against every node |
| **Trees** | Lowest Common Ancestor of a BST | $O(\log N)$ | $O(1)$ | BST properties split-point search |
| **Heap** | Kth Largest Element in a Stream | $O(N \log K)$ | $O(K)$ | Min-heap tracking top $K$ values |
| **Heap** | Last Stone Weight | $O(N \log N)$ | $O(N)$ | Max-heap elements reduction |
| **1-D DP** | Climbing Stairs | $O(N)$ | $O(1)$ | Fibonacci sequence space-optimized |
| **1-D DP** | Min Cost Climbing Stairs | $O(N)$ | $O(1)$ | Bottom-up DP state space-optimized |
| **Intervals** | Meeting Rooms | $O(N \log N)$ | $O(1)$ | Sort intervals by start time, check overlap |
| **Bit Manipulation** | Single Number | $O(N)$ | $O(1)$ | Bitwise XOR cancellation |
| **Bit Manipulation** | Number of 1 Bits | $O(1)$ | $O(1)$ | Brian Kernighan's bit reduction algorithm |
| **Bit Manipulation** | Counting Bits | $O(N)$ | $O(N)$ | DP using right shift offset offset |
| **Bit Manipulation** | Reverse Bits | $O(1)$ | $O(1)$ | Shift and bit-wise assembly |
| **Bit Manipulation** | Missing Number | $O(N)$ | $O(1)$ | XOR comparison against full range sum |
| **Math & Geometry** | Happy Number | $O(\log N)$ | $O(\log N)$ | HashSet loops detection / Tortoise & Hare |
| **Math & Geometry** | Plus One | $O(N)$ | $O(N)$ | Carry-over tracking |

---

## ☕ Core Problems: Full Java Implementations

Below are the complete, runnable Java classes for the 7 most fundamental Easy problems. Each class includes standard console outputs showing the arguments passed and outputs generated.

### 1. Contains Duplicate (Arrays & Hashing)
Checks if any value appears at least twice in a given array.

```java
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;

public class ContainsDuplicate {
    /**
     * Time Complexity: O(N) — Single pass over array.
     * Space Complexity: O(N) — Storing unique elements.
     */
    public static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (!seen.add(num)) {
                return true; 
            }
        }
        return false;
    }

    public static void main(String[] args) {
        // Inputs
        int[] test1 = {1, 2, 3, 1};
        int[] test2 = {1, 2, 3, 4};
        
        System.out.println("--- Contains Duplicate Execution ---");
        System.out.println("Input 1: " + Arrays.toString(test1));
        System.out.println("Output 1: " + containsDuplicate(test1)); // Expected: true
        
        System.out.println("Input 2: " + Arrays.toString(test2));
        System.out.println("Output 2: " + containsDuplicate(test2)); // Expected: false
    }
}
```
**Console Execution Output:**
```text
--- Contains Duplicate Execution ---
Input 1: [1, 2, 3, 1]
Output 1: true
Input 2: [1, 2, 3, 4]
Output 2: false
```

---

### 2. Two Sum (Arrays & Hashing)
Finds the indices of the two numbers that add up to a specific target.

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class TwoSum {
    /**
     * Time Complexity: O(N) — One-pass HashMap search.
     * Space Complexity: O(N) — Store up to N items.
     */
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[] { numMap.get(complement), i };
            }
            numMap.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        // Inputs
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        System.out.println("--- Two Sum Execution ---");
        System.out.println("Input: nums = " + Arrays.toString(nums) + ", target = " + target);
        int[] result = twoSum(nums, target);
        System.out.println("Output: " + Arrays.toString(result)); // Expected: [0, 1]
    }
}
```
**Console Execution Output:**
```text
--- Two Sum Execution ---
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
```

---

### 3. Valid Parentheses (Stack)
Determines if brackets are closed in the correct order.

```java
import java.util.Stack;

public class ValidParentheses {
    /**
     * Time Complexity: O(N) — Pass over each character.
     * Space Complexity: O(N) — Stack storage for unmatched brackets.
     */
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        // Inputs
        String test1 = "()[]{}";
        String test2 = "(]";
        
        System.out.println("--- Valid Parentheses Execution ---");
        System.out.println("Input 1: \"" + test1 + "\"");
        System.out.println("Output 1: " + isValid(test1)); // Expected: true
        
        System.out.println("Input 2: \"" + test2 + "\"");
        System.out.println("Output 2: " + isValid(test2)); // Expected: false
    }
}
```
**Console Execution Output:**
```text
--- Valid Parentheses Execution ---
Input 1: "()[]{}"
Output 1: true
Input 2: "(]"
Output 2: false
```

---

### 4. Merge Two Sorted Lists (Linked List)
Merges two sorted linked lists into a single sorted list.

```java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class MergeSortedLists {
    /**
     * Time Complexity: O(N + M) — Iterate through both lists.
     * Space Complexity: O(1) — Rewire pointers in-place.
     */
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                curr.next = list1;
                list1 = list1.next;
            } else {
                curr.next = list2;
                list2 = list2.next;
            }
            curr = curr.next;
        }
        
        if (list1 != null) curr.next = list1;
        if (list2 != null) curr.next = list2;
        
        return dummy.next;
    }

    public static void printList(ListNode node) {
        while (node != null) {
            System.out.print(node.val + " -> ");
            node = node.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        // Inputs
        ListNode l1 = new ListNode(1, new ListNode(2, new ListNode(4)));
        ListNode l2 = new ListNode(1, new ListNode(3, new ListNode(4)));
        
        System.out.println("--- Merge Sorted Lists Execution ---");
        System.out.print("Input list1: ");
        printList(l1);
        System.out.print("Input list2: ");
        printList(l2);
        
        ListNode merged = mergeTwoLists(l1, l2);
        System.out.print("Output merged: ");
        printList(merged); // Expected: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null
    }
}
```
**Console Execution Output:**
```text
--- Merge Sorted Lists Execution ---
Input list1: 1 -> 2 -> 4 -> null
Input list2: 1 -> 3 -> 4 -> null
Output merged: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null
```

---

### 5. Invert Binary Tree (Trees)
Inverts a binary tree (mirroring all left/right children recursively).

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class InvertBinaryTree {
    /**
     * Time Complexity: O(N) — Visit every node.
     * Space Complexity: O(H) — Recursive call stack depth (height of tree).
     */
    public static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        
        return root;
    }

    public static void printPreorder(TreeNode node) {
        if (node == null) return;
        System.out.print(node.val + " ");
        printPreorder(node.left);
        printPreorder(node.right);
    }

    public static void main(String[] args) {
        // Input
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2);
        root.right = new TreeNode(7);
        root.left.left = new TreeNode(1);
        root.left.right = new TreeNode(3);
        root.right.left = new TreeNode(6);
        root.right.right = new TreeNode(9);
        
        System.out.println("--- Invert Binary Tree Execution ---");
        System.out.print("Input (Preorder): ");
        printPreorder(root);
        System.out.println();
        
        invertTree(root);
        
        System.out.print("Output (Preorder): ");
        printPreorder(root); // Expected: 4 7 9 6 2 3 1
        System.out.println();
    }
}
```
**Console Execution Output:**
```text
--- Invert Binary Tree Execution ---
Input (Preorder): 4 2 1 3 7 6 9 
Output (Preorder): 4 7 9 6 2 3 1 
```

---

### 6. Climbing Stairs (1-D DP)
Calculates distinct ways to climb $N$ steps when you can take 1 or 2 steps.

```java
public class ClimbingStairs {
    /**
     * Time Complexity: O(N) — Single loop.
     * Space Complexity: O(1) — Optimized memory tracking.
     */
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        // Inputs
        int n1 = 3;
        int n2 = 5;
        
        System.out.println("--- Climbing Stairs Execution ---");
        System.out.println("Input n = " + n1);
        System.out.println("Output: " + climbStairs(n1)); // Expected: 3
        
        System.out.println("Input n = " + n2);
        System.out.println("Output: " + climbStairs(n2)); // Expected: 8
    }
}
```
**Console Execution Output:**
```text
--- Climbing Stairs Execution ---
Input n = 3
Output: 3
Input n = 5
Output: 8
```

---

### 7. Single Number (Bit Manipulation)
Finds the element that appears only once in an array where all other elements appear twice.

```java
import java.util.Arrays;

public class SingleNumber {
    /**
     * Time Complexity: O(N) — Single pass.
     * Space Complexity: O(1) — Constant memory.
     */
    public static int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) {
            result ^= num;
        }
        return result;
    }

    public static void main(String[] args) {
        // Input
        int[] nums = {4, 1, 2, 1, 2};
        
        System.out.println("--- Single Number Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + singleNumber(nums)); // Expected: 4
    }
}
```
**Console Execution Output:**
```text
--- Single Number Execution ---
Input: [4, 1, 2, 1, 2]
Output: 4
```

---

## 🧭 SDET Hot Take

> [!TIP]
> **SDET Hot Take on LeetCode Easy Problems:**
> "Do not underestimate Easy-rated problems. During automation framework development, LeetCode Easy concepts are the bread and butter of your day-to-day operations. For example, `Contains Duplicate` handles duplicate check scripts for TestNG `@DataProvider` test IDs, and `Valid Parentheses` concepts form the backbone of custom Gherkin spec validator pipelines. Mastery of these ensures you write highly optimized code that avoids burning execution minutes in CI pipelines."
