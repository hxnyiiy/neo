// 태성님 코드 프론트에 붙여넣기 (fetch)
const modelList = document.getElementById('model-list');
const downloadInput = document.getElementById('download-input'); // 이 부분이 필요하니 꼭 HTML에 해당 ID 입력창이 있어야 함

fetch('http://192.168.1.42:8000/test/subway_apartment_visual.html')
  .then(response => response.text())
  .then(html => {
    // someDiv는 해당 HTML을 삽입할 div의 id여야 합니다.
    const someDiv = document.getElementById('some-div');
    if (someDiv) {
      someDiv.innerHTML = html;
    }
  })
  .catch(err => {
    console.error('페이지 fetch error:', err);
    const someDiv = document.getElementById('some-div');
    if (someDiv) {
      someDiv.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
    }
  });

// iframe을 동적으로 삽입
const someDiv = document.getElementById('some-div');
fetch('http://192.168.1.42:8000/test/subway_apartment_visual.html')
  .then(response => response.text())
  .then(html => {
    someDiv.innerHTML = html;
  })
  .catch(err => {
    console.error('iframe fetch error:', err);
    someDiv.innerHTML = '<p>콘텐츠를 불러오는 데 실패했습니다.</p>';
  });


// 내 api결과 프론트에 띄우기()
document.addEventListener('DOMContentLoaded', function () {
  const sinkholeBtn = document.getElementById('load-sinkholes');
  const resultDiv = document.getElementById('sinkhole-result');

  sinkholeBtn.addEventListener('click', function () {
    resultDiv.textContent = '싱크홀 정보 불러오는 중...';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/aptsinkhole');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            const items = data.response?.body?.items || [];
            const count = data.response?.body?.totalCount || 0;

            resultDiv.innerHTML = `<h3>총 ${count}건의 싱크홀 정보</h3>`;

            items.forEach(item => {
              const div = document.createElement('div');
              div.className = 'sinkhole-item';
              div.innerHTML = `
                <strong>📍 ${item.sido} ${item.sigungu}</strong><br/>
                📅 날짜: ${item.sagoDate}<br/>
                🕳️ 내용: ${item.sagoDetail}<br/>
                🆔 사고번호: ${item.sagoNo}<br/><br/>
              `;
              resultDiv.appendChild(div);
            });

          } catch (err) {
            resultDiv.textContent = '데이터 파싱 오류: ' + err.message;
          }
        } else {
          resultDiv.textContent = `서버 오류 발생 (${xhr.status})`;
        }
      }
    };
    xhr.send();
  });
});

