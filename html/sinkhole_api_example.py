from fastapi import FastAPI, Query
import requests
import os
import json

def get_secret(key):
    # 실제 환경에서는 환경변수나 .env 등에서 키를 가져오세요
    return os.getenv(key)

app = FastAPI()

@app.get("/r_aptsinkhole")
async def get_sinkhole(
    sido: str = Query("서울특별시"),
    sigungu: str = Query("강남구")
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

    response = requests.get(url + params)

    if response.status_code != 200:
        return {"error": "API 요청 실패", "status_code": response.status_code}

    try:
        data = response.json()
        items = data["response"]["body"]["items"]
        filtered_items = [
            {"lat": item.get("sagoLat"), "lon": item.get("sagoLon")}
            for item in items
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
