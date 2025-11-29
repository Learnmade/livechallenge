import { NextResponse } from 'next/server'
import { requireHost } from '@/lib/auth'
import Challenge from '@/models/Challenge'
import connectDB from '@/lib/mongodb'
import { generateSlug } from '@/lib/slug'

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
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: false },
    ],
    'Reverse String': [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isHidden: false },
    ],
    'Valid Palindrome': [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
      { input: '"race a car"', expectedOutput: 'false', isHidden: false },
      { input: '" "', expectedOutput: 'true', isHidden: false },
    ],
    'Longest Substring': [
      { input: '"abcabcbb"', expectedOutput: '3', isHidden: false },
      { input: '"bbbbb"', expectedOutput: '1', isHidden: false },
      { input: '"pwwkew"', expectedOutput: '3', isHidden: false },
    ],
    'Container With Most Water': [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isHidden: false },
      { input: '[1,1]', expectedOutput: '1', isHidden: false },
    ],
    'Three Sum': [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false },
      { input: '[0,1,1]', expectedOutput: '[]', isHidden: false },
    ],
    'Merge Intervals': [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', isHidden: false },
    ],
    'Best Time to Buy and Sell Stock': [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false },
      { input: '[7,6,4,3,1]', expectedOutput: '0', isHidden: false },
    ],
    'Valid Parentheses': [
      { input: '"()"', expectedOutput: 'true', isHidden: false },
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: '"(]"', expectedOutput: 'false', isHidden: false },
    ],
    'Trapping Rain Water': [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9', isHidden: false },
    ],
  }
  return testCases[title] || [
    { input: 'test1', expectedOutput: 'output1', isHidden: false },
    { input: 'test2', expectedOutput: 'output2', isHidden: false },
  ]
}

export async function POST(request) {
  const startTime = Date.now()
  let totalCreated = 0
  let totalErrors = 0
  const errors = []
  const created = []

  try {
    console.log('🌱 Starting challenge seeding process...')
    
    // Authenticate user
    const user = await requireHost(request)
    console.log('✅ User authenticated:', user.email)
    
    // Connect to database
    await connectDB()
    console.log('✅ Database connected')

    // Get count before deletion
    const existingCount = await Challenge.countDocuments({})
    console.log(`📊 Found ${existingCount} existing challenges`)
    
    // Clear existing challenges
    const deleteResult = await Challenge.deleteMany({})
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing challenges`)

    const languages = Object.keys(challengeTemplates)
    console.log(`📝 Processing ${languages.length} languages: ${languages.join(', ')}`)
    const existingSlugs = new Set()

    // Process each language
    for (const language of languages) {
      const templates = challengeTemplates[language]
      let languageCreated = 0
      let languageErrors = 0
      
      console.log(`\n🔹 Processing ${language} (${templates.length} challenges)...`)
      
      for (let i = 0; i < templates.length; i++) {
        try {
          const template = templates[i]
          const challengeNumber = i + 1
          
          // Generate slug
          const baseSlug = generateSlug(template.title)
          if (!baseSlug || baseSlug.trim() === '') {
            throw new Error(`Failed to generate slug for "${template.title}"`)
          }
          
          // Ensure slug is unique for this language
          let slug = baseSlug
          let counter = 1
          const languageSlugKey = `${language}:${slug}`
          
          while (existingSlugs.has(languageSlugKey)) {
            slug = `${baseSlug}-${counter}`
            const newKey = `${language}:${slug}`
            if (!existingSlugs.has(newKey)) {
              break
            }
            counter++
          }
          existingSlugs.add(`${language}:${slug}`)

          // Validate required fields
          if (!template.title || !template.difficulty || !template.points) {
            throw new Error(`Missing required fields: title=${!!template.title}, difficulty=${!!template.difficulty}, points=${!!template.points}`)
          }

          // Get challenge data
          const description = getDescription(template.title, challengeNumber)
          const examples = getExamples(template.title)
          const testCases = getTestCases(template.title)
          const starterCode = getStarterCode(language, challengeNumber)

          // Validate test cases
          if (!testCases || testCases.length === 0) {
            console.warn(`⚠️  Warning: No test cases for ${language} challenge "${template.title}"`)
          }

          // Prepare challenge data
          const challengeData = {
            title: template.title.trim(),
            description: description.trim(),
            difficulty: template.difficulty,
            language: language,
            challengeNumber: challengeNumber,
            slug: slug.toLowerCase().trim(),
            examples: examples || [],
            constraints: ['1 <= n <= 10^5'],
            starterCode: starterCode || '',
            testCases: testCases || [],
            points: template.points,
            isActive: true,
          }

          // Validate all required fields are present
          if (!challengeData.title || !challengeData.description || !challengeData.slug) {
            throw new Error(`Invalid challenge data: title=${!!challengeData.title}, description=${!!challengeData.description}, slug=${!!challengeData.slug}`)
          }

          // Create challenge
          const challenge = await Challenge.create(challengeData)

          totalCreated++
          languageCreated++
          created.push({
            language,
            number: challengeNumber,
            title: template.title,
            slug: slug,
          })

          console.log(`  ✅ Created ${language} challenge ${challengeNumber}: ${template.title} (slug: ${slug})`)
        } catch (error) {
          totalErrors++
          languageErrors++
          const errorMsg = `${language} challenge ${i + 1} (${templates[i]?.title || 'Unknown'}): ${error.message}`
          errors.push(errorMsg)
          console.error(`  ❌ Error: ${errorMsg}`)
          
          // Detailed error logging
          if (error.name === 'ValidationError') {
            console.error('    Validation errors:', JSON.stringify(error.errors, null, 2))
          } else if (error.code === 11000) {
            console.error('    Duplicate key error:', error.keyPattern, error.keyValue)
          } else {
            console.error('    Error details:', {
              name: error.name,
              message: error.message,
              code: error.code,
            })
          }
        }
      }

      console.log(`  📊 ${language}: ${languageCreated} created, ${languageErrors} errors`)
    }

    // Verify challenges were actually created in database
    const actualCount = await Challenge.countDocuments({})
    const countByLanguage = {}
    for (const lang of languages) {
      countByLanguage[lang] = await Challenge.countDocuments({ language: lang })
    }

    const duration = Date.now() - startTime
    const summary = {
      success: totalErrors === 0 && actualCount === totalCreated,
      totalCreated,
      actualCountInDB: actualCount,
      totalErrors,
      languagesProcessed: languages.length,
      challengesPerLanguage: challengeTemplates[languages[0]]?.length || 0,
      duration: `${(duration / 1000).toFixed(2)}s`,
      deleted: deleteResult.deletedCount,
      countByLanguage,
      created: created.slice(0, 10),
      errors: errors.slice(0, 20),
    }

    // Log verification
    console.log(`\n📊 Verification:`)
    console.log(`  Created: ${totalCreated}`)
    console.log(`  DB Count: ${actualCount}`)
    console.log(`  Errors: ${totalErrors}`)
    console.log(`  Duration: ${summary.duration}`)
    
    if (actualCount !== totalCreated) {
      console.warn(`⚠️  Warning: Mismatch between created count (${totalCreated}) and DB count (${actualCount})`)
    }

    if (totalErrors > 0) {
      console.warn(`\n⚠️  Seeding completed with ${totalErrors} errors`)
      return NextResponse.json({
        message: `Seeding completed with ${totalErrors} errors. ${totalCreated} challenges created successfully.`,
        ...summary,
      }, { status: 207 })
    }

    console.log(`\n🎉 Successfully created ${totalCreated} challenges in ${summary.duration}`)
    return NextResponse.json({
      message: `Successfully created ${totalCreated} challenges across ${languages.length} languages!`,
      ...summary,
    }, { status: 200 })
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error)
    
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden') || error.message.includes('Host access required')) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Host access required to seed challenges',
          details: error.message 
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to seed challenges',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        partialResults: {
          totalCreated,
          totalErrors,
          errors: errors.slice(0, 5),
        }
      },
      { status: 500 }
    )
  }
}
