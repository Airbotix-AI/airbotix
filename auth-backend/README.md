# OTP-based Passwordless Authentication Backend

A secure, production-ready Node.js backend implementing OTP-based passwordless authentication with email verification.

## 🚀 Features

- **OTP Authentication**: 6-digit verification codes with configurable expiry
- **JWT Tokens**: Access/refresh token pair with automatic refresh
- **Dual Auth Methods**: Support for both Bearer tokens and HTTP-only cookies
- **Rate Limiting**: Protection against brute force attacks
- **Email Adapters**: Support for SendGrid, SMTP, and Mock providers
- **Security First**: Bcrypt hashing, secure token generation, input validation
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Logging**: Structured logging with Winston
- **Testing Ready**: Jest/Vitest setup with mock implementations

## 📋 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/request-otp` | Request OTP for email | No |
| POST | `/auth/verify-otp` | Verify OTP and login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout and revoke tokens | No |
| GET | `/auth/me` | Get current user profile | Yes |
| GET | `/health` | Health check | No |

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd auth-backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file with your settings:

```bash
# App Configuration
NODE_ENV=development
PORT=3000
APP_BASE_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OTP Configuration
OTP_LENGTH=6
OTP_TTL_MIN=10
OTP_MAX_VERIFY_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SEC=60

# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
EMAIL_PROVIDER=mock  # sendgrid | smtp | mock

# For SendGrid (if EMAIL_PROVIDER=sendgrid)
EMAIL_API_KEY=your-sendgrid-api-key

# For SMTP (if EMAIL_PROVIDER=smtp)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Cookie Configuration
COOKIE_SECURE=false  # Set to true in production with HTTPS
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=lax

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build and start
npm run build
npm run start

# Production mode
npm run start:prod
```

## 🔐 Authentication Methods

The API supports two authentication methods:

### Method 1: Bearer Token (Default)

**Request OTP:**
```bash
curl -X POST http://localhost:3000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "code": "123456"}'
```

Response includes tokens:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "lastLoginAt": "2024-01-01T12:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

**Access Protected Routes:**
```bash
curl -H "Authorization: Bearer <accessToken>" \
  http://localhost:3000/auth/me
```

### Method 2: Cookie-based Authentication

**Switch to Cookie Mode:**
Add header `X-Auth-Method: cookie` or query param `?authMethod=cookie` to login requests.

**Verify OTP (Cookie Mode):**
```bash
curl -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -H "X-Auth-Method: cookie" \
  -d '{"email": "user@example.com", "code": "123456"}' \
  -c cookies.txt
```

**Access Protected Routes (Cookie Mode):**
```bash
curl -b cookies.txt http://localhost:3000/auth/me
```

## 📧 Email Provider Configuration

### Using Mock Provider (Development)
```bash
EMAIL_PROVIDER=mock
```
- No additional configuration needed
- OTP codes are logged to console
- Perfect for development and testing

### Using SendGrid
```bash
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
```

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify your sender email address

### Using SMTP
```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start development server with auto-reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Project Structure

```
src/
├── config/         # Environment configuration
├── types/          # TypeScript interfaces
├── validators/     # Request validation schemas
├── adapters/       # Email adapter implementations
├── repositories/   # Data access layer (abstract)
├── services/       # Business logic services
├── controllers/    # HTTP request handlers
├── middleware/     # Express middleware
├── routes/         # API route definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── index.ts        # Server entry point
```

## 🧪 Testing

### Run Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run with coverage report
```

### Test Structure

```bash
tests/
├── unit/           # Unit tests for services
├── integration/    # API integration tests
└── helpers/        # Test utilities
```

### Example Test

```typescript
describe('OTP Authentication', () => {
  it('should send OTP and authenticate user', async () => {
    // Request OTP
    const otpResponse = await request(app)
      .post('/auth/request-otp')
      .send({ email: 'test@example.com' })
      .expect(200);

    // Get OTP from mock adapter
    const sentEmails = MockAdapter.getSentEmails();
    const otpCode = extractOtpFromEmail(sentEmails[0].html);

    // Verify OTP
    const authResponse = await request(app)
      .post('/auth/verify-otp')
      .send({ email: 'test@example.com', code: otpCode })
      .expect(200);

    expect(authResponse.body.data.tokens).toBeDefined();
  });
});
```

## 🔒 Security Features

- **Rate Limiting**: Prevents brute force attacks
- **OTP Security**: Hashed storage, expiry, attempt limits
- **JWT Security**: Secure token generation, short-lived access tokens
- **Input Validation**: Comprehensive request validation with Joi
- **Error Handling**: Secure error messages without information leakage
- **Cookie Security**: HTTP-only, secure, SameSite protection
- **Password Hashing**: Bcrypt with high salt rounds
- **CORS Protection**: Configurable origin policies

## 🚀 Production Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
JWT_SECRET=<64-character-random-string>
EMAIL_PROVIDER=sendgrid  # or smtp
EMAIL_API_KEY=<your-sendgrid-key>
COOKIE_SECURE=true  # Enable for HTTPS
APP_BASE_URL=https://yourdomain.com
```

### Security Checklist

- [ ] Change `JWT_SECRET` to a secure random string (64+ characters)
- [ ] Set `COOKIE_SECURE=true` when using HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up proper SSL/TLS certificates
- [ ] Enable logging and monitoring
- [ ] Set up database persistence (replace memory repositories)
- [ ] Configure reverse proxy (nginx, Apache)
- [ ] Set up rate limiting at infrastructure level
- [ ] Enable security headers (already included with Helmet)

## 🐛 Troubleshooting

### Common Issues

**1. JWT_SECRET not set**
```
Error: Missing required environment variable: JWT_SECRET
```
Solution: Add `JWT_SECRET` to your `.env` file.

**2. Email not sending (SendGrid)**
```
Failed to send email via SendGrid
```
Solution: Check your SendGrid API key and verify sender email.

**3. SMTP authentication failed**
```
Failed to send email via SMTP
```
Solution: Verify SMTP credentials and enable "Less secure app access" or use App Password.

**4. Rate limit exceeded**
```json
{"error": {"code": "RATE_LIMIT_EXCEEDED"}}
```
Solution: Wait for rate limit window to reset or increase limits in config.

### Debug Mode

Enable debug logging:
```bash
NODE_ENV=development npm run dev
```

This will show detailed logs including:
- OTP codes (in mock mode)
- Rate limiting details
- Email sending attempts
- Authentication flows

## 📝 API Examples

### Complete Authentication Flow

```javascript
// 1. Request OTP
const otpResponse = await fetch('/auth/request-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// 2. User enters OTP from email, verify it
const authResponse = await fetch('/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    code: '123456'
  })
});

const { tokens } = authResponse.data;

// 3. Use access token for protected routes
const profileResponse = await fetch('/auth/me', {
  headers: {
    'Authorization': `Bearer ${tokens.accessToken}`
  }
});

// 4. Refresh token when access token expires
const refreshResponse = await fetch('/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refreshToken: tokens.refreshToken
  })
});
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the test files for usage examples