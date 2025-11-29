# MongoDB Connection Guide

## Common Connection Errors

### Error: `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

This error means the MongoDB connection string is incorrect or incomplete. Here's how to fix it:

## Step-by-Step Fix

### 1. Get Your Correct Connection String from MongoDB Atlas

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com
2. **Go to your cluster** (or create one if you don't have one)
3. **Click "Connect"** button
4. **Choose "Connect your application"**
5. **Copy the connection string** - it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 2. Update Your Connection String

**Important**: Replace the placeholders:
- `<username>` - Your MongoDB Atlas database username
- `<password>` - Your MongoDB Atlas database password (URL-encode special characters)
- Add your database name after the `/` and before the `?`

**Correct Format:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/coding_battles?retryWrites=true&w=majority
```

### 3. Configure Network Access

1. In MongoDB Atlas, go to **Network Access**
2. Click **Add IP Address**
3. For development: Add `0.0.0.0/0` (allows all IPs) - **Only for testing!**
4. For production: Add your server's specific IP address

### 4. Verify Database User

1. Go to **Database Access** in MongoDB Atlas
2. Ensure your user has:
   - **Read and write** permissions
   - Correct username and password
   - If you changed the password, update it in your connection string

## Connection String Examples

### MongoDB Atlas (Cloud - Recommended)
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/coding_battles?retryWrites=true&w=majority
```

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/coding_battles
```

### MongoDB Atlas with Authentication Database
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/coding_battles?authSource=admin&retryWrites=true&w=majority
```

## Special Characters in Password

If your password contains special characters, you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `%` | `%25` |
| ` ` (space) | `%20` |

**Example:**
- Password: `my@pass:word`
- Encoded: `my%40pass%3Aword`
- Connection string: `mongodb+srv://user:my%40pass%3Aword@cluster0.abc123.mongodb.net/...`

## Testing Your Connection

### Option 1: Test in Node.js
Create a test file `test-connection.js`:

```javascript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
```

Run: `node test-connection.js`

### Option 2: Use MongoDB Compass
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Paste your connection string
3. Click "Connect"

## Troubleshooting

### Issue: "Authentication failed"
- **Solution**: Check username and password are correct
- Verify the user exists in Database Access
- Check if password needs URL encoding

### Issue: "IP not whitelisted"
- **Solution**: Add your IP to Network Access in MongoDB Atlas
- For development, temporarily use `0.0.0.0/0` (all IPs)

### Issue: "Connection timeout"
- **Solution**: Check your internet connection
- Verify firewall isn't blocking MongoDB ports
- Check MongoDB Atlas cluster is running

### Issue: "Invalid connection string format"
- **Solution**: Ensure the connection string starts with `mongodb://` or `mongodb+srv://`
- Check for typos in cluster name
- Verify all placeholders are replaced

## Quick Checklist

- [ ] Connection string copied from MongoDB Atlas "Connect your application"
- [ ] Username and password replaced (password URL-encoded if needed)
- [ ] Database name added to connection string
- [ ] IP address whitelisted in Network Access
- [ ] Database user has read/write permissions
- [ ] Connection string saved in `.env.local` (not committed to git)
- [ ] Restarted development server after updating `.env.local`

## Example .env.local

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/coding_battles?retryWrites=true&w=majority

# Other environment variables...
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

## Still Having Issues?

1. **Double-check the connection string** - Copy it fresh from MongoDB Atlas
2. **Test with MongoDB Compass** - If Compass works, the connection string is correct
3. **Check MongoDB Atlas status** - Ensure your cluster is running
4. **Review error messages** - The error message usually indicates what's wrong
5. **Check network connectivity** - Ensure you can reach MongoDB Atlas servers

