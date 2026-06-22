const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const Problem = require("./models/Problem");

const problems = [
  {
    order: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] == 6, return [1, 2].",
      },
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", output: "1 2", isHidden: false },
      { input: "2\n3 3\n6", output: "0 1", isHidden: true },
      { input: "5\n1 2 3 4 5\n9", output: "3 4", isHidden: true },
    ],
    // What user sees and edits
    starterCode: {
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      c: `void twoSum(int* nums, int numsSize, int target, int* result) {
    // Write your solution here
    // Store answer in result[0] and result[1]
    
}`,
    },
    // Hidden wrapper that main() uses — user never sees this
    hiddenCode: {
      cpp: `#include <iostream>
#include <vector>
using namespace std;

{{USER_CODE}}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    vector<int> ans = twoSum(nums, target);
    cout << ans[0] << " " << ans[1] << endl;
    return 0;
}`,
      python: `{{USER_CODE}}

import sys
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(data[i+1]) for i in range(n)]
target = int(data[n+1])
result = twoSum(nums, target)
print(result[0], result[1])`,
      c: `#include <stdio.h>

{{USER_CODE}}

int main() {
    int n;
    scanf("%d", &n);
    int nums[n];
    for(int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int target;
    scanf("%d", &target);
    int result[2];
    twoSum(nums, n, target, result);
    printf("%d %d\\n", result[0], result[1]);
    return 0;
}`,
    },
  },
  {
    order: 2,
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Two Pointers"],
    description: `Write a function that reverses a string.

Given a string s, return the reversed string.`,
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ASCII character.",
    ],
    examples: [
      {
        input: "s = hello",
        output: "olleh",
        explanation: "Reverse of 'hello' is 'olleh'.",
      },
      {
        input: "s = Hannah",
        output: "hannaH",
        explanation: "Reverse of 'Hannah' is 'hannaH'.",
      },
    ],
    testCases: [
      { input: "hello", output: "olleh", isHidden: false },
      { input: "Hannah", output: "hannaH", isHidden: false },
      { input: "abcde", output: "edcba", isHidden: true },
      { input: "a", output: "a", isHidden: true },
    ],
    starterCode: {
      cpp: `string reverseString(string s) {
    // Write your solution here
    
}`,
      python: `def reverseString(s: str) -> str:
    # Write your solution here
    pass`,
      c: `void reverseString(char* s, int len) {
    // Reverse s in-place
    
}`,
    },
    hiddenCode: {
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

{{USER_CODE}}

int main() {
    string s;
    cin >> s;
    cout << reverseString(s) << endl;
    return 0;
}`,
      python: `{{USER_CODE}}

s = input()
print(reverseString(s))`,
      c: `#include <stdio.h>
#include <string.h>

{{USER_CODE}}

int main() {
    char s[100001];
    scanf("%s", s);
    reverseString(s, strlen(s));
    printf("%s\\n", s);
    return 0;
}`,
    },
  },
  {
    order: 3,
    title: "FizzBuzz",
    slug: "fizzbuzz",
    difficulty: "Easy",
    tags: ["Math", "String"],
    description: `Given an integer n, return an array of strings where:

- "FizzBuzz" if i is divisible by both 3 and 5
- "Fizz" if i is divisible by 3
- "Buzz" if i is divisible by 5
- i (as a string) otherwise

Print each value on a new line from 1 to n.`,
    constraints: ["1 <= n <= 10^4"],
    examples: [
      {
        input: "n = 5",
        output: "1\n2\nFizz\n4\nBuzz",
        explanation: "3 → Fizz, 5 → Buzz.",
      },
      {
        input: "n = 3",
        output: "1\n2\nFizz",
        explanation: "3 is divisible by 3 → Fizz.",
      },
    ],
    testCases: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz", isHidden: false },
      { input: "3", output: "1\n2\nFizz", isHidden: false },
      { input: "1", output: "1", isHidden: true },
      {
        input: "15",
        output:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        isHidden: true,
      },
    ],
    starterCode: {
      cpp: `vector<string> fizzBuzz(int n) {
    vector<string> result;
    // Write your solution here
    return result;
}`,
      python: `def fizzBuzz(n: int) -> list[str]:
    result = []
    # Write your solution here
    return result`,
      c: `void fizzBuzz(int n, char result[][10]) {
    // Fill result array with strings
    // result[i] should contain the answer for i+1
    
}`,
    },
    hiddenCode: {
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

{{USER_CODE}}

int main() {
    int n;
    cin >> n;
    vector<string> ans = fizzBuzz(n);
    for(auto& s : ans) cout << s << "\\n";
    return 0;
}`,
      python: `{{USER_CODE}}

n = int(input())
result = fizzBuzz(n)
for s in result:
    print(s)`,
      c: `#include <stdio.h>

{{USER_CODE}}

int main() {
    int n;
    scanf("%d", &n);
    char result[10001][10];
    fizzBuzz(n, result);
    for(int i = 0; i < n; i++) printf("%s\\n", result[i]);
    return 0;
}`,
    },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    await Problem.deleteMany({});
    console.log("🗑️  Cleared existing problems");
    await Problem.insertMany(problems);
    console.log("✅ Seeded 3 problems successfully!");
    problems.forEach((p) =>
      console.log(`  ${p.order}. ${p.title} (${p.difficulty})`),
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
