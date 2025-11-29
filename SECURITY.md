# Security Documentation

## Security Features Implemented

### 1. Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds (default: 12)
- **Token Expiration**: Configurable expiration times
- **Role-Based Access**: Host/admin role checking
- **Secure Cookies**: HttpOnly, Secure, SameSite flags

### 2. Input Validation & Sanitization
- **Zod Schemas**: Type-safe validation for all inputs
- **Input Sanitization**: Removes dangerous characters and patterns
- **Code Sanitization**: Special handling for code submissions
- **XSS Prevention**: HTML escaping and CSP headers
- **SQL Injection Prevention**: Parameterized queries (when using database)

### 3. Rate Limiting
- **Request Rate Limiting**: 100 requests per minute per IP
- **Submission Rate Limiting**: 10 submissions per minute per user
- **Login Rate Limiting**: Prevents brute force attacks
- **Configurable Limits**: Environment variable based

### 4. Security Headers
- **Content Security Policy**: Restricts resource loading
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 5. Code Execution Security
- **Docker Isolation**: Code runs in isolated containers
- **Resource Limits**: CPU, memory, and timeout limits
- **Dangerous Pattern Detection**: Blocks system calls and file operations
- **Network Isolation**: Containers run in isolated network
- **Auto Cleanup**: Containers destroyed after execution

### 6. API Security
- **CORS Configuration**: Whitelist-based origin control
- **Authentication Middleware**: Protects all API routes
- **Error Handling**: No sensitive information in error messages
- **Request Validation**: All inputs validated before processing
- **HTTPS Enforcement**: Required in production

### 7. Data Protection
- **Password Security**: Never stored in plain text
- **Token Security**: Stored in httpOnly cookies
- **Sensitive Data**: Removed from API responses
- **Database Security**: Connection encryption (SSL)

### 8. Error Handling
- **Error Boundaries**: React error boundaries for UI
- **Error Logging**: Structured logging without sensitive data
- **User-Friendly Messages**: Generic error messages to users
- **Detailed Logs**: Detailed errors logged server-side only

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use strong, random secrets (minimum 32 characters)
- Rotate secrets regularly
- Use different secrets for different environments

### Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, and numbers
- Recommended: special characters
- Stored with bcrypt (12+ rounds)

### Token Management
- Short expiration times (7 days default)
- Refresh token rotation
- Secure storage (httpOnly cookies)
- Token revocation on logout

### Code Execution
- Always run in isolated containers
- Set strict resource limits
- Monitor execution logs
- Block dangerous operations
- Auto-cleanup containers

### Database
- Use parameterized queries
- Limit database user privileges
- Enable SSL connections
- Regular backups
- Monitor for suspicious activity

## Security Checklist for Production

- [ ] All environment variables set with strong values
- [ ] HTTPS/SSL enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled and tested
- [ ] Code execution service secured
- [ ] Database connections encrypted
- [ ] Error tracking configured
- [ ] Logging and monitoring set up
- [ ] Regular security updates scheduled
- [ ] Penetration testing completed
- [ ] Backup and recovery tested
- [ ] Incident response plan documented

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not create a public GitHub issue
2. Email security@yourdomain.com
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## Security Updates

- Keep all dependencies updated
- Monitor security advisories
- Regular security audits
- Automated dependency scanning
- Regular penetration testing

