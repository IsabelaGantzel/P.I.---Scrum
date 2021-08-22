token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb25JZCI6MSwiaWF0IjoxNjI5NjQ3ODU1LCJleHAiOjE2Mjk3MzQyNTV9.JhSrdNsFAEmVe_KE5aAdubtotBxINf3NXLG-QVlGLZs"

curl -X GET \
  -H 'content-type: application/json' \
  -H "authorization: Bearer $token" \
  localhost:3000/api/projects
echo ""
