# Booking System Backend

## Setup Instructions

1. Install dependencies
npm install

2. Start PostgreSQL
Make sure PostgreSQL is running and database booking_db exists.

3. Run server
node index.js

Server will run on:
http://localhost:3000


## APIs

1. Create Booking

curl -X POST http://localhost:3000/api/book \
-H "Content-Type: application/json" \
-d '{
  "partner_id": 1,
  "user_id": 101,
  "slot_time": "2026-03-28T10:00:00Z"
}'

2. Payment Webhook

curl -X POST http://localhost:3000/api/payment/webhook \
-H "Content-Type: application/json" \
-d '{
  "event_id": "evt_1",
  "booking_id": 1,
  "amount": 100,
  "status": "SUCCESS"
}'

3. Cancel Booking

curl -X POST http://localhost:3000/api/cancel \
-H "Content-Type: application/json" \
-d '{
  "booking_id": 1
}'


## Key Features

- Prevents double booking using unique constraints
- Uses transactions for safe operations
- Handles concurrency using row locking
- Payment webhook is idempotent
- Supports cancellation with refund logic