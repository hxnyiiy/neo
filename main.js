
// // Geolocation으로 현재 위치 받아서 백엔드로 전송
// function sendCurrentLocation() {
//     if (!navigator.geolocation) {
//       alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
//       return;
//     }
  
//     navigator.geolocation.getCurrentPosition(
//       position => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
  
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', 'http://192.168.1.39:3000/currentloc');
//         xhr.setRequestHeader('Content-Type', 'application/json');
        
//         xhr.onreadystatechange = function() {
//           if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//               const data = JSON.parse(xhr.responseText);
//               console.log('위치 전송 성공:', data);
//               addLog(` 현재 위치 : (${latitude}, ${longitude})`);
//             } else {
//               console.error('위치 전송 실패:', xhr.statusText);
//               addLog(' 위치 전송 실패: ' + xhr.statusText);
//             }
//           }
//         };

//         xhr.onerror = function() {
//           console.error('위치 전송 실패:', xhr.statusText);
//           addLog(' 위치 전송 실패: ' + xhr.statusText);
//         };

//         xhr.send(JSON.stringify({ latitude, longitude }));
//       },
//       error => {
//         alert('위치 정보를 가져올 수 없습니다.');
//         console.error(error);
//       }
//     );
// }
// window.sendCurrentLocation = sendCurrentLocation;

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 배포 시에는 허용 도메인만 지정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시도, 시군구 없이 전체 싱크홀 조회
@app.get("/sinkholes")
def get_all_sinkholes():
    url = "http://apis.data.go.kr/1611000/undergroundsafetyinfo/getSubsidenceList"
    params = "?serviceKey=" + os.getenv("data_apiKey")
    params += "&pageNo=1"
    params += "&numOfRows=1000"  # 필요에 따라 조정 가능
    params += "&type=json"
    params += "&sagoDateFrom=20210101"
    params += "&sagoDateTo=20250420"

    response = requests.get(url + params)
    
    if response.status_code == 200:
        try:
            items = response.json().get("response", {}).get("body", {}).get("items", [])
            return items
        except Exception as e:
            return {"error": f"응답 파싱 실패: {str(e)}"}
    else:
        return {"error": f"API 요청 실패: {response.status_code}"}

        function showMapWithSinkholes(sinkholeList) {
            const map = L.map('map').setView([37.5665, 126.9780], 12); // 초기 위치: 서울
          
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
          
            sinkholeList.forEach(item => {
              if (item.lat && item.lon) {
                L.marker([item.lat, item.lon])
                  .addTo(map)
                  .bindPopup(`<strong>[${item.sagoDate}]</strong><br>${item.sagoDetail}`);
              }
            });
          }

          function showMapWithSinkholes(list) {
            // 지도 div가 없으면 리턴
            const mapDiv = document.getElementById('map');
            if (!mapDiv) return;
          
            // 기존 지도 인스턴스가 있으면 제거(메모리릭 방지)
            if (window.sinkholeMap) {
              window.sinkholeMap.remove();
            }
          
            // 기본 위치: 서울 강남구
            let center = [37.5172, 127.0473];
            if (list && list.length > 0 && list[0].lat && list[0].lng) {
              center = [list[0].lat, list[0].lng];
            }
          
            // 지도 생성
            const map = L.map('map').setView(center, 13);
            window.sinkholeMap = map;
          
            // 타일 레이어 추가
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
          
            // 싱크홀 마커 추가
            if (list && list.length > 0) {
              list.forEach(item => {
                if (item.lat && item.lng) {
                  L.marker([item.lat, item.lng])
                    .addTo(map)
                    .bindPopup(`<b>${item.sagoDate || ''}</b><br>${item.sagoDetail || ''}`);
                }
              });
            }
          }
          







