# Product Requirements Document (PRD)

## Vapi Voice Assistant Integration Backend (Phase 1)

---

# 1. Overview

## 1.1 Purpose

This backend application will act as an integration layer between the Vapi voice assistant and external systems such as third-party APIs, SaaS applications, and internal business systems.

The system will:

* Trigger Vapi voice calls via API
* Receive End-Of-Call Report (EOCR) from Vapi
* Extract structured outputs from EOCR
* Send structured results to Slack
* Provide logging and traceability
* Be designed modularly so database, dashboards, and analytics can be added later

Phase 1 will **not include a database**. The system will be stateless but designed to support persistence in future releases.

---

# 2. Goals and Objectives

## 2.1 Business Goals

* Automate vendor sourcing calls
* Capture structured call outcomes
* Notify team via Slack when calls complete
* Build reusable integration platform for voice agents

## 2.2 Technical Goals

* API endpoint to trigger Vapi calls
* Include authentication (API key) for all endpoints and webhooks
* EOCR webhook endpoint
* Structured data extraction from EOCR JSON
* Slack notification integration
* Logging for troubleshooting
* Modular architecture for future enhancements
* Deploy on Vercel initially; portable to Azure later

---

# 3. Scope (Phase 1)

## In Scope

* Start call API
* EOCR webhook
* Structured output extraction
* Slack notification
* Logging
* Error handling
* Modular architecture

## Out of Scope (Phase 1)

* Database
* UI dashboards
* Analytics
* Authentication portal
* Multi-tenant support
* Reporting UI
* Transcript storage
* Recording storage
* Retry queues (may be Phase 2)

---

# 4. System Architecture (High Level)

## Flow 1 — Trigger Call

```
Client → Backend API → Vapi API → Vendor Phone Call
```

## Flow 2 — End of Call

```
Vapi EOCR Webhook → Backend → Extract Structured Data → Slack Notification
```

## Flow 3 — Future

```
Backend → Database → Dashboard → Reporting → Analytics
```

---

# 5. Functional Requirements

# 5.1 API Endpoint — Start Vendor Call

## Endpoint

```
POST /api/v1/calls/start
```

## Description

This endpoint will accept vendor and part sourcing information and trigger the Vapi voice assistant to call the vendor.

## Request Payload

```json
{
  "vendor_name": "ABC Industrial Supply",
  "vendor_phone": "+12145551234",
  "part_number": "ABC-123",
  "quantity_needed": 50,
  "due_date": "2026-04-10"
}
```

## Backend Processing Steps

1. Validate request payload
2. Generate internal request ID
3. Log request
4. Invoke Vapi API to start call
5. Pass variables to Vapi assistant:

   * vendor_name
   * part_number
   * quantity_needed
   * due_date
6. Return response to client

## Response

```json
{
  "status": "success",
  "call_id": "REQ-2026-0001",
  "message": "Call initiated"
}
```

---

# 5.2 Webhook Endpoint — EOCR Receiver

## Endpoint

```
POST /api/v1/webhooks/vapi/eocr
```

## Description

Receives End-Of-Call Report from Vapi and extracts structured outputs.

## Backend Processing Steps

1. Validate webhook signature (security)
2. Log raw EOCR payload
3. Extract call ID and structured fields
4. Format Slack message
5. Send Slack message via Incoming Webhook
6. Return HTTP 200

---

# 5.3 Structured Data Extraction

The system must extract the following fields from EOCR structured outputs:

| Field                    | Description                         |
| ------------------------ | ----------------------------------- |
| vendor_contact_reached   | Yes/No                              |
| contact_name             | Name of person spoken to            |
| availability_status      | Available / Not Available / Partial |
| quantity_available       | Number                              |
| delivery_date            | Date                                |
| substitute_part_number   | If substitute offered               |
| substitute_availability  | Yes/No                              |
| substitute_delivery_date | Date                                |

## Example Extracted Output

```json
{
  "vendor_contact_reached": true,
  "contact_name": "Mike Johnson",
  "availability_status": "Partial",
  "quantity_available": 30,
  "delivery_date": "2026-04-08",
  "substitute_part_number": "ABC-123X",
  "substitute_availability": true,
  "substitute_delivery_date": "2026-04-06"
}
```

---

# 5.4 Slack Notification

Slack message should be structured and easy to read.

## Slack Message Format

```
📞 Vendor Call Completed

Vendor: ABC Industrial Supply
Contact Reached: Yes
Contact Name: Mike Johnson

Part: ABC-123
Availability: Partial
Qty Available: 30
Delivery Date: Apr 8, 2026

Substitute Part: ABC-123X
Substitute Available: Yes
Substitute Delivery: Apr 6, 2026
```

Slack integration will use **Slack Incoming Webhook URL**.

---

# 6. Logging Requirements

Logging is critical since Phase 1 does not include a database.

The system must log the following:

| Event                       | What to Log     |
| --------------------------- | --------------- |
| Start call API request      | Request payload |
| Vapi API request            | Payload sent    |
| Vapi API response           | Response        |
| EOCR webhook received       | Full EOCR JSON  |
| Extracted structured data   | Parsed fields   |
| Slack message sent          | Slack payload   |
| Errors                      | Error stack     |
| Webhook validation failures | Details         |

## Log Storage

* Vercel logs (initial)
* Future: Azure App Insights / Datadog / ELK

Logs must include:

* timestamp
* request_id
* vapi_call_id (if available)
* log level (INFO/ERROR)
* message
* payload

---

# 7. Error Handling Requirements

| Scenario                  | Action                               |
| ------------------------- | ------------------------------------ |
| Vapi API failure          | Return error to client               |
| EOCR parsing failure      | Log error and send Slack alert       |
| Slack webhook failure     | Log error                            |
| Invalid webhook signature | Reject request                       |
| Missing structured fields | Send Slack message with partial data |

---

# 8. Non-Functional Requirements

| Requirement    | Description                              |
| -------------- | ---------------------------------------- |
| Modular Design | Easy to add DB/UI later                  |
| Stateless      | Phase 1                                  |
| Logging        | Full traceability                        |
| Security       | Webhook signature validation             |
| Cloud Agnostic | Vercel → Azure                           |
| Maintainable   | Clean service architecture               |
| Scalable       | Should support multiple concurrent calls |
| Observability  | Trace each call via request_id           |

---

# 9. Suggested Technical Architecture

| Layer                   | Responsibility             |
| ----------------------- | -------------------------- |
| API Layer               | REST endpoints             |
| Service Layer           | Business logic             |
| Vapi Integration Module | Calls Vapi API             |
| EOCR Parser Module      | Extract structured outputs |
| Slack Module            | Send Slack messages        |
| Logging Module          | Structured logs            |
| Config Module           | Environment configs        |

---

# 10. Tech Stack (Finalized)

| Component    | Technology                                |
| ------------ | ----------------------------------------- |
| Runtime      | Node.js 18+                               |
| Backend      | Express 4.x + TypeScript                  |
| Deployment   | Vercel                                    |
| Logging      | Pino (faster, serverless-optimized)       |
| Slack        | Incoming Webhooks                         |
| Validation   | Zod (better TypeScript integration)       |
| HTTP Client  | Axios                                     |
| Config       | dotenv                                    |
| Dev Server   | ts-node-dev                               |
| Approach     | Minimal tooling (ESLint/Prettier/Jest optional) |
| Future DB    | PostgreSQL                                |
| Future Queue | Redis / Azure Queue                       |

### Dependencies

**Core:**
```
express, zod, axios, pino, pino-pretty, dotenv
```

**Dev:**
```
typescript, @types/node, @types/express, ts-node-dev
```

---

# 11. Future Enhancements (Phase 2)

* Database to store call records
* Admin dashboard
* Analytics dashboard
* Call history
* Multi-assistant support
* Multi-tenant support
* Retry failed Slack messages
* Store transcripts
* Store recordings
* CRM integration
* Email notifications
* Role-based access control
* Reporting API

---

# 12. Open Questions

To finalize architecture before implementation:

1. Will multiple people/systems call the **start call API**, or just one system?
2. Should Slack messages go to **one channel** or multiple channels?
3. Do you want **retry logic** for Slack failures in Phase 1?
4. Should we store EOCR JSON files in **blob storage** even if DB is not used?
5. Expected number of calls per day?
6. Do you want to support **multiple assistants** later?

**Resolved:**
- ✅ Tech stack finalized (Express + TypeScript + Zod + Pino)
- ✅ Authentication: API key required for all endpoints (per section 2.2)

---

# 13. Summary

This backend system will act as a **Voice Automation Integration Layer** with the following core capabilities:

| Capability            | Description          |
| --------------------- | -------------------- |
| Call Trigger API      | Start vendor calls   |
| EOCR Webhook          | Receive call results |
| Structured Extraction | Parse call outcomes  |
| Slack Notification    | Notify team          |
| Logging               | Troubleshooting      |
| Modular Design        | Future DB + UI       |
