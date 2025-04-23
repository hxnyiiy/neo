import pandas as pd
import folium

# 1. 데이터 불러오기
file_path = 'sinkholes.csv'
df = pd.read_csv(file_path, encoding='utf-8', header=1)

# 2. 컬럼명 정의
lat_col = '사고지점위도'
lon_col = '사고지점경도'
loc_col = '사고발생위치'
date_col = '사고발생일자'
cause_col = '발생원인구분'

# 3. 지도 생성 (한국 중심으로 확대)
map_center = [36.5, 127.5]
sinkhole_map = folium.Map(location=map_center, zoom_start=7)

# 4. 마커 + 팝업
for idx, row in df.iterrows():
    try:
        lat = float(row[lat_col])
        lon = float(row[lon_col])
        if pd.isna(lat) or pd.isna(lon):
            continue
    except (ValueError, TypeError):
        continue

    # 팝업 내용 구성
    popup_content = f"""
    <b>사고발생위치:</b> {row.get(loc_col, '정보 없음')}<br>
    <b>사고발생일자:</b> {row.get(date_col, '정보 없음')}<br>
    <b>발생원인구분:</b> {row.get(cause_col, '정보 없음')}
    """

    folium.CircleMarker(
        location=[lat, lon],
        radius=6,  # 크기 약간 키움
        color='red',
        weight=1,
        fill=True,
        fill_color='red',
        fill_opacity=0.6,
        popup=folium.Popup(popup_content, max_width=300, min_width=150)
    ).add_to(sinkhole_map)

# 5. 지도 저장
sinkhole_map.save('sinkhole_map.html')
print('sinkhole_map.html 저장 완료!')

# 6. 결과 보기
sinkhole_map
