// leaflet.js/leaflet.css 동적 삽입
function ensureLeafletLoaded(callback) {
  if (window.L) { callback(); return; }
  const leafletCss = document.createElement('link');
  leafletCss.rel = 'stylesheet';
  leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(leafletCss);
  const leafletJs = document.createElement('script');
  leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  leafletJs.onload = callback;
  document.head.appendChild(leafletJs);
}

function showMapWithSinkholes(list) {
  // map-container에 map div가 없으면 생성
  let mapDiv = document.getElementById('map');
  if (!mapDiv) {
    const container = document.getElementById('map-container');
    if (!container) return;
    mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '400px';
    mapDiv.style.borderRadius = '8px';
    mapDiv.style.margin = '0 auto';
    container.innerHTML = '';
    container.appendChild(mapDiv);
  }
  // 기존 지도 인스턴스가 있으면 제거
  if (window.sinkholeMap) {
    window.sinkholeMap.remove();
  }
  // 지도 중심
  let center = [37.5172, 127.0473];
  if (list && list.length > 0 && list[0].lat && list[0].lng) {
    center = [list[0].lat, list[0].lng];
  }
  // 지도 생성
  const map = L.map('map').setView(center, 13);
  window.sinkholeMap = map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  // 마커
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

// API에서 싱크홀 데이터 받아오기
function loadSinkholeMap() {
  ensureLeafletLoaded(() => {
    fetch('/sinkholes')
      .then(res => res.json())
      .then(data => {
        // data가 [{lat, lng, sagoDate, sagoDetail, ...}, ...] 형태라고 가정
        showMapWithSinkholes(data);
      })
      .catch(err => {
        const container = document.getElementById('map-container');
        if (container) {
          container.innerHTML = '<div style="color:red;text-align:center;">싱크홀 데이터를 불러오지 못했습니다.</div>';
        }
        console.error('싱크홀 데이터 로드 실패', err);
      });
  });
}

// 페이지 로드 시 자동 실행
window.addEventListener('DOMContentLoaded', loadSinkholeMap);








