token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6MiwiaWF0IjoxNjI5NzQwMDE3LCJleHAiOjE2Mjk4MjY0MTd9.h306B5oJIur8UYCjLzi7UMJkfKjeeCKV9EAxboFxUjU"
projectId=$1

curl -X GET \
  -H 'content-type: application/json' \
  -H "authorization: Bearer $token" \
  localhost:3000/api/projects/$projectId/tasks
echo ""
