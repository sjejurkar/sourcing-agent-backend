# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vapi Voice Assistant Integration Backend** that serves as a stateless integration layer between Vapi's voice calling service and internal systems. The backend:

- Triggers vendor calls via Vapi API to check part availability
- Receives End-Of-Call Reports (EOCR) via webhooks
- Extracts structured data from call outcomes
- Sends formatted notifications to Slack

**Phase 1 Scope**: Stateless design with no database - logging serves as the primary audit trail.

## Development Commands

### Initial Setup
```bash
# Initialize the Node.js project
npm init -y

# Install core dependencies
npm install express zod axios pino pino-pretty dotenv

# Install dev dependencies
npm install -D typescript @types/node @types/express ts-node-dev
```

### Common Commands
```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run tests for a specific file
npm test -- path/to/test-file.test.ts

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod
```

## Architecture

### Layered Design

```
Client Request
    ↓
API Layer (REST endpoints)
    ↓
Service Layer (Business logic)
    ↓
Integration Modules
    ↓
External Services (Vapi, Slack)
```

### Core Modules

The system is organized into discrete modules with clear responsibilities:

- **API Layer**: REST endpoints (`/api/v1/calls/start`, `/api/v1/webhooks/vapi/eocr`)
- **Service Layer**: Orchestrates business logic and coordinates between modules
- **Vapi Integration Module**: Handles API calls to Vapi for initiating calls
- **EOCR Parser Module**: Extracts structured data from End-Of-Call Report JSON
- **Slack Module**: Formats and sends notifications to Slack webhooks
- **Logging Module**: Structured logging with request correlation
- **Config Module**: Environment-based configuration management

### Stateless Philosophy

**Phase 1 is intentionally stateless**:
- No database or persistent storage
- Information flows as: request → process → output
- Comprehensive logging provides audit trail
- Architecture is modular to support database addition in Phase 2 without major refactoring

## API Endpoints

### POST /api/v1/calls/start

Triggers a vendor call via Vapi.

**Request:**
```json
{
  "vendor_name": "ABC Industrial Supply",
  "vendor_phone": "+12145551234",
  "part_number": "ABC-123",
  "quantity_needed": 50,
  "due_date": "2026-04-10"
}
```

**Response:**
```json
{
  "status": "success",
  "call_id": "REQ-2026-0001",
  "message": "Call initiated"
}
```

### POST /api/v1/webhooks/vapi/eocr

Receives End-Of-Call Reports from Vapi.

**Processing flow**:
1. Validate webhook signature
2. Extract structured fields from EOCR JSON
3. Format and send Slack notification
4. Return HTTP 200 to Vapi

## Key Implementation Details

### Request Correlation

- Each request generates a unique ID with format: `REQ-YYYY-NNNN`
- This ID flows through: internal logs → Vapi API calls → EOCR webhook → Slack notifications
- Enables tracing requests across the entire system

### Webhook Security

- **Always validate Vapi webhook signatures** before processing EOCR
- Reject requests with invalid signatures (return 401)
- Prevents unauthorized EOCR manipulation

### EOCR Data Extraction

Extract these structured fields from EOCR JSON:
- `vendor_contact_reached` (boolean)
- `contact_name` (string)
- `availability_status` (enum: Available, Not Available, Partial)
- `quantity_available` (number)
- `delivery_date` (date)
- `substitute_part_number` (string) - optional
- `substitute_availability` (boolean) - optional
- `substitute_delivery_date` (date) - optional

**Handle partial data gracefully**: Send Slack notifications even with incomplete data rather than failing.

### Error Handling Strategy

Different error scenarios require different responses:

- **Vapi API failure**: Return error to client immediately
- **EOCR parsing failure**: Log error AND send Slack alert
- **Slack webhook failure**: Log error but don't fail the main flow (return 200 to Vapi)
- **Invalid webhook signature**: Reject with 401 security error
- **Missing fields**: Send Slack message with partial data

### Logging Requirements

Since there's no database, comprehensive logging is critical:

- Log all incoming requests with payloads
- Log all Vapi API requests and responses
- Log EOCR webhook reception
- Log extracted structured data
- Log Slack message sending
- Log all errors with full stack traces
- Include `request_id` in all log entries for correlation

Use structured logging (Pino recommended) for easier parsing and analysis.

## Integration Points

### Vapi API

- **Purpose**: Trigger phone calls to vendors
- **Authentication**: API key in headers
- **Inputs**: vendor_name, phone, part_number, quantity, due_date
- **Outputs**: call_id, call_status

### Vapi Webhooks

- **Purpose**: Receive End-Of-Call Reports
- **Security**: Webhook signature validation required
- **Payload**: EOCR JSON with call transcript and structured outputs

### Slack Incoming Webhooks

- **Purpose**: Send formatted call result notifications
- **Message format**: Include vendor info, availability status, delivery dates, substitute parts
- **Error handling**: Don't fail main flow if Slack delivery fails

## Environment Configuration

Required environment variables:

```bash
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_WEBHOOK_SECRET=your_webhook_secret

# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Server Configuration
PORT=3000
NODE_ENV=development|production

# Logging
LOG_LEVEL=info|debug|error
```

Create `.env.example` with placeholder values for documentation.

## Testing Strategy

### Unit Tests
- Service layer business logic
- EOCR parser data extraction
- Request ID generation
- Webhook signature validation

### Integration Tests
- API endpoints (mock Vapi and Slack)
- Vapi integration module (mock Vapi responses)
- Slack notification module (mock Slack webhooks)
- End-to-end EOCR processing flow

### Mock External Services
- Mock Vapi API responses for call initiation
- Mock EOCR webhook payloads
- Mock Slack webhook delivery

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.x + TypeScript
- **Validation**: Zod (better TypeScript integration)
- **HTTP Client**: Axios
- **Logging**: Pino (faster, serverless-optimized)
- **Config**: dotenv
- **Dev Server**: ts-node-dev
- **Deployment**: Vercel (Phase 1), Azure (future)
- **Approach**: Minimal tooling - ESLint/Prettier/Jest can be added later as needed

## Future Considerations (Phase 2)

The architecture is designed to support:
- PostgreSQL database for call history
- Blob storage for EOCR JSON files
- Redis or Azure Queue for async processing
- Analytics and reporting UI
- Multiple assistant configurations

When implementing Phase 2 features, maintain the modular structure and add database/storage layers without restructuring existing modules.
