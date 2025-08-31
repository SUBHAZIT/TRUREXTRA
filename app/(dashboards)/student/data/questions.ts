export type Question = {
  slug: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  functionName: string
  starter: string
  tests: { input: any[]; output: any }[]
}

const q = (p: Partial<Question>) => p as Question

const questions: Question[] = [
  q({
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Return indices of two numbers that add up to target.",
    functionName: "twoSum",
    starter: `function twoSum(nums, target){
  const map=new Map();
  for(let i=0;i<nums.length;i++){
    const need=target-nums[i];
    if(map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    tests: [
      { input: [[2, 7, 11, 15], 9], output: [0, 1] },
      { input: [[3, 2, 4], 6], output: [1, 2] },
      { input: [[3, 3], 6], output: [0, 1] },
    ],
  }),
  q({
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Reverse a string s.",
    functionName: "reverseString",
    starter: `function reverseString(s){ return s.split('').reverse().join(''); }`,
    tests: [
      { input: ["hello"], output: "olleh" },
      { input: [""], output: "" },
    ],
  }),
  q({
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    description: "Return true if s and t are anagrams.",
    functionName: "isAnagram",
    starter: `function isAnagram(s,t){
  if(s.length!==t.length) return false;
  const c=new Map();
  for(const ch of s) c.set(ch,(c.get(ch)||0)+1);
  for(const ch of t){
    if(!c.has(ch)) return false;
    c.set(ch,c.get(ch)-1);
    if(c.get(ch)===0) c.delete(ch);
  }
  return c.size===0;
}`,
    tests: [
      { input: ["anagram", "nagaram"], output: true },
      { input: ["rat", "car"], output: false },
    ],
  }),
  q({
    slug: "two-sum-ii",
    title: "Two Sum II",
    difficulty: "Easy",
    description: "1-based indices from sorted array that sum to target.",
    functionName: "twoSumII",
    starter: `function twoSumII(a,t){
  let l=0,r=a.length-1;
  while(l<r){
    const s=a[l]+a[r];
    if(s===t) return [l+1,r+1];
    if(s<t) l++; else r--;
  }
  return [];
}`,
    tests: [
      { input: [[2, 7, 11, 15], 9], output: [1, 2] },
      { input: [[2, 3, 4], 6], output: [1, 3] },
    ],
  }),
  q({
    slug: "valid-parens",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Check if parentheses/brackets are valid.",
    functionName: "isValid",
    starter: `function isValid(s){
  const m={')':'(',']':'[','}':'{'};
  const st=[];
  for(const ch of s){
    if(ch==='('||ch==='['||ch==='{') st.push(ch);
    else { if(st.pop()!==m[ch]) return false; }
  }
  return st.length===0;
}`,
    tests: [
      { input: ["()[]{}"], output: true },
      { input: ["(]"], output: false },
      { input: ["{[]}"], output: true },
    ],
  }),
  q({
    slug: "max-profit",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "Max single-transaction profit.",
    functionName: "maxProfit",
    starter: `function maxProfit(p){
  let min=Infinity, ans=0;
  for(const x of p){ min=Math.min(min,x); ans=Math.max(ans,x-min); }
  return ans;
}`,
    tests: [
      { input: [[7, 1, 5, 3, 6, 4]], output: 5 },
      { input: [[7, 6, 4, 3, 1]], output: 0 },
    ],
  }),
  q({
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Return index of target or -1.",
    functionName: "search",
    starter: `function search(a,t){
  let l=0,r=a.length-1;
  while(l<=r){
    const m=(l+r)>>1;
    if(a[m]===t) return m;
    if(a[m]<t) l=m+1; else r=m-1;
  }
  return -1;
}`,
    tests: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], output: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], output: -1 },
    ],
  }),
  q({
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    description: "Move all zeroes to the end.",
    functionName: "moveZeroes",
    starter: `function moveZeroes(a){
  let i=0; for(const n of a) if(n!==0) a[i++]=n; while(i<a.length) a[i++]=0; return a;
}`,
    tests: [
      { input: [[0, 1, 0, 3, 12]], output: [1, 3, 12, 0, 0] },
      { input: [[0]], output: [0] },
    ],
  }),
  q({
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Check if integer is palindrome.",
    functionName: "isPalindrome",
    starter: `function isPalindrome(x){ if(x<0) return false; const s=String(x); return s===s.split('').reverse().join(''); }`,
    tests: [
      { input: [121], output: true },
      { input: [-121], output: false },
    ],
  }),
  q({
    slug: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    description: "Return list from 1..n with FizzBuzz rules.",
    functionName: "fizzBuzz",
    starter: `function fizzBuzz(n){
  const res=[];
  for(let i=1;i<=n;i++){
    let s=''; if(i%3===0) s+='Fizz'; if(i%5===0) s+='Buzz'; res.push(s||String(i));
  }
  return res;
}`,
    tests: [
      { input: [3], output: ["1", "2", "Fizz"] },
      { input: [5], output: ["1", "2", "Fizz", "4", "Buzz"] },
    ],
  }),
  q({
    slug: "merge-two",
    title: "Merge Two Sorted Arrays",
    difficulty: "Easy",
    description: "Merge two sorted arrays.",
    functionName: "mergeTwo",
    starter: `function mergeTwo(a,b){
  let i=0,j=0,res=[];
  while(i<a.length||j<b.length){
    if(j>=b.length||(i<a.length&&a[i]<=b[j])) res.push(a[i++]); else res.push(b[j++]);
  }
  return res;
}`,
    tests: [
      {
        input: [
          [1, 2, 4],
          [1, 3, 4],
        ],
        output: [1, 1, 2, 3, 4, 4],
      },
      { input: [[], [0]], output: [0] },
    ],
  }),
  q({
    slug: "climb-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "Ways to climb n stairs.",
    functionName: "climbStairs",
    starter: `function climbStairs(n){ let a=1,b=1; for(let i=0;i<n;i++){ [a,b]=[b,a+b]; } return a; }`,
    tests: [
      { input: [2], output: 2 },
      { input: [3], output: 3 },
    ],
  }),
  q({
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Group words that are anagrams.",
    functionName: "groupAnagrams",
    starter: `function groupAnagrams(strs){
  const map=new Map();
  for(const s of strs){
    const key=s.split('').sort().join('');
    map.set(key, [...(map.get(key)||[]), s]);
  }
  return Array.from(map.values());
}`,
    tests: [
      { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
    ],
  }),
]

export default questions
