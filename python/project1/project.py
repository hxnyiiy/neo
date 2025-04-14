import pandas as pd
import folium

# 1. 데이터 불러오기
file_path = 'sinkholes.csv'
df = pd.read_csv(file_path, encoding='utf-8', header=1)  # ⭐️ header=1 추가!

# 데이터 확인
print(df.head())

# 2. 위도, 경도 컬럼명 정확히 입력
lat_col = '사고지점위도'
lon_col = '사고지점경도'

# 3. 지도 생성 (서울 중심)
map_center = [37.5665, 126.9780]
sinkhole_map = folium.Map(location=map_center, zoom_start=7)

# 4. 마커 찍기
for idx, row in df.iterrows():
    lat = row[lat_col]
    lon = row[lon_col]

    if pd.isna(lat) or pd.isna(lon):
        continue

    folium.CircleMarker(
        location=[lat, lon],
        radius=3,
        color='red',
        fill=True,
        fill_color='red',
        fill_opacity=0.7
    ).add_to(sinkhole_map)

# 5. 지도 저장
sinkhole_map.save('sinkhole_map.html')
print('sinkhole_map.html 저장 완료!')

# 6. 결과 보기
sinkhole_map
