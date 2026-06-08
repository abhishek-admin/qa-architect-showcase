# NeetCode 150 Study Guide: Medium Problems (Batch 2/3)
> Complete guide for all 101 Medium problems in the NeetCode 150 set. Contains core coding patterns in Java with runnable class files including `main` methods for interviews and advanced framework automation.

---

## 📊 Core Categories & Key Approaches

NeetCode 150 Medium problems encompass the bulk of technical coding interviews. The core categories and their key approaches are:

1. **Arrays & Hashing**: HashSet lookup, sort mappings, index mapping, prefix sum.
2. **Two Pointers**: Converging bounds, prefix array math.
3. **Sliding Window**: Variable-size dynamic boundaries tracking.
4. **Stack & Queue**: Monotonic queues/stacks.
5. **Binary Search**: Finding bounds on a search space.
6. **Linked List**: Two pointers (fast/slow), dummy nodes, re-linking.
7. **Trees**: Deep recursive DFS / BFS level order.
8. **Heap / Priority Queue**: Top $K$ elements tracking.
9. **Backtracking**: Recursive depth-first decision state tree search.
10. **Graphs**: DFS/BFS traversal, cycle detection, topological sort.
11. **Dynamic Programming**: Memoization grids, bottom-up arrays.

---

## ☕ Core Problems: Full Java Implementations

Runnable Java classes for 9 representative Medium problems. Each class includes standard console outputs showing the arguments passed and outputs generated.

### 1. Group Anagrams (Arrays & Hashing)
Groups strings that contain the exact same characters in different orders.

```java
import java.util.*;

public class GroupAnagrams {
    /**
     * Time Complexity: O(N * K log K) — N strings, sorting each of max-length K.
     * Space Complexity: O(N * K) — Storing grouped lists.
     */
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String sortedKey = new String(chars);
            map.putIfAbsent(sortedKey, new ArrayList<>());
            map.get(sortedKey).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        // Input
        String[] test = {"eat", "tea", "tan", "ate", "nat", "bat"};
        
        System.out.println("--- Group Anagrams Execution ---");
        System.out.println("Input: " + Arrays.toString(test));
        List<List<String>> result = groupAnagrams(test);
        System.out.println("Output: " + result);
    }
}
```
**Console Execution Output:**
```text
--- Group Anagrams Execution ---
Input: [eat, tea, tan, ate, nat, bat]
Output: [[eat, tea, ate], [bat], [tan, nat]]
```

---

### 2. Longest Consecutive Sequence (Arrays & Hashing)
Finds the length of the longest consecutive elements sequence in an unsorted array.

```java
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;

public class LongestConsecutiveSequence {
    /**
     * Time Complexity: O(N) — Each number visited at most twice.
     * Space Complexity: O(N) — Storing elements in HashSet.
     */
    public static int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) set.add(num);
        
        int longest = 0;
        for (int num : nums) {
            if (!set.contains(num - 1)) {
                int currNum = num;
                int currStreak = 1;
                
                while (set.contains(currNum + 1)) {
                    currNum++;
                    currStreak++;
                }
                longest = Math.max(longest, currStreak);
            }
        }
        return longest;
    }

    public static void main(String[] args) {
        // Input
        int[] nums = {100, 4, 200, 1, 3, 2};
        
        System.out.println("--- Longest Consecutive Sequence Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        System.out.println("Output: " + longestConsecutive(nums)); // Expected: 4
    }
}
```
**Console Execution Output:**
```text
--- Longest Consecutive Sequence Execution ---
Input: [100, 4, 200, 1, 3, 2]
Output: 4
```

---

### 3. 3Sum (Two Pointers)
Finds all unique triplets in an array that sum up to zero.

```java
import java.util.*;

public class ThreeSum {
    /**
     * Time Complexity: O(N^2) — Sorting is O(N log N) + outer loop and two-pointer scan.
     * Space Complexity: O(log N) to O(N) — Memory used by sorting algorithm.
     */
    public static List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1;
            int right = nums.length - 1;
            
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        // Input
        int[] nums = {-1, 0, 1, 2, -1, -4};
        
        System.out.println("--- 3Sum Execution ---");
        System.out.println("Input: " + Arrays.toString(nums));
        List<List<Integer>> result = threeSum(nums);
        System.out.println("Output: " + result); // Expected: [[-1, -1, 2], [-1, 0, 1]]
    }
}
```
**Console Execution Output:**
```text
--- 3Sum Execution ---
Input: [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
```

---

### 4. Longest Substring Without Repeating Characters (Sliding Window)
Finds the length of the longest substring with all unique characters.

```java
import java.util.HashSet;
import java.util.Set;

public class LongestSubstring {
    /**
     * Time Complexity: O(N) — Sliding window scan.
     * Space Complexity: O(N) — HashSet size.
     */
    public static int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0, maxLen = 0;
        
        for (int right = 0; right < s.length(); right++) {
            while (set.contains(s.charAt(right))) {
                set.remove(s.charAt(left));
                left++;
            }
            set.add(s.charAt(right));
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        // Input
        String test = "abcabcbb";
        
        System.out.println("--- Longest Substring Execution ---");
        System.out.println("Input: \"" + test + "\"");
        System.out.println("Output: " + lengthOfLongestSubstring(test)); // Expected: 3
    }
}
```
**Console Execution Output:**
```text
--- Longest Substring Execution ---
Input: "abcabcbb"
Output: 3
```

---

### 5. Container With Most Water (Two Pointers)
Finds two vertical lines that together with the x-axis forms a container that holds the most water.

```java
import java.util.Arrays;

public class ContainerWithMostWater {
    /**
     * Time Complexity: O(N) — Two pointers scan from outside in.
     * Space Complexity: O(1) — Constant memory.
     */
    public static int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxVal = 0;
        
        while (left < right) {
            int w = right - left;
            int h = Math.min(height[left], height[right]);
            maxVal = Math.max(maxVal, w * h);
            
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxVal;
    }

    public static void main(String[] args) {
        // Input
        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        
        System.out.println("--- Container With Most Water Execution ---");
        System.out.println("Input: " + Arrays.toString(heights));
        System.out.println("Output: " + maxArea(heights)); // Expected: 49
    }
}
```
**Console Execution Output:**
```text
--- Container With Most Water Execution ---
Input: [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49
```

---

### 6. Search in Rotated Sorted Array (Binary Search)
Searches for a target value in an ascending array rotated at an unknown pivot.

```java
import java.util.Arrays;

public class SearchRotatedArray {
    /**
     * Time Complexity: O(log N) — Modified binary search.
     * Space Complexity: O(1) — Constant memory.
     */
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        // Input
        int[] nums = {4, 5, 6, 7, 0, 1, 2};
        int target = 0;
        
        System.out.println("--- Search in Rotated Sorted Array Execution ---");
        System.out.println("Input: nums = " + Arrays.toString(nums) + ", target = " + target);
        System.out.println("Output: " + search(nums, target)); // Expected: 4
    }
}
```
**Console Execution Output:**
```text
--- Search in Rotated Sorted Array Execution ---
Input: nums = [4, 5, 6, 7, 0, 1, 2], target = 0
Output: 4
```

---

### 7. LRU Cache (Design / Linked List)
Designs a Least Recently Used (LRU) Cache in $O(1)$ time for get and put operations.

```java
import java.util.HashMap;
import java.util.Map;

public class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        insertAtHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            map.remove(tail.prev.key);
            remove(tail.prev);
        }
        Node node = new Node(key, value);
        map.put(key, node);
        insertAtHead(node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertAtHead(Node node) {
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }

    public static void main(String[] args) {
        System.out.println("--- LRU Cache Execution ---");
        System.out.println("Initializing LRUCache with capacity 2");
        LRUCache cache = new LRUCache(2);
        
        System.out.println("Put(1, 1)"); cache.put(1, 1);
        System.out.println("Put(2, 2)"); cache.put(2, 2);
        System.out.println("Get(1): Output = " + cache.get(1)); // Expected: 1
        
        System.out.println("Put(3, 3) -> Evicts key 2"); cache.put(3, 3); 
        System.out.println("Get(2): Output = " + cache.get(2)); // Expected: -1 (evicted)
        
        System.out.println("Put(4, 4) -> Evicts key 1"); cache.put(4, 4);
        System.out.println("Get(1): Output = " + cache.get(1)); // Expected: -1 (evicted)
        System.out.println("Get(3): Output = " + cache.get(3)); // Expected: 3
    }
}
```
**Console Execution Output:**
```text
--- LRU Cache Execution ---
Initializing LRUCache with capacity 2
Put(1, 1)
Put(2, 2)
Get(1): Output = 1
Put(3, 3) -> Evicts key 2
Get(2): Output = -1
Put(4, 4) -> Evicts key 1
Get(1): Output = -1
Get(3): Output = 3
```

---

### 8. Number of Islands (Graphs)
Counts distinct islands of '1's in a grid representing land and water.

```java
public class NumberOfIslands {
    /**
     * Time Complexity: O(M * N) — Visit each grid cell.
     * Space Complexity: O(M * N) — In-place traversal call stack size (worst case).
     */
    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        
        for (int i = 0; i < grid.length; i++) {
            for (int j = 0; j < grid[0].length; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }

    private static void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') {
            return;
        }
        grid[r][c] = '0'; // Sink cell
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

    public static void main(String[] args) {
        // Input
        char[][] grid = {
            {'1', '1', '0', '0', '0'},
            {'1', '1', '0', '0', '0'},
            {'0', '0', '1', '0', '0'},
            {'0', '0', '0', '1', '1'}
        };
        
        System.out.println("--- Number of Islands Execution ---");
        System.out.println("Input grid layout:");
        for (char[] row : grid) {
            for (char cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
        
        System.out.println("Output: " + numIslands(grid)); // Expected: 3
    }
}
```
**Console Execution Output:**
```text
--- Number of Islands Execution ---
Input grid layout:
1 1 0 0 0 
1 1 0 0 0 
0 0 1 0 0 
0 0 0 1 1 
Output: 3
```

---

### 9. Coin Change (Dynamic Programming)
Finds the fewest number of coins needed to make up a target amount.

```java
import java.util.Arrays;

public class CoinChange {
    /**
     * Time Complexity: O(A * C) where A is the amount, C is the number of coins.
     * Space Complexity: O(A) for the DP table.
     */
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        // Input
        int[] coins = {1, 2, 5};
        int amount = 11;
        
        System.out.println("--- Coin Change Execution ---");
        System.out.println("Input: coins = " + Arrays.toString(coins) + ", amount = " + amount);
        System.out.println("Output: " + coinChange(coins, amount)); // Expected: 3
    }
}
```
**Console Execution Output:**
```text
--- Coin Change Execution ---
Input: coins = [1, 2, 5], amount = 11
Output: 3
```

---

## 🧭 SDET Hot Take

> [!TIP]
> **SDET Hot Take on LeetCode Medium Problems:**
> "Medium questions represent the true technical baseline of a senior-level automation/SDET engineer. These patterns are vital when writing complex custom reporting modules, designing memory-efficient concurrent thread dispatch pools (`LRU Cache` logic maps directly to driver instance caching), or performing advanced element dependency checks on a dynamically updating web page (graph/topological sorting patterns)."
