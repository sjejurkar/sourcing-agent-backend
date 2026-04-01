# Local Testing Guide

## Server Status

✅ **Server is running on http://localhost:3000**

## Quick Test

### 1. Test Call Initiation Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/calls/start \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{
    "vendor_name": "ABC Industrial Supply",
    "vendor_phone": "+12145551234",
    "part_number": "ABC-123",
    "quantity_needed": 50,
    "due_date": "2026-04-10"
  }'
```

**Expected Response (with placeholder credentials):**
```json
{
  "status": "error",
  "message": "Vapi API error: Request failed with status code 401",
  "code": "VAPI_API_ERROR"
}
```

This is **correct behavior** - it means the server is working, but you need real Vapi credentials.

### 2. Test EOCR Webhook Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/webhooks/vapi/eocr \
  -H "Content-Type: application/json" \
  -H "x-vapi-signature: test_signature" \
  -d '{
    "message": {
      "type": "end-of-call-report",
      "call": {"id": "test_call_123"},
      "transcript": "Test transcript",
      "analysis": {
        "vendor_contact_reached": true,
        "contact_name": "John Doe",
        "availability_status": "Available",
        "quantity_available": 50
      }
    }
  }'
```

## Setting Up Real Credentials

To test with real Vapi calls, update your `.env` file:

```bash
# Edit .env file
nano .env
```

Replace the placeholder values:

```env
# Get these from your Vapi dashboard at https://vapi.ai
VAPI_API_KEY=sk_live_xxxxx...
VAPI_ASSISTANT_ID=assistant_xxxxx...
VAPI_WEBHOOK_SECRET=whsec_xxxxx...

# Get this from Slack: https://api.slack.com/messaging/webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX

# Change this to a secure random string
API_KEY=generate_a_secure_random_key_here
```

After updating `.env`, the server will auto-reload (ts-node-dev watches for changes).

## Test Script

Use the provided test script:

```bash
./test-api.sh
```

## Manual Testing with Different Tools

### Using HTTPie (if installed)
```bash
http POST localhost:3000/api/v1/calls/start \
  x-api-key:your_secure_api_key_here \
  vendor_name="ABC Industrial Supply" \
  vendor_phone="+12145551234" \
  part_number="ABC-123" \
  quantity_needed:=50 \
  due_date="2026-04-10"
```

### Using Postman
1. Import the endpoint: `POST http://localhost:3000/api/v1/calls/start`
2. Add header: `x-api-key: your_secure_api_key_here`
3. Set body to JSON and paste the request payload

### Using VS Code REST Client
Create a file `test.http`:

```http
### Test Call Initiation
POST http://localhost:3000/api/v1/calls/start
Content-Type: application/json
x-api-key: your_secure_api_key_here

{
  "vendor_name": "ABC Industrial Supply",
  "vendor_phone": "+12145551234",
  "part_number": "ABC-123",
  "quantity_needed": 50,
  "due_date": "2026-04-10"
}

### Test EOCR Webhook
POST http://localhost:3000/api/v1/webhooks/vapi/eocr
Content-Type: application/json
x-vapi-signature: mock_signature

{
  "message": {
    "type": "end-of-call-report",
    "call": {"id": "call_123"}
  }
}
```

## Monitoring Logs

The server logs all requests with structured JSON logging. Watch the terminal where you ran `npm run dev` to see:

- Incoming requests with request IDs
- Vapi API calls
- EOCR processing
- Slack notifications
- Any errors with stack traces

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Next Steps

1. **Get Vapi Credentials**: Sign up at https://vapi.ai and create an assistant
2. **Set Up Slack Webhook**: Create an incoming webhook in your Slack workspace
3. **Configure .env**: Add real credentials to your `.env` file
4. **Test Real Calls**: Use the test script with real credentials
5. **Monitor Slack**: Check your Slack channel for call result notifications

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check for type errors
npm run typecheck
```

## API Documentation

### POST /api/v1/calls/start
- **Purpose**: Initiate a vendor call via Vapi
- **Auth**: Requires `x-api-key` header
- **Request**: See examples above
- **Response**: `{ status: "success", call_id: "REQ-2026-0001", message: "Call initiated" }`

### POST /api/v1/webhooks/vapi/eocr
- **Purpose**: Receive End-of-Call Reports from Vapi
- **Auth**: Validates `x-vapi-signature` header
- **Request**: Vapi webhook payload
- **Response**: `{ status: "success", message: "EOCR processed" }`
