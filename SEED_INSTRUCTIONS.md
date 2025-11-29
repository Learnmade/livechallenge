# How to Seed Challenges

## Quick Start

### Option 1: Using Admin Panel (Recommended)

1. **Login as Host/Admin**
   - Register a new account or login
   - Make sure your account has `isHost: true` in the database

2. **Navigate to Admin Panel**
   - Go to `/admin` in your browser
   - You should see a "Challenge Database" section

3. **Click "Seed Challenges" Button**
   - Click the green "Seed Challenges" button
   - Wait for the success message
   - This will create **80 challenges** (10 per language × 8 languages)

### Option 2: Using API Endpoint (If Database is Empty)

If your database is empty, you can use the public endpoint:

```bash
curl -X POST http://localhost:3000/api/seed-challenges
```

This will only work if no challenges exist in the database.

### Option 3: Using Admin API Endpoint

If you're logged in as a host/admin:

```bash
curl -X POST http://localhost:3000/api/admin/seed-challenges \
  -H "Content-Type: application/json" \
  -b "auth_token=your_auth_token"
```

## What Gets Created

### Languages (8 total)
- JavaScript
- Python
- Java
- C++
- Go
- Rust
- C#
- TypeScript

### Challenges Per Language (10 each)

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

**Total: 80 challenges**

## Verify Challenges Were Created

Visit: `http://localhost:3000/api/challenges/check`

This will show:
- Total number of challenges
- Count by language
- Status message

## Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- For admin endpoint, ensure your account has `isHost: true`

### Challenges Not Showing
1. Check MongoDB connection
2. Verify challenges exist: `/api/challenges/check`
3. Check browser console for errors
4. Ensure you're logged in when viewing `/challenges`

### Database Connection Issues
- Check `.env.local` has correct `MONGODB_URI`
- See `MONGODB_CONNECTION_GUIDE.md` for help

## After Seeding

Once challenges are seeded:
- ✅ Users can browse challenges by language
- ✅ Each challenge is numbered 1-10
- ✅ Challenges are immediately available for solving
- ✅ Leaderboards will track submissions
- ✅ Users can review code from leaderboard

