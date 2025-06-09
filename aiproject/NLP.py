# 예시 코드 (개념 이해용)
# 텍스트에서 키워드 추출, 문장 길이 분석 등

from collections import Counter
from konlpy.tag import Okt # 한국어 형태소 분석기

text_이전 = "이전 발표 내용입니다. AI는 중요합니다. 미래를 바꿀 것입니다."
text_현재 = "현재 발표 내용입니다. 인공지능은 매우 중요합니다. 미래를 바꿀 기술입니다."

# 키워드 분석
okt = Okt()
nouns_이전 = okt.nouns(text_이전) # 명사만 추출
count_이전 = Counter(nouns_이전)
print(f"이전 발표 키워드:\n{count_이전}")

nouns_현재 = okt.nouns(text_현재)
count_현재 = Counter(nouns_현재)
print(f"현재 발표 키워드:\n{count_현재}")

# 이 코드는 텍스트에서 핵심 단어를 찾아내고, 각 단어가 몇 번 나왔는지 세어줍니다.