#!/bin/bash

ACCESSTOKEN=""
PAYMENT_ID=""

curl -X GET http://localhost:3000/api/payment/$PAYMENT_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
