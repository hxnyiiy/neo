from fastapi import FastAPI, Query
import requests
import json
import uvicorn
import os
import pandas as pd
from geopy.distance import geodesic
from xml.etree import ElementTree as ET

##특정 구의 싱크홀 리스트와 특정 아파트 매매가 정보 도출 내위치 근처 싱크홀 정보

app = FastAPI()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.relpath("./")))
secret_file = os.path.join(BASE_DIR, '../secret.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        return f"Set the {setting} environment variable."


code_df = pd.read_csv("districtnm.csv", encoding='utf-8')
code_df["법정동명"] = code_df["법정동명"].str.strip()

## 싱크홀 리스트
@app.get("/r_aptsinkhole")
async def get_sinkhole(
    sido: str = Query("서울특별시", description="시/도 이름 (예: 서울특별시)"),
    sigungu: str = Query("강남구", description="시/군/구 이름 (예: 강남구)")
):
    url = "http://apis.data.go.kr/1611000/undergroundsafetyinfo/getSubsidenceList"
    params = '?serviceKey=' + get_secret("data_apiKey")
    params += f"&pageNo=1"
    params += f"&numOfRows=100"
    params += f"&type=json"
    params += f"&sidoName={sido}"
    params += f"&sigunguName={sigungu}"
    params += f"&sagoDateFrom=20210101"
    params += f"&sagoDateTo=20250420"

    url = url + params
    response = requests.get(url)
    if response.status_code != 200:
        return {"error": "API 요청 실패", "status_code": response.status_code}

    try:
        data = response.json()
        items = data["response"]["body"]["items"]
        filtered_items = [
            item for item in items
            if item.get("sigungu") == sigungu and item.get("sido") == sido
        ]
    except (KeyError, json.JSONDecodeError):
        return {"message": "데이터가 없습니다."}

    if not filtered_items:
        return {"message": f"{sido} {sigungu}에 해당하는 싱크홀 데이터가 없습니다."}

    return {
        "count": len(filtered_items),
        "district": f"{sido} {sigungu}",
        "list": filtered_items
    }
    
##아파트 매매가 리스트
@app.get("/r_aptsinkholes")
async def get_aptinfo(
    sido: str = Query("서울특별시", description="시/도 이름"),
    sigungu: str = Query("종로구", description="시/군/구 이름"),
    umdNm: str = Query(..., description="법정동 이름(예: 무악동)"),
    roadNm: str = Query(..., description="도로명(예: 통일로18길)"),
    aptNm: str = Query(..., description="아파트명(예:인왕산2차아이파크)"),
    deal_ym: str = Query(..., description="거래 연월 (예: 201512)")
):
    full_name = f"{sido} {sigungu} {umdNm}"
    match = code_df[code_df["법정동명"] == full_name]

    if match.empty:
        return {"error": f"{full_name}에 해당하는 법정동코드가 없습니다."}

    lawd_cd = str(match.iloc[0]["법정동코드"])[:5]

    url = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev"
    params = "?serviceKey=" + get_secret("data_apiKey")
    params += f"&LAWD_CD={lawd_cd}"
    params += f"&DEAL_YMD={deal_ym}"
    params += f"&numOfRows=100"
    params += f"&pageNo=1"

    url = url + params
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "API 요청 실패", "status_code": response.status_code}

    try:
        root = ET.fromstring(response.content)
        items = root.findall(".//item")

        filtered = []
        for item in items:
            apt = item.findtext("aptNm") or ""
            umd = item.findtext("umdNm") or ""
            road = item.findtext("roadNm") or ""
            if aptNm in apt and umdNm in umd and roadNm in road:
                data = {child.tag: child.text for child in item}
                filtered.append(data)

        if not filtered:
            return {"message": "해당 조건이 존재하지 않습니다."}

        return {
            "district": f"{sido} {sigungu} {umdNm}",
            "list": filtered
        }

    except Exception as e:
        return {"error": "데이터 처리 중 오류 발생", "detail": str(e)}
    
##내 위치 반경 2KM 내 싱크홀
@app.get("/sinkhole_nearby")
async def sinkhole_nearby(lat: float, lng: float):
    sido = "서울특별시"
    sigungu = "강남구"  # 임시 고정값. 추후 좌표로 시군구 추정 가능

    # OpenAPI 호출
    url = "http://apis.data.go.kr/1611000/undergroundsafetyinfo/getSubsidenceList"
    params = '?serviceKey=' + get_secret("data_apiKey")
    params += f"&pageNo=1"
    params += f"&numOfRows=200"
    params += f"&type=json"
    params += f"&sidoName={sido}"
    params += f"&sigunguName={sigungu}"
    params += f"&sagoDateFrom=20210101"
    params += f"&sagoDateTo=20250421"

    full_url = url + params
    response = requests.get(full_url)
    
    if response.status_code != 200:
        return {"error": "API 요청 실패", "status_code": response.status_code}

    try:
        data = response.json()
        items = data["response"]["body"]["items"]
    except (KeyError, json.JSONDecodeError):
        return {"message": "데이터가 없습니다."}

    # 좌표 필터링 (반경 2km)
    def item_to_point(item):
        try:
            return (float(item["spotLa"]), float(item["spotLo"]))
        except:
            return None

    filtered_items = []
    for item in items:
        point = item_to_point(item)
        if point:
            distance = geodesic((lat, lng), point).km
            if distance < 2:
                filtered_items.append({
                    "name": item.get("oadres", "싱크홀"),
                    "lat": point[0],
                    "lng": point[1],
                    "distance_km": round(distance, 2)
                })

    return {"list": filtered_items}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
