# API Key Authentication Setup

## ✅ Changes Made

Vapi webhook signature validation has been **removed**. All endpoints now use a **single API_KEY** for authentication.

### Files Modified

1. **[webhooks.controller.ts](src/api/controllers/webhooks.controller.ts)** - Removed signature validation logic
2. **[config.schema.ts](src/modules/config/config.schema.ts)** - Removed `VAPI_WEBHOOK_SECRET` requirement
3. **[config.ts](src/modules/config/config.ts)** - Removed `webhookSecret` from config
4. **[config.types.ts](src/modules/config/config.types.ts)** - Removed `webhookSecret` from types
5. **[.env](.env)** - Removed `VAPI_WEBHOOK_SECRET` variable
6. **[.env.example](.env.example)** - Removed `VAPI_WEBHOOK_SECRET` variable
7. **[test-api.sh](test-api.sh)** - Updated to use `x-api-key` instead of `x-vapi-signature`

## 🔒 Authentication Summary

| Endpoint | Authentication | Header |
|----------|---------------|--------|
| `/api/v1/calls/start` | ✅ API_KEY | `x-api-key` |
| `/api/v1/webhooks/vapi/eocr` | ✅ API_KEY | `x-api-key` |

## ⚙️ Configuration Steps

### 1. Generate a Secure API Key

```bash
# macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Update Your `.env` File

```env
# Authentication - Used by ALL endpoints
API_KEY=<your_generated_key_here>
```

### 3. Configure Vapi to Send API Key

In your **Vapi Dashboard**, when configuring webhooks:

#### Webhook URL
```
https://your-domain.com/api/v1/webhooks/vapi/eocr
```

#### Custom Headers
Add a custom header:
```
x-api-key: <your_generated_key_here>
```

**Example Configuration in Vapi:**
```json
{
  "url": "https://your-domain.com/api/v1/webhooks/vapi/eocr",
  "headers": {
    "x-api-key": "your_generated_key_here"
  }
}
```

## 🧪 Testing

### Test with curl

```bash
# Test call initiation
curl -X POST http://localhost:3000/api/v1/calls/start \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{
    "vendor_name": "Test Vendor",
    "vendor_phone": "+12145551234",
    "part_number": "TEST-123",
    "quantity_needed": 10,
    "due_date": "2026-04-10"
  }'

# Test webhook endpoint
curl -X POST http://localhost:3000/api/v1/webhooks/vapi/eocr \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{"message": {"type": "end-of-call-report", "call": {"id": "test_123"}}}'
```

### Test with script

```bash
./test-api.sh
```

## 🔐 Security Best Practices

1. **Use a strong random key** - At least 32 bytes of random data
2. **Keep it secret** - Never commit the actual API key to Git
3. **Rotate regularly** - Change the API key periodically
4. **Use HTTPS in production** - Always use TLS/SSL to encrypt the API key in transit
5. **Environment-specific keys** - Use different keys for dev, staging, and production

## 🚀 Deployment

When deploying to production:

1. Set the `API_KEY` environment variable in your hosting platform (Vercel, Azure, etc.)
2. Configure Vapi webhook with the production URL and API key
3. Ensure HTTPS is enabled
4. Test the webhook endpoint before going live

## 📋 Environment Variables Reference

Required variables in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Vapi
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_API_BASE_URL=https://api.vapi.ai

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Authentication (IMPORTANT!)
API_KEY=your_secure_random_key

# Logging
LOG_LEVEL=info
LOG_PRETTY=true
```

## 🆘 Troubleshooting

### Webhook returns 401 Unauthorized

**Cause**: Vapi is not sending the correct API key

**Solution**:
1. Check that you configured the `x-api-key` header in Vapi's webhook settings
2. Verify the API key matches exactly (no extra spaces or quotes)
3. Check server logs to see what key was received

### Calls endpoint returns 401

**Cause**: Missing or incorrect API key in request

**Solution**: Add the `x-api-key` header with your API key to all requests

## 📚 Additional Resources

- [Express.js Authentication Guide](https://expressjs.com/en/advanced/best-practice-security.html)
- [Vapi Webhook Documentation](https://docs.vapi.ai)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)
