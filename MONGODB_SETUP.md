# MongoDB Setup Guide

## Local MongoDB Setup

### 1. Install MongoDB

**Windows:**
- Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Connection String

For local development:
```
MONGODB_URI=mongodb://localhost:27017/coding_battles
```

## MongoDB Atlas Setup (Cloud)

### 1. Create Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free account

### 2. Create Cluster
- Click "Build a Database"
- Choose FREE tier (M0)
- Select cloud provider and region
- Create cluster

### 3. Configure Database Access
- Go to "Database Access"
- Add new database user
- Set username and password
- Save credentials securely

### 4. Configure Network Access
- Go to "Network Access"
- Add IP Address
- For production: Add your server IP
- For development: Add `0.0.0.0/0` (all IPs) - **Only for testing**

### 5. Get Connection String
- Go to "Database" → "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with `coding_battles`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coding_battles?retryWrites=true&w=majority
```

## Environment Configuration

Add to `.env.local`:
```env
MONGODB_URI=your_connection_string_here
```

## Database Collections

The application will automatically create these collections:

1. **users** - User accounts and profiles
2. **battles** - Coding battle challenges
3. **submissions** - Code submissions and results
4. **leaderboards** - Battle leaderboard entries

## Indexes

The following indexes are automatically created for performance:

### Users Collection
- `email` (unique)
- `xp` (for leaderboard queries)

### Battles Collection
- `status`
- `hostId`
- `createdAt`

### Submissions Collection
- `battleId` + `userId` (compound)
- `battleId` + `status` + `time` (for leaderboard)
- `userId` + `createdAt` (for user history)

### Leaderboards Collection
- `battleId` + `status` + `time`
- `battleId` + `userId` (unique)

## Testing Connection

Create a test file `test-db.js`:

```javascript
import connectDB from './lib/mongodb.js'
import User from './models/User.js'

async function test() {
  try {
    await connectDB()
    console.log('✅ MongoDB connected successfully')
    
    const userCount = await User.countDocuments()
    console.log(`Users in database: ${userCount}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  }
  process.exit(0)
}

test()
```

Run: `node test-db.js`

## Production Checklist

- [ ] Use MongoDB Atlas or managed MongoDB service
- [ ] Enable authentication
- [ ] Configure IP whitelist
- [ ] Enable SSL/TLS connections
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Use connection string with SSL
- [ ] Set up database indexes
- [ ] Configure read/write concerns
- [ ] Set up database user with minimal privileges

## Backup Strategy

### MongoDB Atlas
- Automatic backups enabled by default
- Point-in-time recovery available

### Local MongoDB
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/coding_battles" --out=/backup

# Restore
mongorestore --uri="mongodb://localhost:27017/coding_battles" /backup/coding_battles
```

## Monitoring

Monitor your MongoDB instance:
- Connection count
- Query performance
- Index usage
- Storage usage
- Replication lag (if using replica set)

## Troubleshooting

### Connection Timeout
- Check network access settings
- Verify connection string
- Check firewall rules

### Authentication Failed
- Verify username and password
- Check database user permissions
- Ensure special characters are URL-encoded

### Slow Queries
- Check indexes are created
- Use `explain()` to analyze queries
- Consider adding compound indexes

