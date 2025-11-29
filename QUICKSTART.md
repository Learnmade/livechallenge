# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Application

### As a Viewer:
1. Click **"Login"** button on the homepage
2. Navigate to **Dashboard** to see your profile
3. If a battle is active, click **"Join Battle"** or go to `/battle`
4. Write code in the editor and submit solutions
5. View your rank on the live leaderboard

### As a Host:
1. Click **"Host Login"** button on the homepage
2. Navigate to **Admin Panel** (`/admin`)
3. Click **"Create Battle"**
4. Fill in the problem details:
   - Battle Title
   - Difficulty (Easy/Medium/Hard)
   - Language
   - Duration (1-10 minutes)
   - Problem statement, examples, constraints
5. Click **"Start Battle"** to broadcast to all viewers
6. Monitor participants on the leaderboard
7. Click **"End Battle"** when finished

## Features to Test

- ✅ User authentication (demo mode)
- ✅ Battle creation and management
- ✅ Code editor with syntax highlighting
- ✅ Problem display with examples
- ✅ Code submission (simulated)
- ✅ Live leaderboard
- ✅ XP and reward system
- ✅ Battle history
- ✅ User dashboard

## Notes

- The app uses **demo mode** - no backend required for basic testing
- WebSocket connection is optional (app works without it)
- Code execution is simulated (70% success rate for demo)
- All data is stored in browser localStorage

## Next Steps

For production deployment:
1. Set up a backend API server
2. Configure WebSocket server (Socket.io)
3. Implement Docker-based code execution sandbox
4. Add database for persistent storage
5. Set up proper authentication system

