#!/bin/bash

ACCESSTOKEN=""

curl -X POST http://localhost:3000/api/payment \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "description": "Teste PIX"
  }'
