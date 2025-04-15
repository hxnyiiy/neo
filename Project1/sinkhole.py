import requests
import pandas as pd

# 너의 API 키
service_key = "Zmc75paRwNOsrKWRXm4E7EoTM2KQaxR85UPWgw8sJGJvNDOG4CI5fJgoCO5EVOGBB26PmIix2fGtziTw6ryziA=="

# 결과를 저장할 리스트
all_data = []

# 1페이지부터 10페이지까지 반복
for page in range(1, 11):
    url = f"http://apis.data.go.kr/1611000/undergroundsafetyinfo/getSubsidenceInfo"
    params = {
        "serviceKey": service_key,
        "pageNo": page,
        "numOfRows": 10,
        "type": "json",
        "sagoNo": "20190002"
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        items = data.get('response', {}).get('body', {}).get('items', [])
        if items:
            all_data.extend(items)
        else:
            print(f"{page}페이지에 데이터가 없습니다.")
    else:
        print(f"{page}페이지 요청 실패: {response.status_code}")

# 데이터프레임으로 변환
df = pd.DataFrame(all_data)

# CSV로 저장
df.to_csv("subsidence_info.csv", index=False, encoding='utf-8-sig')

print("CSV 저장 완료! ✅ (subsidence_info.csv)")

