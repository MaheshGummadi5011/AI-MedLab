import requests
r = requests.get('http://localhost:5000/get_status')
d = r.json()
details = d.get('details', [])
print(f'✅ Total Doctors: {len(details)}')
print('\nDoctors list:')
for i, doc in enumerate(details, 1):
    print(f'{i}. {doc["username"]} - {doc["specialization"]} - Status: {doc["status"]}')
