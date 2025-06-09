# 예시 코드 (개념 이해용)
# 분석 결과 비교 및 그래프 그리기

import matplotlib.pyplot as plt

# 가상의 분석 결과 데이터 (예시)
data = {
    '항목': ['말의 속도', '음량', '반복 단어 수'],
    '이전': [150, 0.2, 10],
    '현재': [130, 0.3, 3]
}

plt.figure(figsize=(8, 5))
plt.bar(data['항목'], data['이전'], label='이전 발표', alpha=0.7)
plt.bar(data['항목'], data['현재'], label='현재 발표', alpha=0.7)
plt.ylabel('값')
plt.title('발표 분석 결과 비교')
plt.legend()
plt.show()

# 이 코드는 분석된 숫자 데이터를 가지고 막대 그래프를 그려서 이전과 현재를 쉽게 비교할 수 있도록 해줍니다.