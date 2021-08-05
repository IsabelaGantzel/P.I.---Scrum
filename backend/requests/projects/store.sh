
data='''{
  "projectName": "Primeiro Projeto",
  "managerId": 0,
  "clientId": 1,
  "devIds": [0, 1]
}'''


curl -X POST \
  -H 'content-type: application/json' \
  -d "$data" \
  localhost:3000/api/projects
echo ""
