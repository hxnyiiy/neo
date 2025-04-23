async function loadStatsAndInsert() {
  try {
    const res = await fetch('/sinkhole_stats.json');
    const stats = await res.json();
    const statCards = document.createElement('div');
    statCards.className = 'stat-cards';
    statCards.innerHTML = `
      <div class="stat-card">
        <div class="triangle-bg"><span class="stat-icon material-symbols-outlined">warning</span></div>
        <span class="stat-title">총 싱크홀</span>
        <span class="stat-value">${stats.total}</span>
      </div>
      <div class="stat-card">
        <div class="triangle-bg"><span class="stat-icon material-symbols-outlined">done_all</span></div>
        <span class="stat-title">복구 완료</span>
        <span class="stat-value">${stats.restored}</span>
      </div>
      <div class="stat-card">
        <div class="triangle-bg"><span class="stat-icon material-symbols-outlined">calendar_month</span></div>
        <span class="stat-title">올해 발생</span>
        <span class="stat-value">${stats.this_year}</span>
      </div>
    `;
    // 지도 위에 삽입 (중복 방지)
    const mapArea = document.querySelector('.map-area');
    if (mapArea && mapArea.parentElement) {
      if (!mapArea.parentElement.querySelector('.stat-cards')) {
        mapArea.parentElement.insertBefore(statCards, mapArea);
      }
    }
  } catch (e) {
    console.error('통계 불러오기 실패:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 홈화면 진입시만 통계 표시
  const content = document.getElementById('content');
  const observer = new MutationObserver(() => {
    if (content.querySelector('.home-flex')) {
      loadStatsAndInsert();
    }
  });
  observer.observe(content, { childList: true, subtree: true });
});
