data='{ "userName": "'$1'", "password": "'$2'" }'

curl -X POST \
  -H 'content-type: application/json' \
  -d "$data" \
  localhost:3000/api/auth/login
echo ""
