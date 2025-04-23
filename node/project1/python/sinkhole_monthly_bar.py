import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

# 한글 폰트 설정 (윈도우/리눅스 호환)
font_path = fm.findSystemFonts(fontpaths=None, fontext='ttf')
font_name = None
for path in font_path:
    if 'NanumGothic' in path or 'Malgun' in path or 'AppleGothic' in path:
        font_name = fm.FontProperties(fname=path).get_name()
        break
plt.rc('font', family=font_name if font_name else 'DejaVu Sans')

# CSV 파일 읽기
df = pd.read_csv('sinkholes.csv', encoding='utf-8', skiprows=1)

# '사고발생일자'에서 월 추출
def extract_month(date_str):
    try:
        # '2024-12-23 오전 00:00' 또는 '2024-01-23 ...' 등에서 월 추출
        parts = str(date_str).split('-')
        if len(parts) < 2:
            return None
        month_str = parts[1].strip()
        if len(month_str) == 1:
            month = int(month_str)
        elif len(month_str) == 2 and month_str.isdigit():
            month = int(month_str)
        else:
            return None
        if 1 <= month <= 12:
            return month
        return None
    except Exception:
        return None

df['월'] = df['사고발생일자'].apply(extract_month)

# 월별 사고 건수 집계 (1~12월 모두 표시)
month_counts = df.groupby('월').size().reindex(range(1,13), fill_value=0)

# y축 레이블: 1월~12월
month_labels = [f'{i}월' for i in range(1,13)]

# 파스텔톤 컬러 지정 (Pastel1 12색)
from matplotlib import cm
colors = cm.get_cmap('Pastel1', 12).colors

# 퍼센트 계산
total = month_counts.sum()
percentages = (month_counts.values / total * 100) if total > 0 else [0]*12

plt.figure(figsize=(10,6))
bars = plt.barh(range(1,13), month_counts.values, color=colors)
plt.ylabel('월')
plt.xlabel('싱크홀 발생 건수')
plt.title('월별 싱크홀 발생 빈도', fontsize=18, fontweight='bold')
plt.yticks(range(1,13), month_labels)
plt.gca().invert_yaxis()  # 1월이 위로 오도록

# 맨 윗줄(상단)과 맨 오른쪽(우측) 테두리 선 제거
ax = plt.gca()
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# 각 막대에 퍼센트 표시 (더 진하게, 막대 내부 오른쪽 끝에 위치, 값이 0이면 표시 안함)
for i, (bar, count, pct) in enumerate(zip(bars, month_counts.values, percentages)):
    if count == 0:
        continue
    # 막대 내부 오른쪽 끝에서 약간 왼쪽에 위치
    xpos = bar.get_width() - max(month_counts.values)*0.03
    xpos = max(xpos, 0)  # 음수 방지
    plt.text(xpos, bar.get_y() + bar.get_height()/2,
             f'{pct:.1f}%', va='center', ha='right', fontsize=12, color='#222', fontweight='bold')

plt.tight_layout()
plt.savefig('sinkhole_monthly_bar.png')
plt.show()
