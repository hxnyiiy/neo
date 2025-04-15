import requests
import xml.etree.ElementTree as ET

# ★ 여기 네 디코딩된 API KEY를 넣어줘
API_KEY = 'Zmc75paRwNOsrKWRXm4E7EoTM2KQaxR85UPWgw8sJGJvNDOG4CI5fJgoCO5EVOGBB26PmIix2fGtziTw6ryziA=='

# 요청할 지역과 연월 설정
lawd_cd = '11680'  # 서울 강남구
deal_ymd = '202501'  # 2025년 1월

# 요청 URL 만들기
url = f'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
params = {
    'serviceKey': API_KEY,
    'LAWD_CD': lawd_cd,
    'DEAL_YMD': deal_ymd
}

# API 요청 보내기
response = requests.get(url, params=params)

# 응답 확인
if response.status_code == 200:
    root = ET.fromstring(response.content)
    
    for item in root.iter('item'):
        apartment_name = item.findtext('아파트')
        price = item.findtext('거래금액').strip()
        area = item.findtext('전용면적')
        year = item.findtext('년')
        month = item.findtext('월')
        day = item.findtext('일')
        dong = item.findtext('법정동')
        jibun = item.findtext('지번')
        
        print(f"{year}-{month}-{day} {dong} {apartment_name}({jibun}) {area}㎡ : {price}만원")
else:
    print("API 요청 실패:", response.status_code)
