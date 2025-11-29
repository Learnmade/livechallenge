# 🛡️ Community Coding Battles

A Real-Time Competitive Coding Feature for Learnmade Live Streams

**Production URL:** https://challenge.learn-made.in

## 🎯 Overview

Community Coding Battles is an interactive, real-time competitive coding platform designed to be integrated into live coding streams. Viewers participate in fast coding challenges, compete to solve problems before others, and earn points, badges, and leaderboard ranks.

## ✨ Features

- **Live Problem Broadcast** - Real-time coding challenges during live streams
- **Online Code Editor** - Built-in Monaco editor with syntax highlighting for JavaScript, Python, C++, and Java
- **Real-Time Code Execution** - Submit and test code instantly
- **Live Leaderboard** - See rankings update in real-time
- **Reward System** - Earn XP based on performance (🥇 200 XP, 🥈 150 XP, 🥉 100 XP)
- **Battle History** - Review past battles and solutions
- **Host Control Panel** - Admin panel to create and manage battles

## 🏗️ Tech Stack

- **Next.js 14** - React framework with App Router
- **JavaScript** - Programming language
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Database with Mongoose ODM
- **Monaco Editor** - VS Code editor component
- **Socket.io Client** - Real-time WebSocket communication
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Security & Production
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Input validation and sanitization
- **Rate Limiting** - Protection against abuse
- **Helmet** - Security headers
- **Error Boundaries** - Error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd challenge-learnmade
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong random secret (min 32 chars)
- `NEXT_PUBLIC_APP_URL` - https://challenge.learn-made.in
- Other configuration as needed

4. Set up MongoDB:
   - See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed instructions
   - Local: `mongodb://localhost:27017/coding_battles`
   - Atlas: Get connection string from MongoDB Atlas

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
challenge-learnmade/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── battles/      # Battle management endpoints
│   ├── admin/            # Host control panel
│   ├── battle/           # Active battle page
│   ├── dashboard/        # User dashboard
│   ├── history/          # Battle history
│   ├── login/            # Login/Registration
│   └── page.js           # Home page
├── components/
│   ├── CodeEditor.js     # Monaco code editor
│   ├── Leaderboard.js    # Live leaderboard
│   ├── ProblemDisplay.js # Problem statement
│   └── ErrorBoundary.js  # Error handling
├── lib/
│   ├── mongodb.js        # MongoDB connection
│   ├── db.js             # Database operations
│   ├── auth.js           # Authentication helpers
│   ├── security.js       # Security utilities
│   ├── validation.js     # Input validation
│   └── codeExecution.js  # Code execution service
├── models/
│   ├── User.js           # User model
│   ├── Battle.js         # Battle model
│   ├── Submission.js     # Submission model
│   └── Leaderboard.js    # Leaderboard model
└── server/
    └── websocket-server.js # WebSocket server guide
```

## 🎮 Usage

### For Viewers

1. **Register/Login** - Create an account or sign in
2. **Join Battle** - When a battle starts, click "Join Battle"
3. **Solve Problem** - Read the problem, write code in the editor
4. **Submit** - Click "Submit Solution" to test your code
5. **Compete** - See your rank on the live leaderboard

### For Hosts

1. **Access Admin Panel** - Login as host and navigate to Admin Panel
2. **Create Battle** - Fill in problem details, difficulty, duration
3. **Start Battle** - Click "Start Battle" to broadcast to all viewers
4. **Monitor** - Watch participants compete in real-time
5. **End Battle** - End the battle when time expires

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting (requests and submissions)
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ XSS and CSRF protection
- ✅ Secure code execution (Docker isolation)
- ✅ Error boundaries and logging
- ✅ Role-based access control

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## 🗄️ Database

The application uses MongoDB with Mongoose ODM. See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for setup instructions.

### Collections
- **users** - User accounts and profiles
- **battles** - Coding battle challenges
- **submissions** - Code submissions and results
- **leaderboards** - Battle leaderboard entries

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

### Quick Deploy Checklist
- [ ] Set up MongoDB (Atlas recommended)
- [ ] Configure environment variables
- [ ] Set up SSL/HTTPS
- [ ] Configure domain: challenge.learn-made.in
- [ ] Set up WebSocket server
- [ ] Configure code execution service
- [ ] Set up monitoring and logging

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Battles
- `GET /api/battles/active` - Get active battle
- `GET /api/battles/[id]` - Get battle by ID
- `POST /api/battles/create` - Create battle (host only)
- `POST /api/battles/submit` - Submit solution

### Leaderboard
- `GET /api/leaderboard/[battleId]` - Get battle leaderboard

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] AI problem generation
- [ ] Advanced analytics dashboard
- [ ] Badge and achievement system
- [ ] Season leaderboards
- [ ] Team battles
- [ ] Code review and discussion

## 🤝 Contributing

This is a project for Learnmade Live Streams. Contributions and suggestions are welcome!

## 📄 License

Private project for Learnmade

---

Built with ❤️ for the coding community

**Production:** https://challenge.learn-made.in
