#!/bin/bash

ACCESSTOKEN=""
PAYMENT_ID=""
PREFERENCE_ID=""

curl -X GET http://localhost:3000/api/check/all/$PAYMENT_ID/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
