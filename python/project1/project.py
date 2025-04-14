import pandas as pd

# 엑셀 파일 경로 지정 (현재 파이썬 파일 기준으로 경로)
file_path = '지반침하사고발생신고 (1).xls'

# 엑셀 파일 읽기
df = pd.read_excel(file_path)

# 데이터프레임을 JSON으로 변환
json_data = df.to_json(orient='records', force_ascii=False, indent=2)

# 결과 출력
print(json_data)

# JSON 파일로 저장하고 싶으면 이렇게
with open('output.json', 'w', encoding='utf-8') as f:
    f.write(json_data)

print('JSON 파일 저장 완료 ✅')

