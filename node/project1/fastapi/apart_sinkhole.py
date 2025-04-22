from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import uvicorn
import os
import pandas as pd
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
import osmnx as ox
from pydantic import BaseModel
from xml.etree import ElementTree as ET

##특정 구의 싱크홀 리스트와/ 특정 아파트 매매가 정보 도출/ 내위치 근처 싱크홀 정보

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프론트 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

##현재 위치 기반 위도 경도 
class Location(BaseModel):
    latitude: float
    longitude: float

#@app.post("/r_currentloc")
#async def receive_location(loc: Location):
#    print(f"현재 위치: 위도={loc.latitude}, 경도={loc.longitude}")
#    return {"message": "You are now here", "your_lat": loc.latitude, "your_lng": loc.longitude}
    
## 싱크홀 리스트
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

@app.post("/aptsinkhole")
async def post_sinkhole(request: Request):
    try:
        data = await request.json()
        city = data.get("city")
        district = data.get("district")

        if not city or not district:
            return JSONResponse(status_code=400, content={"message": "city와 district가 필요합니다."})

        # 기존 /r_aptsinkhole 로직 재사용
        url = "http://apis.data.go.kr/1611000/undergroundsafetyinfo/getSubsidenceList"
        params = '?serviceKey=' + get_secret("data_apiKey")
        params += f"&pageNo=1"
        params += f"&numOfRows=100"
        params += f"&type=json"
        params += f"&sidoName={city}"
        params += f"&sigunguName={district}"
        params += f"&sagoDateFrom=20210101"
        params += f"&sagoDateTo=20250420"
        url = url + params

        response = requests.get(url)
        if response.status_code != 200:
            return JSONResponse(status_code=500, content={"message": "API 요청 실패", "status_code": response.status_code})

        data = response.json()
        items = data["response"]["body"]["items"]
        filtered_items = [
            item for item in items
            if item.get("sigungu") == district and item.get("sido") == city
        ]

        if not filtered_items:
            return JSONResponse(content={"message": f"{city} {district}에 해당하는 싱크홀 데이터가 없습니다."})

        return JSONResponse(content={
            "count": len(filtered_items),
            "district": f"{city} {district}",
            "list": filtered_items
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"서버 오류: {str(e)}"})
