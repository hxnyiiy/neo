document.addEventListener('DOMContentLoaded', function () {

    const firstSection = document.getElementById('first-section');
    const secondSection = document.getElementById('second-section');
    const thirdSection = document.getElementById('third-section');
    const fourthSection = document.getElementById('fourth-section');

    setTimeout(() => {
        if (scrollTargets[anchor]) {
          scrollTargets[anchor].scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);  // 여기서 hero로 강제 이동
        }
      }, 200);
  
    fetch('first.html')
       .then(res => res.text())
       .then(data => {
         firstSection.innerHTML = data;
         // first-section 안의 <script> 태그를 찾아 동적으로 실행
         const scripts = firstSection.querySelectorAll('script');
         scripts.forEach(oldScript => {
           const newScript = document.createElement('script');
           if (oldScript.src) {
             newScript.src = oldScript.src;
           } else {
             newScript.textContent = oldScript.textContent;
           }
           document.body.appendChild(newScript);
         });
         // 동적으로 bar chart JS 실행 (null 체크)
         const barChart = firstSection.querySelector('#bar-chart');
         if (barChart) {
           // 연도 옵션에 2021 추가
           const yearSelect = firstSection.querySelector('#year-select');
           if (yearSelect && !yearSelect.querySelector('option[value="2021"]')) {
             const opt = document.createElement('option');
             opt.value = '2021';
             opt.textContent = '2021';
             yearSelect.appendChild(opt);
           }
           // 실제 데이터는 필요에 따라 수정
           const monthlyData = {
             "2024": [2, 3, 1, 4, 5, 2, 3, 2, 1, 0, 2, 1],
             "2023": [1, 2, 2, 3, 2, 1, 2, 1, 3, 2, 1, 0],
             "2022": [0, 1, 1, 2, 1, 0, 1, 2, 0, 1, 2, 1],
             "2021": [1, 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 1]
           };
           // 월별 색상 팔레트
           const barColors = [
             '#4a90e2', '#50e3c2', '#b8e986', '#f8e71c',
             '#f5a623', '#d0021b', '#9013fe', '#417505',
             '#7ed321', '#f9a825', '#e67e22', '#8b572a'
           ];
           function drawBarChart(year) {
             const data = monthlyData[year];
             const max = Math.max(...data, 1);
             const chart = firstSection.querySelector('#bar-chart');
             chart.innerHTML = '';
             // bar chart 영역
             const barArea = document.createElement('div');
             barArea.className = 'bar-area';
             // x축 라벨
             const xAxis = document.createElement('div');
             xAxis.className = 'x-axis';
             const total = data.reduce((a, b) => a + b, 0);
             data.forEach((val, i) => {
               const bar = document.createElement('div');
               bar.style.height = (val / max * 100) + '%';
               bar.style.width = '7%';
               bar.style.background = barColors[i % barColors.length];
               bar.style.margin = '0 2px';
               bar.title = `${i+1}월: ${val}건`;
               bar.style.borderRadius = '4px 4px 0 0';
               bar.style.position = 'relative';
               // 발생건수+퍼센트 텍스트
               if (total > 0) {
                 const labelTop = document.createElement('div');
                 labelTop.textContent = `${val}건 ${(val/total*100).toFixed(1)}%`;
                 labelTop.style.position = 'absolute';
                 labelTop.style.top = '-22px';
                 labelTop.style.left = '50%';
                 labelTop.style.transform = 'translateX(-50%)';
                 labelTop.style.fontSize = '12px';
                 labelTop.style.color = '#222';
                 labelTop.style.whiteSpace = 'nowrap';
                 bar.appendChild(labelTop);
               }
               barArea.appendChild(bar);
               // x축 라벨
               const label = document.createElement('div');
               label.textContent = `${i+1}월`;
               xAxis.appendChild(label);
             });
             chart.appendChild(barArea);
             chart.appendChild(xAxis);
           }
           if (yearSelect) {
             yearSelect.addEventListener('change', function(e) {
               drawBarChart(e.target.value);
             });
           }
           drawBarChart(yearSelect ? yearSelect.value : '');
         }
         return fetch('second.html');
       })
       .then(res => res.text())
       .then(data => {
         secondSection.innerHTML = data;
         return fetch('third.html');
       })
       .then(res => res.text())
       .then(data => {
         thirdSection.innerHTML = data;
         return fetch('fourth.html');
       })
       .then(res => res.text())
       .then(data => {
         fourthSection.innerHTML = data;
         // 모든 section 삽입 후 스크롤 제어
         const anchor = window.location.hash;
         const scrollTargets = {
           '#first': firstSection,
           '#second': secondSection,
           '#third': thirdSection,
           '#fourth': fourthSection
         };
         setTimeout(() => {
           if (scrollTargets[anchor]) {
             scrollTargets[anchor].scrollIntoView({ behavior: 'smooth' });
           } else {
             window.scrollTo(0, 0);
           }
         }, 100);
       });

