# Production Configuration for challenge.learn-made.in

## Environment Variables

Create `.env.local` with the following configuration:

```env
# Application URLs
NEXT_PUBLIC_APP_URL=https://challenge.learn-made.in
NEXT_PUBLIC_SOCKET_URL=wss://challenge.learn-made.in

# MongoDB Configuration
# For MongoDB Atlas (Recommended):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coding_battles?retryWrites=true&w=majority

# For Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/coding_battles

# JWT Secrets (Generate strong random strings, min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-change-this-in-production
ALLOWED_ORIGINS=https://challenge.learn-made.in

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SUBMISSION_MAX=10

# Code Execution Service
CODE_EXECUTION_SERVICE_URL=http://localhost:3002
CODE_EXECUTION_TIMEOUT=5000
CODE_EXECUTION_MEMORY_LIMIT=128
CODE_EXECUTION_CPU_LIMIT=1

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Domain Configuration

### DNS Settings
- **A Record**: `challenge.learn-made.in` → Your server IP
- **CNAME**: `www.challenge.learn-made.in` → `challenge.learn-made.in` (optional)

### SSL Certificate
Use Let's Encrypt or your preferred CA:
```bash
certbot --nginx -d challenge.learn-made.in
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name challenge.learn-made.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name challenge.learn-made.in;

    ssl_certificate /etc/letsencrypt/live/challenge.learn-made.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/challenge.learn-made.in/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket for Socket.io
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create M0 (Free) or M10+ cluster
   - Choose region closest to your server

2. **Database Access**
   - Create database user
   - Set strong password
   - Grant read/write access

3. **Network Access**
   - Add your server IP address
   - Or add `0.0.0.0/0` for testing (not recommended for production)

4. **Connection String**
   - Get connection string from Atlas
   - Replace `<password>` and `<dbname>`
   - Use in `MONGODB_URI`

## Deployment Steps

1. **Build Application**
   ```bash
   npm install
   npm run build
   ```

2. **Set Environment Variables**
   - Create `.env.local` with production values
   - Never commit `.env.local` to git

3. **Start Application**
   ```bash
   # Using PM2
   pm2 start npm --name "coding-battles" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   - Update nginx config
   - Test: `nginx -t`
   - Reload: `systemctl reload nginx`

5. **Set up SSL**
   ```bash
   certbot --nginx -d challenge.learn-made.in
   ```

6. **Verify Deployment**
   - Visit https://challenge.learn-made.in
   - Check SSL certificate
   - Test authentication
   - Test battle creation

## Monitoring

### Application Monitoring
- Set up PM2 monitoring: `pm2 monit`
- Configure log rotation
- Set up error tracking (Sentry, etc.)

### Database Monitoring
- Monitor MongoDB Atlas dashboard
- Set up alerts for:
  - High connection count
  - Slow queries
  - Storage usage
  - Replication lag

### Server Monitoring
- CPU usage
- Memory usage
- Disk space
- Network traffic

## Backup Strategy

### MongoDB Backups
- MongoDB Atlas: Automatic backups enabled
- Local MongoDB: Daily automated backups
  ```bash
  # Backup script
  mongodump --uri="$MONGODB_URI" --out=/backup/$(date +%Y%m%d)
  ```

### Application Backups
- Code: Git repository
- Environment: Secure secret management
- Database: Regular MongoDB backups

## Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS/SSL enabled
- [ ] MongoDB authentication enabled
- [ ] IP whitelist configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Error tracking set up
- [ ] Logging configured
- [ ] Backups automated
- [ ] Monitoring alerts configured

## Troubleshooting

### Connection Issues
- Check MongoDB connection string
- Verify network access in Atlas
- Check firewall rules

### SSL Issues
- Verify certificate is valid
- Check certificate expiration
- Renew if needed: `certbot renew`

### Performance Issues
- Check MongoDB indexes
- Monitor query performance
- Optimize database queries
- Scale resources if needed

