import uvicorn
from fastapi import FastAPI, HTTPException, Query
import pandas as pd

app = FastAPI()

CSV_PATH = "sinkholes.csv"

try:
    df = pd.read_csv(CSV_PATH, encoding="utf-8", skiprows=1)
    df.columns = df.columns.str.strip()

    required_columns = ['사고발생일자', '사고발생위치', '사고지점위도', '사고지점경도']
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"CSV에 '{col}' 컬럼이 없습니다.")

    df['사고발생위치_전처리'] = df['사고발생위치'].astype(str).str.replace(" ", "").str.lower()

except Exception as e:
    raise RuntimeError(f"CSV 로드 실패: {e}")

@app.get("/sinkholes")
def get_sinkholes(district: str = Query(..., description="검색할 시/구 이름 (예: 강남구, 사상구)")):
    if not district.strip():
        raise HTTPException(status_code=400, detail="검색어는 비어 있을 수 없습니다.")

    try:
        query = district.replace(" ", "").lower()
        filtered = df[df['사고발생위치_전처리'].str.contains(query, na=False)]

        if filtered.empty:
            raise HTTPException(status_code=404, detail=f"{district} 지역의 싱크홀 데이터가 없습니다.")

        result = filtered[[
            '사고발생일자', '사고발생위치', '사고지점위도', '사고지점경도'
        ]].rename(columns={
            '사고발생일자': 'date',
            '사고발생위치': 'location',
            '사고지점위도': 'latitude',
            '사고지점경도': 'longitude'
        }).to_dict(orient='records')

        return {
            "district": district,
            "count": len(result),
            "sinkholes": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"서버 내부 오류: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
