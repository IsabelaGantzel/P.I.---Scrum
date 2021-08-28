token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6MywiaWF0IjoxNjI5OTE5NTYzLCJleHAiOjE2MzAwMDU5NjN9.CneEI3Or1Z3z-EkKl6DIhhI3qz0OOCHtpU9J1bf6w1I"

data='''{
  "taskIds": [1, 2, 3]
}'''

curl -X POST \
  -H 'content-type: application/json' \
  -H "authorization: Bearer $token" \
  -d "$data" \
  localhost:3000/api/projects/2/sprint-tasks
echo ""
