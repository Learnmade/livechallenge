import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Import models
const Challenge = (await import('../models/Challenge.js')).default

const challenges = {
  javascript: [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'easy',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
      starterCode: 'function twoSum(nums, target) {\n  // Your code here\n  return [];\n}',
      testCases: [
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
        { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
        { input: '[3,3]\n6', expectedOutput: '[0,1]' },
      ],
      points: 100,
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
      difficulty: 'easy',
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
        { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: '' },
      ],
      constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
      starterCode: 'function reverseString(s) {\n  // Your code here\n}',
      testCases: [
        { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
        { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
      ],
      points: 100,
    },
    {
      title: 'Valid Palindrome',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
      difficulty: 'easy',
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
        { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' },
      ],
      constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
      starterCode: 'function isPalindrome(s) {\n  // Your code here\n  return false;\n}',
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
        { input: '"race a car"', expectedOutput: 'false' },
        { input: '" "', expectedOutput: 'true' },
      ],
      points: 100,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      difficulty: 'medium',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
        { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
      starterCode: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n  return 0;\n}',
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3' },
        { input: '"bbbbb"', expectedOutput: '1' },
        { input: '"pwwkew"', expectedOutput: '3' },
      ],
      points: 150,
    },
    {
      title: 'Container With Most Water',
      description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
      difficulty: 'medium',
      examples: [
        { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.' },
        { input: 'height = [1,1]', output: '1', explanation: '' },
      ],
      constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
      starterCode: 'function maxArea(height) {\n  // Your code here\n  return 0;\n}',
      testCases: [
        { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
        { input: '[1,1]', expectedOutput: '1' },
      ],
      points: 150,
    },
    {
      title: 'Three Sum',
      description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.',
      difficulty: 'medium',
      examples: [
        { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: '' },
        { input: 'nums = [0,1,1]', output: '[]', explanation: 'The only possible triplet does not sum up to 0.' },
      ],
      constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
      starterCode: 'function threeSum(nums) {\n  // Your code here\n  return [];\n}',
      testCases: [
        { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
        { input: '[0,1,1]', expectedOutput: '[]' },
      ],
      points: 150,
    },
    {
      title: 'Merge Intervals',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      difficulty: 'medium',
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
        { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
      ],
      constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
      starterCode: 'function merge(intervals) {\n  // Your code here\n  return [];\n}',
      testCases: [
        { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
        { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      ],
      points: 150,
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
      difficulty: 'easy',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' },
      ],
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
      starterCode: 'function maxProfit(prices) {\n  // Your code here\n  return 0;\n}',
      testCases: [
        { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
        { input: '[7,6,4,3,1]', expectedOutput: '0' },
      ],
      points: 100,
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
      difficulty: 'easy',
      examples: [
        { input: 's = "()"', output: 'true', explanation: '' },
        { input: 's = "()[]{}"', output: 'true', explanation: '' },
        { input: 's = "(]"', output: 'false', explanation: '' },
      ],
      constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
      starterCode: 'function isValid(s) {\n  // Your code here\n  return false;\n}',
      testCases: [
        { input: '"()"', expectedOutput: 'true' },
        { input: '"()[]{}"', expectedOutput: 'true' },
        { input: '"(]"', expectedOutput: 'false' },
      ],
      points: 100,
    },
    {
      title: 'Trapping Rain Water',
      description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      difficulty: 'hard',
      examples: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.' },
        { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '' },
      ],
      constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
      starterCode: 'function trap(height) {\n  // Your code here\n  return 0;\n}',
      testCases: [
        { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
        { input: '[4,2,0,3,2,5]', expectedOutput: '9' },
      ],
      points: 200,
    },
  ],
  python: [
    {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      difficulty: 'easy',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      ],
      constraints: ['2 <= len(nums) <= 10^4', '-10^9 <= nums[i] <= 10^9'],
      starterCode: 'def twoSum(nums, target):\n    # Your code here\n    return []',
      testCases: [
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
        { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
      ],
      points: 100,
    },
    {
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as a list of characters.',
      difficulty: 'easy',
      examples: [
        { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
      ],
      constraints: ['1 <= len(s) <= 10^5'],
      starterCode: 'def reverseString(s):\n    # Your code here\n    pass',
      testCases: [
        { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      ],
      points: 100,
    },
    {
      title: 'Valid Palindrome',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      difficulty: 'easy',
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'True', explanation: '' },
      ],
      constraints: ['1 <= len(s) <= 2 * 10^5'],
      starterCode: 'def isPalindrome(s):\n    # Your code here\n    return False',
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True' },
        { input: '"race a car"', expectedOutput: 'False' },
      ],
      points: 100,
    },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      difficulty: 'medium',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      ],
      constraints: ['0 <= len(s) <= 5 * 10^4'],
      starterCode: 'def lengthOfLongestSubstring(s):\n    # Your code here\n    return 0',
      testCases: [
        { input: '"abcabcbb"', expectedOutput: '3' },
        { input: '"bbbbb"', expectedOutput: '1' },
      ],
      points: 150,
    },
    {
      title: 'Container With Most Water',
      description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
      difficulty: 'medium',
      examples: [
        { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: '' },
      ],
      constraints: ['n == len(height)', '2 <= n <= 10^5'],
      starterCode: 'def maxArea(height):\n    # Your code here\n    return 0',
      testCases: [
        { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      ],
      points: 150,
    },
    {
      title: 'Three Sum',
      description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
      difficulty: 'medium',
      examples: [
        { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: '' },
      ],
      constraints: ['3 <= len(nums) <= 3000'],
      starterCode: 'def threeSum(nums):\n    # Your code here\n    return []',
      testCases: [
        { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      ],
      points: 150,
    },
    {
      title: 'Merge Intervals',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
      difficulty: 'medium',
      examples: [
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '' },
      ],
      constraints: ['1 <= len(intervals) <= 10^4'],
      starterCode: 'def merge(intervals):\n    # Your code here\n    return []',
      testCases: [
        { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      ],
      points: 150,
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve.',
      difficulty: 'easy',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: '' },
      ],
      constraints: ['1 <= len(prices) <= 10^5'],
      starterCode: 'def maxProfit(prices):\n    # Your code here\n    return 0',
      testCases: [
        { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      ],
      points: 100,
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      difficulty: 'easy',
      examples: [
        { input: 's = "()"', output: 'True', explanation: '' },
      ],
      constraints: ['1 <= len(s) <= 10^4'],
      starterCode: 'def isValid(s):\n    # Your code here\n    return False',
      testCases: [
        { input: '"()"', expectedOutput: 'True' },
        { input: '"(]"', expectedOutput: 'False' },
      ],
      points: 100,
    },
    {
      title: 'Trapping Rain Water',
      description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
      difficulty: 'hard',
      examples: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '' },
      ],
      constraints: ['n == len(height)', '1 <= n <= 2 * 10^4'],
      starterCode: 'def trap(height):\n    # Your code here\n    return 0',
      testCases: [
        { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      ],
      points: 200,
    },
  ],
  // Similar structure for other languages...
}

// Generate challenges for all languages
const allLanguages = ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'typescript']

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing challenges
    await Challenge.deleteMany({})
    console.log('🗑️  Cleared existing challenges')

    let totalCreated = 0

    for (const language of allLanguages) {
      const langChallenges = challenges[language] || challenges.javascript // Fallback to JS if not defined
      
      for (let i = 0; i < 10; i++) {
        const challengeData = langChallenges[i] || {
          title: `Challenge ${i + 1}`,
          description: `Solve this ${language} challenge.`,
          difficulty: i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard',
          examples: [],
          constraints: [],
          starterCode: '',
          testCases: [],
          points: 100,
        }

        const challenge = await Challenge.create({
          ...challengeData,
          language,
          challengeNumber: i + 1,
          isActive: true,
        })

        totalCreated++
        console.log(`✅ Created ${language} challenge ${i + 1}: ${challengeData.title}`)
      }
    }

    console.log(`\n🎉 Successfully created ${totalCreated} challenges!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding challenges:', error)
    process.exit(1)
  }
}

seedChallenges()

