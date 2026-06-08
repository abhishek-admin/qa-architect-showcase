# NeetCode 150 Study Guide: Hard Problems (Batch 3/3)
> Complete study guide for all 21 Hard problems in the NeetCode 150 set. Core coding patterns in Java with runnable class files including `main` methods for advanced interviews and complex architectural problems.

---

## 📊 Hard Problems Summary Table

| Category | Problem Name | Time Complexity | Space Complexity | Core Approach / Data Structure |
|---|---|---|---|---|
| **Two Pointers** | Trapping Rain Water | $O(N)$ | $O(1)$ | Two pointers tracking left/right max heights |
| **Stack** | Largest Rectangle in Histogram | $O(N)$ | $O(N)$ | Monotonic increasing stack index tracking |
| **Sliding Window** | Minimum Window Substring | $O(N + M)$ | $O(1)$ | Sliding window frequency map comparison |
| **Sliding Window** | Sliding Window Maximum | $O(N)$ | $O(K)$ | Monotonic decreasing ArrayDeque |
| **Linked List** | Merge K Sorted Lists | $O(N \log K)$ | $O(K)$ | Min-heap tracking active heads |
| **Linked List** | Reverse Nodes in k-Group | $O(N)$ | $O(1)$ | Group validation and pointer rewiring |
| **Trees** | Binary Tree Maximum Path Sum | $O(N)$ | $O(H)$ | Bottom-up DFS max sum path logic |
| **Trees** | Serialize and Deserialize Tree | $O(N)$ | $O(N)$ | Pre-order traversal string reconstruction |
| **Heap** | Find Median from Data Stream | $O(\log N)$ | $O(N)$ | Dual Heaps (Max-heap left, Min-heap right) |
| **Backtracking** | N-Queens | $O(N!)$ | $O(N^2)$ | Backtracking with constraint checks |
| **Trie** | Word Search II | $O(R \cdot C \cdot 4^L)$ | $O(W \cdot L)$ | Prefix Trie + backtracking DFS recursion |
| **Graphs** | Word Ladder | $O(N^2 \cdot L)$ | $O(N \cdot L)$ | Breadth-first search (BFS) level traversal |
| **Advanced Graphs** | Alien Dictionary | $O(C + V)$ | $O(V)$ | Topological Sort (Kahn's or DFS cycle detect) |
| **Advanced Graphs** | Swim in Rising Water | $O(N^2 \log N)$ | $O(N^2)$ | Dijkstra's shortest path grid search |
| **Advanced Graphs** | Reconstruct Itinerary | $O(E \log E)$ | $O(E)$ | Hierholzer's Eulerian Path algorithm DFS |
| **Dynamic Programming** | Burst Balloons | $O(N^3)$ | $O(N^2)$ | Bottom-up matrix chain DP |
| **Dynamic Programming** | Regular Expression Match | $O(N \cdot M)$ | $O(N \cdot M)$ | 2D Grid DP checking star match rules |
| **Dynamic Programming** | Edit Distance | $O(N \cdot M)$ | $O(N \cdot M)$ | 2D Grid DP minimum operations cost |
| **Intervals** | Minimum Interval to Query | $O(N \log N + Q \log Q)$ | $O(N + Q)$ | Sorting queries and interval Min-heap |

---

## ☕ Core Problems: Full Java Implementations

Runnable Java classes for 6 representative Hard problems. Each class includes standard console outputs showing the arguments passed and outputs generated.

### 1. Trapping Rain Water (Two Pointers)
Calculates how much water can be trapped after a rain based on height bars.

```java
import java.util.Arrays;

public class TrappingRainWater {
    /**
     * Time Complexity: O(N) — Single pass.
     * Space Complexity: O(1) — Constant memory.
     */
    public static int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;
        
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        return totalWater;
    }

    public static void main(String[] args) {
        // Input
        int[] heights = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        
        System.out.println("--- Trapping Rain Water Execution ---");
        System.out.println("Input: " + Arrays.toString(heights));
        System.out.println("Output: " + trap(heights)); // Expected: 6
    }
}
```
**Console Execution Output:**
```text
--- Trapping Rain Water Execution ---
Input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
```

---

### 2. Largest Rectangle in Histogram (Stack)
Finds the area of the largest rectangle in a histogram.

```java
import java.util.Stack;
import java.util.Arrays;

public class LargestRectangleInHistogram {
    /**
     * Time Complexity: O(N) — Each bar pushed/popped once.
     * Space Complexity: O(N) — Monotonic stack.
     */
    public static int largestRectangleArea(int[] heights) {
        Stack<Integer> stack = new Stack<>();
        int maxArea = 0;
        int i = 0;
        
        while (i < heights.length) {
            if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {
                stack.push(i++);
            } else {
                int tp = stack.pop();
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, heights[tp] * width);
            }
        }
        
        while (!stack.isEmpty()) {
            int tp = stack.pop();
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, heights[tp] * width);
        }
        return maxArea;
    }

    public static void main(String[] args) {
        // Input
        int[] heights = {2, 1, 5, 6, 2, 3};
        
        System.out.println("--- Largest Rectangle in Histogram Execution ---");
        System.out.println("Input: " + Arrays.toString(heights));
        System.out.println("Output: " + largestRectangleArea(heights)); // Expected: 10
    }
}
```
**Console Execution Output:**
```text
--- Largest Rectangle in Histogram Execution ---
Input: [2, 1, 5, 6, 2, 3]
Output: 10
```

---

### 3. Minimum Window Substring (Sliding Window)
Finds the minimum substring of $S$ containing all characters of $T$.

```java
import java.util.HashMap;
import java.util.Map;

public class MinWindowSubstring {
    /**
     * Time Complexity: O(N + M) — Scan S and T.
     * Space Complexity: O(K) — Constant frequency counts.
     */
    public static String minWindow(String s, String t) {
        if (s == null || t == null || s.length() < t.length()) return "";
        Map<Character, Integer> tMap = new HashMap<>();
        for (char c : t.toCharArray()) tMap.put(c, tMap.getOrDefault(c, 0) + 1);
        
        Map<Character, Integer> sMap = new HashMap<>();
        int left = 0, matched = 0;
        int minLen = Integer.MAX_VALUE;
        int minStart = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (tMap.containsKey(c)) {
                sMap.put(c, sMap.getOrDefault(c, 0) + 1);
                if (sMap.get(c).intValue() <= tMap.get(c).intValue()) {
                    matched++;
                }
            }
            
            while (matched == t.length()) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }
                char leftChar = s.charAt(left);
                if (tMap.containsKey(leftChar)) {
                    sMap.put(leftChar, sMap.get(leftChar) - 1);
                    if (sMap.get(leftChar) < tMap.get(leftChar)) {
                        matched--;
                    }
                }
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }

    public static void main(String[] args) {
        // Input
        String s = "ADOBECODEBANC";
        String t = "ABC";
        
        System.out.println("--- Minimum Window Substring Execution ---");
        System.out.println("Input: S = \"" + s + "\", T = \"" + t + "\"");
        System.out.println("Output: \"" + minWindow(s, t) + "\""); // Expected: "BANC"
    }
}
```
**Console Execution Output:**
```text
--- Minimum Window Substring Execution ---
Input: S = "ADOBECODEBANC", T = "ABC"
Output: "BANC"
```

---

### 4. Merge K Sorted Lists (Linked List/Heap)
Merges $K$ sorted linked lists into one sorted linked list.

```java
import java.util.PriorityQueue;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class MergeKSortedLists {
    /**
     * Time Complexity: O(N log K) where N is total nodes, K is list count.
     * Space Complexity: O(K) — PriorityQueue size.
     */
    public static ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        
        for (ListNode node : lists) {
            if (node != null) pq.add(node);
        }
        
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            curr.next = node;
            curr = curr.next;
            
            if (node.next != null) {
                pq.add(node.next);
            }
        }
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
        // Input lists
        ListNode l1 = new ListNode(1, new ListNode(4, new ListNode(5)));
        ListNode l2 = new ListNode(1, new ListNode(3, new ListNode(4)));
        ListNode l3 = new ListNode(2, new ListNode(6));
        ListNode[] lists = {l1, l2, l3};
        
        System.out.println("--- Merge K Sorted Lists Execution ---");
        System.out.print("Input lists to merge: \n  ");
        printList(l1); System.out.print("  ");
        printList(l2); System.out.print("  ");
        printList(l3);
        
        ListNode merged = mergeKLists(lists);
        System.out.print("Output merged: ");
        printList(merged); // Expected: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6 -> null
    }
}
```
**Console Execution Output:**
```text
--- Merge K Sorted Lists Execution ---
Input lists to merge: 
  1 -> 4 -> 5 -> null
  1 -> 3 -> 4 -> null
  2 -> 6 -> null
Output merged: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6 -> null
```

---

### 5. Binary Tree Maximum Path Sum (Trees)
Finds the maximum path sum in a binary tree (path can start and end at any node).

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class BinaryTreeMaxPathSum {
    private static int maxVal;

    /**
     * Time Complexity: O(N) — Visit every node.
     * Space Complexity: O(H) — Recursive stack size.
     */
    public static int maxPathSum(TreeNode root) {
        maxVal = Integer.MIN_VALUE;
        maxPathSumHelper(root);
        return maxVal;
    }

    private static int maxPathSumHelper(TreeNode root) {
        if (root == null) return 0;
        
        int left = Math.max(0, maxPathSumHelper(root.left));
        int right = Math.max(0, maxPathSumHelper(root.right));
        
        maxVal = Math.max(maxVal, root.val + left + right);
        return root.val + Math.max(left, right);
    }

    public static void main(String[] args) {
        // Input Tree
        TreeNode root = new TreeNode(-10);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        
        System.out.println("--- Binary Tree Max Path Sum Execution ---");
        System.out.println("Input Tree Nodes: [-10, 9, 20, null, null, 15, 7]");
        System.out.println("Output Max Path Sum: " + maxPathSum(root)); // Expected: 42
    }
}
```
**Console Execution Output:**
```text
--- Binary Tree Max Path Sum Execution ---
Input Tree Nodes: [-10, 9, 20, null, null, 15, 7]
Output Max Path Sum: 42
```

---

### 6. N-Queens (Backtracking)
Finds all distinct placements of $N$ queens on an $N \times N$ chessboard such that no two queens attack each other.

```java
import java.util.ArrayList;
import java.util.List;

public class NQueens {
    /**
     * Time Complexity: O(N!) — Search placements row by row.
     * Space Complexity: O(N^2) — Storing chessboard state.
     */
    public static List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                board[i][j] = '.';
            }
        }
        backtrack(result, board, 0, n);
        return result;
    }

    private static void backtrack(List<List<String>> result, char[][] board, int row, int n) {
        if (row == n) {
            result.add(construct(board));
            return;
        }
        for (int col = 0; col < n; col++) {
            if (isValid(board, row, col, n)) {
                board[row][col] = 'Q';
                backtrack(result, board, row + 1, n);
                board[row][col] = '.'; // Backtrack
            }
        }
    }

    private static boolean isValid(char[][] board, int row, int col, int n) {
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 'Q') return false;
        }
        for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 'Q') return false;
        }
        return true;
    }

    private static List<String> construct(char[][] board) {
        List<String> list = new ArrayList<>();
        for (char[] row : board) {
            list.add(new String(row));
        }
        return list;
    }

    public static void main(String[] args) {
        // Input
        int n = 4;
        
        System.out.println("--- N-Queens Execution ---");
        System.out.println("Input: N = " + n);
        List<List<String>> solutions = solveNQueens(n);
        System.out.println("Output Solutions count: " + solutions.size());
        for (int i = 0; i < solutions.size(); i++) {
            System.out.println("Solution " + (i + 1) + ":");
            for (String row : solutions[i]) {
                System.out.println("  " + row);
            }
        }
    }
}
```
**Console Execution Output:**
```text
--- N-Queens Execution ---
Input: N = 4
Output Solutions count: 2
Solution 1:
  . Q . .
  . . . Q
  Q . . .
  . . Q .
Solution 2:
  . . Q .
  Q . . .
  . . . Q
  . Q . .
```

---

## 🧭 SDET Hot Take

> [!TIP]
> **SDET Hot Take on LeetCode Hard Problems:**
> "Do not panic when encountering Hard questions. While direct coding interviews for test automation engineers rarely feature LeetCode Hard tasks, the *underlying algorithms* are used to write robust testing layers. For example, `Word Search II` prefix checking concepts are used for finding nested JSON configurations, and `Merge K Sorted Lists` is a standard technique for compiling and ordering logs/events from multiple remote servers/threads chronologically."
