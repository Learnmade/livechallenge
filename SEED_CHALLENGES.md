# Seeding Challenges

## How to Seed Challenges

### Option 1: Using Admin Panel (Recommended)

1. **Login as Host**
   - Login with a host account
   - Navigate to `/admin`

2. **Click "Seed Challenges" Button**
   - In the Admin Panel, you'll see a "Challenge Database" section
   - Click the green "Seed Challenges" button
   - Wait for the success message

This will create **80 challenges total** (10 challenges × 8 languages):
- JavaScript (10 challenges)
- Python (10 challenges)
- Java (10 challenges)
- C++ (10 challenges)
- Go (10 challenges)
- Rust (10 challenges)
- C# (10 challenges)
- TypeScript (10 challenges)

### Option 2: Using API Endpoint

If you prefer to use the API directly:

```bash
curl -X POST http://localhost:3000/api/admin/seed-challenges \
  -H "Content-Type: application/json" \
  -b "auth_token=your_token_here"
```

## Challenge List

Each language has the following 10 challenges:

1. **Two Sum** (Easy, 100 points)
2. **Reverse String** (Easy, 100 points)
3. **Valid Palindrome** (Easy, 100 points)
4. **Longest Substring** (Medium, 150 points)
5. **Container With Most Water** (Medium, 150 points)
6. **Three Sum** (Medium, 150 points)
7. **Merge Intervals** (Medium, 150 points)
8. **Best Time to Buy and Sell Stock** (Easy, 100 points)
9. **Valid Parentheses** (Easy, 100 points)
10. **Trapping Rain Water** (Hard, 200 points)

## What Gets Created

For each challenge:
- ✅ Title and description
- ✅ Difficulty level (easy/medium/hard)
- ✅ Points value
- ✅ Examples with input/output
- ✅ Constraints
- ✅ Starter code (language-specific)
- ✅ Test cases for validation
- ✅ Challenge number (1-10)

## After Seeding

Once challenges are seeded:
1. Users can browse challenges by language
2. Each challenge is numbered 1-10
3. Challenges are immediately available for solving
4. Leaderboards will track submissions
5. Users can review code from leaderboard

## Notes

- Seeding will **clear all existing challenges** before creating new ones
- Only host/admin users can seed challenges
- Challenges are created as active by default
- Test cases are included for automatic validation

