#!/bin/bash

# Test script for Vapi Voice Assistant Backend
# Make sure the server is running: npm run dev

echo "========================================="
echo "Testing Vapi Voice Assistant Backend API"
echo "========================================="
echo ""

# Test 1: Health check (if endpoint exists)
echo "1. Testing server health..."
curl -s http://localhost:3000/api/v1/health || echo "Health endpoint not implemented yet"
echo -e "\n"

# Test 2: Start a vendor call
echo "2. Testing POST /api/v1/calls/start"
echo "Request: Initiating vendor call..."
curl -X POST http://localhost:3000/api/v1/calls/start \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{
    "vendor_name": "ABC Industrial Supply",
    "vendor_phone": "+12145551234",
    "part_number": "ABC-123",
    "quantity_needed": 50,
    "due_date": "2026-04-10"
  }' | jq '.'
echo -e "\n"

# Test 3: Simulate EOCR webhook (with mock data)
echo "3. Testing POST /api/v1/webhooks/vapi/eocr"
echo "Request: Simulating End-of-Call Report webhook..."
curl -X POST http://localhost:3000/api/v1/webhooks/vapi/eocr \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secure_api_key_here" \
  -d '{
    "message": {
      "type": "end-of-call-report",
      "call": {
        "id": "call_abc123",
        "orgId": "org_xyz",
        "createdAt": "2026-04-01T12:00:00.000Z",
        "updatedAt": "2026-04-01T12:05:00.000Z",
        "type": "outboundPhoneCall",
        "phoneNumber": {
          "number": "+12145551234"
        },
        "customer": {
          "number": "+12145551234"
        },
        "status": "ended",
        "endedReason": "assistant-ended-call"
      },
      "transcript": "Sample call transcript here...",
      "summary": "Vendor confirmed availability of 50 units of part ABC-123",
      "analysis": {
        "vendor_contact_reached": true,
        "contact_name": "John Smith",
        "availability_status": "Available",
        "quantity_available": 50,
        "delivery_date": "2026-04-08",
        "substitute_part_number": null,
        "substitute_availability": false,
        "substitute_delivery_date": null
      }
    }
  }' | jq '.'
echo -e "\n"

echo "========================================="
echo "Testing complete!"
echo "========================================="
