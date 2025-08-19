
ACCESSTOKEN=""
PREFERENCE_ID=""

curl -X GET http://localhost:3000/api/preference/$PREFERENCE_ID \
  -H "Authorization: Bearer $ACCESSTOKEN" \
  -H "Content-Type: application/json"
