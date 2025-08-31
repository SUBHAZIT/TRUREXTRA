export type Lang = "javascript" | "python" | "java" | "cpp"

export type TestCase = { input: any[]; output: any }
export type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  example: string
  constraints: string[]
  topics: string[]
  companies: string[]
  signature: string
  functionName: string
  starter: string
  tests: TestCase[]
}

export type TestResult = {
  index: number
  pass: boolean
  input: any
  expected: any
  got: any
  timeMs: number
}

const E = (s: string) => s.trim()

export const questions: Question[] = [
  {
    id: "q1",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Return indices of the two numbers in an array that add up to a target. Assume exactly one solution and you may not use the same element twice.",
    example: E(`twoSum([2,7,11,15], 9) -> [0,1]`),
    constraints: ["2 ≤ n ≤ 10^4", "-10^9 ≤ nums[i], target ≤ 10^9"],
    topics: ["Array", "Hash Table"],
    companies: ["Amazon", "Google"],
    signature: "function twoSum(nums: number[], target: number): number[]",
    functionName: "twoSum",
    starter: E(`
    function twoSum(nums, target) {
      // write your code
      const map = new Map();
      for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
      }
      return [];
    }
    `),
    tests: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
    ],
  },
  {
    id: "q2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string with brackets '()[]{}', determine if the input string is valid.",
    example: E(`isValid("()[]{}") -> true`),
    constraints: ["1 ≤ s.length ≤ 10^4"],
    topics: ["Stack", "String"],
    companies: ["Microsoft"],
    signature: "function isValid(s: string): boolean",
    functionName: "isValid",
    starter: E(`
    function isValid(s) {
      const map = {')':'(', ']':'[', '}':'{'};
      const st = [];
      for (const ch of s) {
        if (ch === '(' || ch === '[' || ch === '{') st.push(ch);
        else {
          if (!st.length || st.pop() !== map[ch]) return false;
        }
      }
      return st.length === 0;
    }`),
    tests: [
      { input: ["()[]{}"], output: true },
      { input: ["(]"], output: false },
      { input: ["({[]})"], output: true },
    ],
  },
  {
    id: "q3",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "Maximize profit by choosing a single day to buy and a different day to sell.",
    example: E(`maxProfit([7,1,5,3,6,4]) -> 5`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Array", "Greedy"],
    companies: ["Facebook"],
    signature: "function maxProfit(prices: number[]): number",
    functionName: "maxProfit",
    starter: E(`
    function maxProfit(prices) {
      let minP = Infinity, ans = 0;
      for (const p of prices) { minP = Math.min(minP, p); ans = Math.max(ans, p - minP); }
      return ans;
    }`),
    tests: [
      { input: [[7, 1, 5, 3, 6, 4]], output: 5 },
      { input: [[7, 6, 4, 3, 1]], output: 0 },
    ],
  },
  {
    id: "q4",
    title: "Contains Duplicate",
    difficulty: "Easy",
    description: "Return true if any value appears at least twice in the array.",
    example: E(`containsDuplicate([1,2,3,1]) -> true`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Array", "Hash Set"],
    companies: ["Google"],
    signature: "function containsDuplicate(nums: number[]): boolean",
    functionName: "containsDuplicate",
    starter: E(`
    function containsDuplicate(nums) {
      const s = new Set(nums);
      return s.size !== nums.length;
    }`),
    tests: [
      { input: [[1, 2, 3, 1]], output: true },
      { input: [[1, 2, 3, 4]], output: false },
    ],
  },
  {
    id: "q5",
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if t is an anagram of s.",
    example: E(`isAnagram("anagram","nagaram") -> true`),
    constraints: ["1 ≤ n ≤ 5*10^4"],
    topics: ["Hash Table", "String"],
    companies: ["Adobe"],
    signature: "function isAnagram(s: string, t: string): boolean",
    functionName: "isAnagram",
    starter: E(`
    function isAnagram(s, t) {
      if (s.length !== t.length) return false;
      const cnt = new Map();
      for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1);
      for (const c of t) {
        if (!cnt.has(c)) return false;
        cnt.set(c, cnt.get(c) - 1);
        if (cnt.get(c) === 0) cnt.delete(c);
      }
      return cnt.size === 0;
    }`),
    tests: [
      { input: ["anagram", "nagaram"], output: true },
      { input: ["rat", "car"], output: false },
    ],
  },
  {
    id: "q6",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Return an array answer such that answer[i] is the product of all elements of nums except nums[i].",
    example: E(`productExceptSelf([1,2,3,4]) -> [24,12,8,6]`),
    constraints: ["2 ≤ n ≤ 10^5", "The product fits in 32-bit integer"],
    topics: ["Array", "Prefix"],
    companies: ["Amazon", "Google"],
    signature: "function productExceptSelf(nums: number[]): number[]",
    functionName: "productExceptSelf",
    starter: E(`
    function productExceptSelf(nums) {
      const n = nums.length, ans = Array(n).fill(1);
      let pref = 1;
      for (let i=0;i<n;i++){ ans[i] = pref; pref *= nums[i]; }
      let suf = 1;
      for (let i=n-1;i>=0;i--){ ans[i] *= suf; suf *= nums[i]; }
      return ans;
    }`),
    tests: [
      { input: [[1, 2, 3, 4]], output: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], output: [0, 0, 9, 0, 0] },
    ],
  },
  {
    id: "q7",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    description: "Return the k most frequent elements in any order.",
    example: E(`topKFrequent([1,1,1,2,2,3],2) -> [1,2]`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Heap", "Bucket Sort"],
    companies: ["Meta"],
    signature: "function topKFrequent(nums: number[], k: number): number[]",
    functionName: "topKFrequent",
    starter: E(`
    function topKFrequent(nums, k) {
      const map = new Map();
      for (const x of nums) map.set(x, (map.get(x)||0)+1);
      const buckets = Array(nums.length+1).fill(0).map(()=>[]);
      for (const [v,c] of map.entries()) buckets[c].push(v);
      const out = [];
      for (let i=buckets.length-1;i>=0 && out.length<k;i--) for (const v of buckets[i]) out.push(v);
      return out.slice(0,k);
    }`),
    tests: [
      { input: [[1, 1, 1, 2, 2, 3], 2], output: [1, 2] },
      { input: [[1], 1], output: [1] },
    ],
  },
  {
    id: "q8",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Return the index of target in a sorted array or -1 if not found.",
    example: E(`search([-1,0,3,5,9,12], 9) -> 4`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Binary Search"],
    companies: ["Google"],
    signature: "function search(nums: number[], target: number): number",
    functionName: "search",
    starter: E(`
    function search(nums, target){
      let l = 0, r = nums.length-1;
      while (l<=r){
        const m = (l+r)>>1;
        if (nums[m] === target) return m;
        if (nums[m] < target) l = m+1; else r = m-1;
      }
      return -1;
    }`),
    tests: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], output: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], output: -1 },
    ],
  },
  {
    id: "q9",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    example: E(`climbStairs(3) -> 3`),
    constraints: ["1 ≤ n ≤ 45"],
    topics: ["DP"],
    companies: ["Apple"],
    signature: "function climbStairs(n: number): number",
    functionName: "climbStairs",
    starter: E(`
    function climbStairs(n){
      let a=1,b=1;
      for(let i=0;i<n;i++){ [a,b] = [b,a+b]; }
      return a;
    }`),
    tests: [
      { input: [2], output: 2 },
      { input: [3], output: 3 },
    ],
  },
  {
    id: "q10",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum.",
    example: E(`maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) -> 6`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["DP"],
    companies: ["Bloomberg"],
    signature: "function maxSubArray(nums: number[]): number",
    functionName: "maxSubArray",
    starter: E(`
    function maxSubArray(nums){
      let best = nums[0], cur = nums[0];
      for(let i=1;i<nums.length;i++){
        cur = Math.max(nums[i], cur+nums[i]);
        best = Math.max(best, cur);
      }
      return best;
    }`),
    tests: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], output: 6 },
      { input: [[1]], output: 1 },
    ],
  },
  {
    id: "q11",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Move all zeroes to the end maintaining relative order of non-zero elements.",
    example: E(`moveZeroes([0,1,0,3,12]) -> [1,3,12,0,0]`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Two Pointers"],
    companies: ["Facebook"],
    signature: "function moveZeroes(nums: number[]): number[]",
    functionName: "moveZeroes",
    starter: E(`
    function moveZeroes(nums){
      let j=0;
      for(let i=0;i<nums.length;i++){
        if(nums[i]!==0){ [nums[i], nums[j]]=[nums[j], nums[i]]; j++; }
      }
      return nums;
    }`),
    tests: [
      { input: [[0, 1, 0, 3, 12]], output: [1, 3, 12, 0, 0] },
      { input: [[0]], output: [0] },
    ],
  },
  {
    id: "q12",
    title: "Rotate Array",
    difficulty: "Medium",
    description: "Rotate the array to the right by k steps.",
    example: E(`rotate([1,2,3,4,5,6,7],3) -> [5,6,7,1,2,3,4]`),
    constraints: ["1 ≤ n ≤ 10^5"],
    topics: ["Array"],
    companies: ["Netflix"],
    signature: "function rotate(nums: number[], k: number): number[]",
    functionName: "rotate",
    starter: E(`
    function rotate(nums, k){
      k%=nums.length;
      reverse(nums,0,nums.length-1);
      reverse(nums,0,k-1);
      reverse(nums,k,nums.length-1);
      return nums;
      function reverse(a,l,r){ while(l<r){ [a[l],a[r]]=[a[r],a[l]]; l++; r--; } }
    }`),
    tests: [
      { input: [[1, 2, 3, 4, 5, 6, 7], 3], output: [5, 6, 7, 1, 2, 3, 4] },
      { input: [[-1, -100, 3, 99], 2], output: [3, 99, -1, -100] },
    ],
  },
  {
    id: "q13",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    description: "If an element is 0, set its entire row and column to 0 in-place.",
    example: E(`setZeroes([[1,1,1],[1,0,1],[1,1,1]]) -> [[1,0,1],[0,0,0],[1,0,1]]`),
    constraints: ["1 ≤ m,n ≤ 200"],
    topics: ["Matrix"],
    companies: ["Uber"],
    signature: "function setZeroes(matrix: number[][]): number[][]",
    functionName: "setZeroes",
    starter: E(`
    function setZeroes(matrix){
      const m=matrix.length,n=matrix[0].length
      const rows=new Set(), cols=new Set()
      for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(matrix[i][j]===0){ rows.add(i); cols.add(j) }
      for(let i=0;i<m;i++)for(let j=0;j<n;j++) if(rows.has(i)||cols.has(j)) matrix[i][j]=0
      return matrix
    }`),
    tests: [
      {
        input: [
          [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
          ],
        ],
        output: [
          [1, 0, 1],
          [0, 0, 0],
          [1, 0, 1],
        ],
      },
      {
        input: [
          [
            [0, 1, 2, 0],
            [3, 4, 5, 2],
            [1, 3, 1, 5],
          ],
        ],
        output: [
          [0, 0, 0, 0],
          [0, 4, 5, 0],
          [0, 3, 1, 0],
        ],
      },
    ],
  },
  {
    id: "q14",
    title: "Flood Fill",
    difficulty: "Easy",
    description: "Perform flood fill on a 2D image.",
    example: E(`floodFill([[1,1,1],[1,1,0],[1,0,1]],1,1,2)`),
    constraints: ["1 ≤ m,n ≤ 50"],
    topics: ["DFS", "BFS"],
    companies: ["Google"],
    signature: "function floodFill(image: number[][], sr: number, sc: number, color: number): number[][]",
    functionName: "floodFill",
    starter: E(`
    function floodFill(image, sr, sc, color){
      const m=image.length,n=image[0].length, start=image[sr][sc]
      if(start===color) return image
      const dir=[[1,0],[-1,0],[0,1],[0,-1]]
      const q=[[sr,sc]]; image[sr][sc]=color
      while(q.length){
        const [r,c]=q.shift()
        for(const [dr,dc] of dir){
          const nr=r+dr,nc=c+dc
          if(nr>=0 && nr<m && nc>=0 && nc<n && image[nr][nc]===start){
            image[nr][nc]=color; q.push([nr,nc])
          }
        }
      }
      return image
    }`),
    tests: [
      {
        input: [
          [
            [1, 1, 1],
            [1, 1, 0],
            [1, 0, 1],
          ],
          1,
          1,
          2,
        ],
        output: [
          [2, 2, 2],
          [2, 2, 0],
          [2, 0, 1],
        ],
      },
    ],
  },
  {
    id: "q15",
    title: "Rotate Image",
    difficulty: "Medium",
    description: "Rotate an n x n matrix by 90 degrees clockwise in-place.",
    example: E(`rotateImage([[1,2,3],[4,5,6],[7,8,9]]) -> [[7,4,1],[8,5,2],[9,6,3]]`),
    constraints: ["1 ≤ n ≤ 20"],
    topics: ["Matrix"],
    companies: ["NVIDIA"],
    signature: "function rotateImage(matrix: number[][]): number[][]",
    functionName: "rotateImage",
    starter: E(`
    function rotateImage(matrix){
      const n=matrix.length
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++) [matrix[i][j],matrix[j][i]]=[matrix[j][i],matrix[i][j]]
      for(let i=0;i<n;i++) matrix[i].reverse()
      return matrix
    }`),
    tests: [
      {
        input: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        output: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ],
      },
    ],
  },
  {
    id: "q16",
    title: "Coin Change",
    difficulty: "Medium",
    description: "Given coins and an amount, return the fewest coins needed to make up that amount, or -1.",
    example: E(`coinChange([1,2,5],11) -> 3`),
    constraints: ["1 ≤ amount ≤ 10^4"],
    topics: ["DP"],
    companies: ["Stripe"],
    signature: "function coinChange(coins: number[], amount: number): number",
    functionName: "coinChange",
    starter: E(`
    function coinChange(coins, amount){
      const dp = Array(amount+1).fill(Infinity); dp[0]=0
      for(const c of coins) for(let a=c;a<=amount;a++) dp[a]=Math.min(dp[a], dp[a-c]+1)
      return dp[amount]===Infinity?-1:dp[amount]
    }`),
    tests: [
      { input: [[1, 2, 5], 11], output: 3 },
      { input: [[2], 3], output: -1 },
    ],
  },
  {
    id: "q17",
    title: "House Robber",
    difficulty: "Medium",
    description: "Maximize robbed value without robbing adjacent houses.",
    example: E(`rob([1,2,3,1]) -> 4`),
    constraints: ["1 ≤ n ≤ 100"],
    topics: ["DP"],
    companies: ["Microsoft"],
    signature: "function rob(nums: number[]): number",
    functionName: "rob",
    starter: E(`
    function rob(nums){
      let prev=0, cur=0
      for(const x of nums){ [prev, cur] = [cur, Math.max(cur, prev + x)] }
      return cur
    }`),
    tests: [
      { input: [[1, 2, 3, 1]], output: 4 },
      { input: [[2, 7, 9, 3, 1]], output: 12 },
    ],
  },
  {
    id: "q18",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    description: "Return the number of '1' bits in the binary representation.",
    example: E(`hammingWeight(11) -> 3`),
    constraints: ["0 ≤ n ≤ 2^31-1"],
    topics: ["Bit Manipulation"],
    companies: ["Intel"],
    signature: "function hammingWeight(n: number): number",
    functionName: "hammingWeight",
    starter: E(`
    function hammingWeight(n){
      let cnt=0
      while(n){ n&=(n-1); cnt++ }
      return cnt
    }`),
    tests: [
      { input: [11], output: 3 },
      { input: [128], output: 1 },
    ],
  },
  {
    id: "q19",
    title: "Valid Palindrome",
    difficulty: "Easy",
    description: "Determine if a string is a palindrome considering only alphanumeric characters and ignoring cases.",
    example: E(`isPalindrome("A man, a plan, a canal: Panama") -> true`),
    constraints: ["1 ≤ s.length ≤ 2*10^5"],
    topics: ["Two Pointers", "String"],
    companies: ["Google"],
    signature: "function isPalindrome(s: string): boolean",
    functionName: "isPalindrome",
    starter: E(`
    function isPalindrome(s){
      s = s.toLowerCase().replace(/[^a-z0-9]/g,'')
      let l=0,r=s.length-1
      while(l<r){ if(s[l++]!==s[r--]) return false }
      return true
    }`),
    tests: [
      { input: ["A man, a plan, a canal: Panama"], output: true },
      { input: ["race a car"], output: false },
    ],
  },
  {
    id: "q20",
    title: "Merge Two Sorted Arrays",
    difficulty: "Easy",
    description: "Merge two sorted arrays and return a sorted array.",
    example: E(`mergeArrays([1,2,4],[1,3,4]) -> [1,1,2,3,4,4]`),
    constraints: ["0 ≤ m,n ≤ 10^5"],
    topics: ["Two Pointers"],
    companies: ["Google"],
    signature: "function mergeArrays(a: number[], b: number[]): number[]",
    functionName: "mergeArrays",
    starter: E(`
    function mergeArrays(a,b){
      const out=[]
      let i=0,j=0
      while(i<a.length||j<b.length){
        if(j>=b.length || (i<a.length && a[i] <= b[j])) out.push(a[i++])
        else out.push(b[j++])
      }
      return out
    }`),
    tests: [
      {
        input: [
          [1, 2, 4],
          [1, 3, 4],
        ],
        output: [1, 1, 2, 3, 4, 4],
      },
      { input: [[], [1]], output: [1] },
    ],
  },
  {
    id: "q21",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    description: "Write a function to find the longest common prefix amongst an array of strings.",
    example: E(`longestCommonPrefix(["flower","flow","flight"]) -> "fl"`),
    constraints: ["1 ≤ n ≤ 200"],
    topics: ["String"],
    companies: ["Apple"],
    signature: "function longestCommonPrefix(strs: string[]): string",
    functionName: "longestCommonPrefix",
    starter: E(`
    function longestCommonPrefix(strs){
      if(!strs.length) return ""
      let pref=strs[0]
      for(let i=1;i<strs.length;i++){
        while(strs[i].indexOf(pref) !== 0){ pref = pref.slice(0,-1); if(!pref) return "" }
      }
      return pref
    }`),
    tests: [
      { input: [["flower", "flow", "flight"]], output: "fl" },
      { input: [["dog", "racecar", "car"]], output: "" },
    ],
  },
]

export function getStarterFor(q: Question, lang: Lang): string {
  if (lang === "javascript") {
    return "" // Removed default solution
  } else if (lang === "python") {
    return `def ${q.functionName}(...):\n    # Write your code here\n    pass`
  } else if (lang === "java") {
    return `public static Object ${q.functionName}(...) {\n    // Write your code here\n    return null;\n}`
  } else if (lang === "cpp") {
    return `// Write your code here\n// Function signature: ${q.signature}`
  }
  return ""
}
