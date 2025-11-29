import { NextResponse } from 'next/server'
import { requireHost } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import connectDB from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

const challengeTemplates = {
  javascript: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  python: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  java: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  cpp: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  go: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  rust: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  csharp: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
  typescript: [
    { title: 'Two Sum', difficulty: 'easy', points: 100 },
    { title: 'Reverse String', difficulty: 'easy', points: 100 },
    { title: 'Valid Palindrome', difficulty: 'easy', points: 100 },
    { title: 'Longest Substring', difficulty: 'medium', points: 150 },
    { title: 'Container With Most Water', difficulty: 'medium', points: 150 },
    { title: 'Three Sum', difficulty: 'medium', points: 150 },
    { title: 'Merge Intervals', difficulty: 'medium', points: 150 },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', points: 100 },
    { title: 'Valid Parentheses', difficulty: 'easy', points: 100 },
    { title: 'Trapping Rain Water', difficulty: 'hard', points: 200 },
  ],
}

const getStarterCode = (language, challengeNumber) => {
  const starters = {
    javascript: `function solve(input) {
  // Challenge ${challengeNumber}
  // Your code here
  return input;
}`,
    python: `def solve(input):
    # Challenge ${challengeNumber}
    # Your code here
    return input`,
    java: `public class Solution {
    public static void main(String[] args) {
        // Challenge ${challengeNumber}
        // Your code here
    }
}`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Challenge ${challengeNumber}
    // Your code here
    return 0;
}`,
    go: `package main

import "fmt"

func solve(input interface{}) interface{} {
    // Challenge ${challengeNumber}
    // Your code here
    return input
}

func main() {
    // Your code here
}`,
    rust: `fn solve(input: &str) -> String {
    // Challenge ${challengeNumber}
    // Your code here
    input.to_string()
}

fn main() {
    // Your code here
}`,
    csharp: `using System;

public class Solution {
    public static void Main() {
        // Challenge ${challengeNumber}
        // Your code here
    }
}`,
    typescript: `function solve(input: any): any {
  // Challenge ${challengeNumber}
  // Your code here
  return input;
}`,
  }
  return starters[language] || starters.javascript
}

const getDescription = (title, challengeNumber) => {
  const descriptions = {
    'Two Sum': `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    'Reverse String': `Write a function that reverses a string. The input string is given as an array of characters.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    'Valid Palindrome': `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    'Longest Substring': `Given a string s, find the length of the longest substring without repeating characters.`,
    'Container With Most Water': `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    'Three Sum': `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    'Merge Intervals': `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    'Best Time to Buy and Sell Stock': `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    'Valid Parentheses': `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    'Trapping Rain Water': `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
  }
  return descriptions[title] || `Solve this coding challenge. This is challenge number ${challengeNumber}.`
}

const getExamples = (title) => {
  const examples = {
    'Two Sum': [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    ],
    'Reverse String': [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
    ],
    'Valid Palindrome': [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
    ],
  }
  return examples[title] || [{ input: 'Example input', output: 'Example output', explanation: '' }]
}

const getTestCases = (title) => {
  const testCases = {
    'Two Sum': [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
    ],
    'Reverse String': [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
    ],
    'Valid Palindrome': [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' },
    ],
  }
  return testCases[title] || [
    { input: 'test1', expectedOutput: 'output1' },
    { input: 'test2', expectedOutput: 'output2' },
  ]
}

export async function POST(request) {
  try {
    const user = await requireHost(request)
    await connectDB()

    // Clear existing challenges
    await Challenge.deleteMany({})

    let totalCreated = 0
    const languages = Object.keys(challengeTemplates)

    for (const language of languages) {
      const templates = challengeTemplates[language]
      
      for (let i = 0; i < templates.length; i++) {
        const template = templates[i]
        const challengeNumber = i + 1

        const challenge = await Challenge.create({
          title: template.title,
          description: getDescription(template.title, challengeNumber),
          difficulty: template.difficulty,
          language: language,
          challengeNumber: challengeNumber,
          examples: getExamples(template.title),
          constraints: ['1 <= n <= 10^5'],
          starterCode: getStarterCode(language, challengeNumber),
          testCases: getTestCases(template.title),
          points: template.points,
          isActive: true,
        })

        totalCreated++
      }
    }

    return NextResponse.json({
      message: `Successfully created ${totalCreated} challenges!`,
      totalCreated,
    }, { status: 200 })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === 'Unauthorized' ? 401 : 403 }
      )
    }
    console.error('Seed challenges error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

