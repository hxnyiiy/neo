@app.get("/sinkhole_nearby")
async def sinkhole_nearby(lat: float, lng: float):
    # DB나 캐시에서 싱크홀 리스트 불러오기
    # 여기선 예시 좌표 사용
    sinkholes = [
        {"name": "싱크홀 A", "lat": 37.5665, "lng": 126.9780},
        {"name": "싱크홀 B", "lat": 37.5670, "lng": 126.9765}
    ]

    # 반경 2km 이내 필터링
    from geopy.distance import geodesic
    nearby = [
        s for s in sinkholes
        if geodesic((lat, lng), (s["lat"], s["lng"])).km < 2
    ]
    return {"list": nearby}
