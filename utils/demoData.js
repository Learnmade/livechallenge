// Demo battle data for testing
export const demoBattles = [
  {
    id: '1',
    title: 'Array Challenge #1',
    difficulty: 'Easy',
    language: 'javascript',
    duration: 5,
    timeRemaining: 300,
    problem: {
      title: 'Two Sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]',
          explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
        },
      ],
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.',
      ],
      note: 'Follow-up: Can you come up with an algorithm that is less than O(n²) time complexity?',
    },
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
  // Return array of two indices
}`,
      python: `def twoSum(nums, target):
    # Your code here
    # Return list of two indices`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    // Return vector of two indices
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        // Return array of two indices
    }
}`,
    },
  },
  {
    id: '2',
    title: 'String Challenge',
    difficulty: 'Medium',
    language: 'python',
    duration: 7,
    timeRemaining: 420,
    problem: {
      title: 'Valid Palindrome',
      description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: 'true',
          explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
        {
          input: 's = "race a car"',
          output: 'false',
          explanation: '"raceacar" is not a palindrome.',
        },
      ],
      constraints: [
        '1 <= s.length <= 2 * 10^5',
        's consists only of printable ASCII characters.',
      ],
    },
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Your code here
  // Return boolean
}`,
      python: `def isPalindrome(s):
    # Your code here
    # Return boolean`,
      cpp: `#include <string>
using namespace std;

bool isPalindrome(string s) {
    // Your code here
    // Return boolean
}`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
        // Return boolean
    }
}`,
    },
  },
]

