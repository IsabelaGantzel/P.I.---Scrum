token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6MywiaWF0IjoxNjMwMDk2MDE1LCJleHAiOjE2MzAxODI0MTV9.kMCKMu26YZU73VGXkD6Kg5cikGMflrIqhpXsYtv2x30"

if [ -z "$1" ]; then
  echo "You must provide a projectId"
  exit 1
fi

curl -X GET \
  -H 'content-type: application/json' \
  -H "authorization: Bearer $token" \
  "localhost:3000/api/projects/$1"
echo ""
