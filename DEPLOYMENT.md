# Production Deployment Guide

## Security Checklist

### Environment Variables
- [ ] Set strong `JWT_SECRET` (minimum 32 characters, random)
- [ ] Set `JWT_REFRESH_SECRET` (different from JWT_SECRET)
- [ ] Configure `DATABASE_URL` with secure credentials
- [ ] Set `ALLOWED_ORIGINS` for CORS
- [ ] Configure `CODE_EXECUTION_SERVICE_URL`
- [ ] Set `SESSION_SECRET` for session management
- [ ] Configure email service credentials (if using)

### Security Configuration
- [ ] Enable HTTPS/SSL in production
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Configure rate limiting thresholds
- [ ] Set up firewall rules
- [ ] Enable DDoS protection
- [ ] Configure CORS properly
- [ ] Set up Content Security Policy

### Database Security
- [ ] Use connection pooling
- [ ] Enable SSL for database connections
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Set up database backups
- [ ] Configure database user with minimal privileges
- [ ] Enable database logging and monitoring

### Code Execution Security
- [ ] Set up isolated Docker network
- [ ] Configure resource limits (CPU, memory, timeout)
- [ ] Implement code sanitization
- [ ] Block dangerous system calls
- [ ] Set up container auto-cleanup
- [ ] Monitor execution logs
- [ ] Implement execution queue

### Authentication & Authorization
- [ ] Implement proper password hashing (bcrypt, 12+ rounds)
- [ ] Set up JWT token expiration
- [ ] Implement refresh token rotation
- [ ] Add rate limiting to auth endpoints
- [ ] Enable email verification (optional)
- [ ] Implement 2FA (optional)
- [ ] Set up session management

### Monitoring & Logging
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure application logging
- [ ] Set up performance monitoring
- [ ] Enable security event logging
- [ ] Configure alerting for critical errors
- [ ] Set up uptime monitoring

## Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Set Environment Variables
Create `.env.production` with all required variables (see `.env.local.example`)

### 3. Database Setup
- Create production database
- Run migrations (if using ORM)
- Set up connection pooling
- Configure backups

### 4. Code Execution Service
- Set up Docker daemon
- Configure isolated network
- Set resource limits
- Test execution service

### 5. WebSocket Server
- Deploy Socket.io server
- Configure authentication
- Set up rate limiting
- Test real-time features

### 6. Reverse Proxy (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 7. Process Manager (PM2)
```bash
npm install -g pm2
pm2 start npm --name "coding-battles" -- start
pm2 save
pm2 startup
```

### 8. SSL Certificate
Use Let's Encrypt or your preferred CA:
```bash
certbot --nginx -d yourdomain.com
```

## Performance Optimization

- Enable Next.js production optimizations
- Set up CDN for static assets
- Configure caching headers
- Optimize images
- Enable compression (gzip/brotli)
- Set up database indexes
- Configure Redis for caching
- Implement connection pooling

## Backup Strategy

- Database: Daily automated backups
- Code: Version control (Git)
- Environment: Secure secret management
- Logs: Centralized logging service

## Monitoring

- Application performance (APM)
- Error tracking and alerting
- Uptime monitoring
- Security event monitoring
- Resource usage (CPU, memory, disk)

## Security Updates

- Keep dependencies updated
- Monitor security advisories
- Regular security audits
- Penetration testing
- Update Node.js regularly

